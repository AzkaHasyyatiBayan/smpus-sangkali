import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { Kegiatan } from '@/types';

export function parsePenyerta(teks: string): string[] {
  if (!teks) return [];
  if (teks.includes(';')) return teks.split(';').map(p => p.trim()).filter(Boolean);
  return teks.split(/,(?= [A-Z])/).map(p => p.trim()).filter(Boolean);
}

export function formatTanggal(tanggal: string, full = true): string {
  const date = new Date(tanggal);
  const options: Intl.DateTimeFormatOptions = full
    ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    : { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
}

export const bulanOptions: string[] = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
];

// ─── GROUP BY WEEK ──────────────────────────────────────────────────────────
function groupByWeek(data: Kegiatan[]): Map<string, Kegiatan[]> {
  const weeks = new Map<string, Kegiatan[]>();
  
  data.forEach(item => {
    const date = new Date(item.tanggal);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const weekNum = Math.ceil((date.getDate() + firstDay) / 7);
    const weekKey = `${year}-${month + 1}-W${weekNum}`;
    
    if (!weeks.has(weekKey)) {
      weeks.set(weekKey, []);
    }
    weeks.get(weekKey)!.push(item);
  });
  
  return weeks;
}

// ─── GET HEADER HARI DENGAN TANGGAL LENGKAP ─────────────────────────────────
function getHeaderHariDenganTanggal(weekData: Kegiatan[]): { label: string; isMinggu: boolean }[] {
  const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  
  const dates = weekData.map(d => new Date(d.tanggal));
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  
  const dayOfWeek = minDate.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const senin = new Date(minDate);
  senin.setDate(minDate.getDate() - diff);
  
  return hariList.map((_, idx) => {
    const tanggal = new Date(senin);
    tanggal.setDate(senin.getDate() + idx);
    const isMinggu = tanggal.getDay() === 0;
    return {
      label: formatTanggal(tanggal.toISOString().slice(0, 10), true),
      isMinggu,
    };
  });
}

// ─── PIVOT DATA PER MINGGU ──────────────────────────────────────────────────
function pivotByHari(data: Kegiatan[]): { kegiatan: string; hari: Record<string, string> }[] {
  const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const kegiatanMap = new Map<string, Record<string, string[]>>();
  
  data.forEach(item => {
    const date = new Date(item.tanggal);
    const hari = hariList[date.getDay() === 0 ? 6 : date.getDay() - 1];
    
    if (!kegiatanMap.has(item.kegiatan)) {
      kegiatanMap.set(item.kegiatan, {});
    }
    
    const hariData = kegiatanMap.get(item.kegiatan)!;
    if (!hariData[hari]) {
      hariData[hari] = [];
    }
    
    const penyertaList = parsePenyerta(item.penyerta);
    hariData[hari].push(...penyertaList);
  });
  
  return Array.from(kegiatanMap.entries()).map(([kegiatan, hari]) => {
    const hariFormatted: Record<string, string> = {};
    hariList.forEach(h => {
      hariFormatted[h] = hari[h] ? [...new Set(hari[h])].join('\n') : '';
    });
    return { kegiatan, hari: hariFormatted };
  });
}

// ─── GENERATE EXCEL (SESUAI TEMPLATE) ───────────────────────────────────────
export async function generateExcel(data: Kegiatan[], filename = 'jadwal.xlsx'): Promise<void> {
  if (!data.length) return;
  
  const workbook = new ExcelJS.Workbook();
  const weeks = groupByWeek(data);
  const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  
  // Warna sesuai template
  const GRAY_FILL = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFE5E7EB' } };
  const MERAH_FILL = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFDC2626' } };
  
  weeks.forEach((weekData, weekKey) => {
    const weekNum = weekKey.split('W')[1];
    const sheetName = `Minggu ${weekNum}`;
    
    const worksheet = workbook.addWorksheet(sheetName);
    
    const dates = weekData.map(d => new Date(d.tanggal));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const tanggalRange = `${formatTanggal(minDate.toISOString().slice(0, 10), false).toUpperCase()} S/D ${formatTanggal(maxDate.toISOString().slice(0, 10), false).toUpperCase()}`;
    
    const headerHariData = getHeaderHariDenganTanggal(weekData);
    const headerHariLabels = headerHariData.map(h => h.label);
    
    worksheet.getColumn(1).width = 35;
    for (let i = 2; i <= 8; i++) {
      worksheet.getColumn(i).width = 18;
    }
    
    let currentRow = 1;
    
    // Title - hitam (sesuai template)
    worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
    const titleCell = worksheet.getCell(`A${currentRow}`);
    titleCell.value = 'JADWAL PELAYANAN PUSKESMAS SANGKALI';
    titleCell.font = { size: 16, bold: true, color: { argb: 'FF000000' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    currentRow++;
    
    // Subtitle
    worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
    const subtitleCell = worksheet.getCell(`A${currentRow}`);
    subtitleCell.value = tanggalRange;
    subtitleCell.font = { size: 12, bold: true, color: { argb: 'FF000000' } };
    subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    currentRow++;
    
    currentRow++;
    
    const dalamGedung = weekData.filter(d => d.kategori === 'dalam_gedung');
    const luarGedung = weekData.filter(d => d.kategori === 'luar_gedung');
    
    // Helper: render section table
    const renderSection = (sectionTitle: string, items: { kegiatan: string; hari: Record<string, string> }[]) => {
      if (items.length === 0) return;
      
      // Header baris: section title sebagai kolom pertama
      const headerRow = worksheet.getRow(currentRow);
      headerRow.values = [sectionTitle, ...headerHariLabels];
      headerRow.font = { bold: true, color: { argb: 'FF000000' } };
      headerRow.fill = GRAY_FILL;
      headerRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      headerRow.height = 40;
      
      // Border header
      headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        if (colNumber <= 8) {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          // Minggu = merah background (kolom 2-8)
          if (colNumber >= 2 && colNumber <= 8) {
            const isMinggu = headerHariData[colNumber - 2]?.isMinggu;
            if (isMinggu) {
              cell.fill = MERAH_FILL;
              cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            }
          }
        }
      });
      
      currentRow++;
      
      // Data rows - tanpa background warna (sesuai template)
      items.forEach((row) => {
        const dataRow = worksheet.getRow(currentRow);
        dataRow.values = [row.kegiatan, ...hariList.map(h => row.hari[h] || '')];
        dataRow.alignment = { vertical: 'top', wrapText: true };
        dataRow.height = 30;
        
        dataRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          if (colNumber <= 8) {
            // Cell kosong = abu-abu (sesuai template)
            const isEmpty = !cell.value || cell.value.toString().trim() === '';
            if (isEmpty) {
              cell.fill = GRAY_FILL;
            }
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          }
        });
        
        currentRow++;
      });
      
      currentRow += 2;
    };
    
    // Render section Dalam Gedung
    if (dalamGedung.length > 0) {
      const pivoted = pivotByHari(dalamGedung);
      renderSection('RUANG PELAYANAN', pivoted);
    }
    
    // Render section Luar Gedung
    if (luarGedung.length > 0) {
      const pivoted = pivotByHari(luarGedung);
      renderSection('KEGIATAN LUAR GEDUNG', pivoted);
    }
  });
  
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
// ─── GENERATE PDF ─────────────────────────────
export function generatePDF(data: Kegiatan[], title = 'JADWAL PELAYANAN PUSKESMAS SANGKALI'): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const weeks = groupByWeek(data);
  const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  
  // Helper: format nama dengan line break untuk vertical stacking
  const formatNamesVertical = (text: string): string => {
    if (!text) return '';
    const names = parsePenyerta(text);
    return names.join('\n'); // Stack vertically dengan newline
  };
  
  let isFirstPage = true;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  weeks.forEach((weekData) => {
    if (!isFirstPage) {
      doc.addPage();
    }
    isFirstPage = false;
    
    const dates = weekData.map(d => new Date(d.tanggal));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const tanggalRange = `${formatTanggal(minDate.toISOString().slice(0, 10), false).toUpperCase()} S/D ${formatTanggal(maxDate.toISOString().slice(0, 10), false).toUpperCase()}`;
    
    // Title - hitam, horizontal
    doc.setFontSize(14);
    doc.setTextColor('#000000');
    doc.setFont('helvetica', 'bold');
    doc.text(title, pageWidth / 2, 10, { align: 'center' });
    
    // Subtitle
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(tanggalRange, pageWidth / 2, 16, { align: 'center' });
    
    const dalamGedung = weekData.filter(d => d.kategori === 'dalam_gedung');
    const luarGedung = weekData.filter(d => d.kategori === 'luar_gedung');
    
    const headerHariData = getHeaderHariDenganTanggal(weekData);
    const headerHariLabels = headerHariData.map(h => h.label);
    
    let startY = 22;
    
    // Helper untuk render table
    const renderSection = (sectionTitle: string, items: { kegiatan: string; hari: Record<string, string> }[]) => {
      if (items.length === 0) return;
      
      // Siapkan data rows dengan nama stacked vertikal
      const rows = items.map(row => [
        row.kegiatan,
        ...hariList.map(h => formatNamesVertical(row.hari[h] || ''))
      ]);
      
      // Hitung lebar kolom yang SAMA untuk semua 8 kolom
      const tableWidth = pageWidth - 10;
      const colWidth = tableWidth / 8;
      
      autoTable(doc, {
        head: [[sectionTitle, ...headerHariLabels]],
        body: rows,
        startY: startY,
        styles: { 
          fontSize: 6, 
          cellPadding: 0.5, 
          halign: 'left',
          valign: 'top',
          overflow: 'linebreak',
          cellWidth: colWidth, // Semua kolom lebar sama
          lineColor: '#9ca3af',
          lineWidth: 0.1,
          textColor: '#000000',
          font: 'helvetica',
        },
        headStyles: { 
          fillColor: '#e5e7eb',
          textColor: '#000000', 
          fontStyle: 'bold',
          fontSize: 6,
          halign: 'center',
        },
        bodyStyles: { 
          lineColor: '#d1d5db', 
          lineWidth: 0.1,
          halign: 'left',
          valign: 'top',
        },
        columnStyles: {
          0: { cellWidth: colWidth, fontStyle: 'bold', halign: 'left' },
        },
        margin: { left: 5, right: 5, top: 0, bottom: 0 },
        tableWidth: tableWidth,
        didDrawCell: (data) => {
          // Kolom header Minggu = merah background dengan text putih
          if (data.section === 'head' && data.column.index > 0) {
            const colIndex = data.column.index - 1;
            if (headerHariData[colIndex]?.isMinggu) {
              // Set background merah
              doc.setFillColor(220, 38, 38);
              doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
              
              // Set text putih dan bold
              doc.setTextColor('#ffffff');
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(6);
              
              // Dapatkan text header (hari, tanggal)
              const headerText = String(data.cell.text);
              
              // Split text menjadi array untuk multi-line
              const lines = doc.splitTextToSize(headerText, data.cell.width - 1);
              
              // Hitung posisi Y untuk center vertical
              const textHeight = lines.length * 2; // 2mm per line
              const yPosition = data.cell.y + (data.cell.height - textHeight) / 2 + 1;
              
              // Draw text di center
              doc.text(
                lines,
                data.cell.x + data.cell.width / 2,
                yPosition,
                { align: 'center' }
              );
            }
          }
        },
        didDrawPage: () => {
          // Footer
          doc.setFontSize(8);
          doc.setTextColor('#808080');
          doc.setFont('helvetica', 'normal');
          doc.text(`Puskesmas Sangkali © ${new Date().getFullYear()}`, 5, pageHeight - 5);
        }
      });
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      startY = (doc as any).lastAutoTable.finalY + 5;
    };
    
    // Render RUANG PELAYANAN (dalam gedung)
    if (dalamGedung.length > 0) {
      const pivoted = pivotByHari(dalamGedung);
      renderSection('RUANG PELAYANAN', pivoted);
    }
    
    // Render KEGIATAN LUAR GEDUNG
    if (luarGedung.length > 0) {
      if (startY > pageHeight - 30) {
        doc.addPage();
        startY = 10;
      }
      const pivoted = pivotByHari(luarGedung);
      renderSection('KEGIATAN LUAR GEDUNG', pivoted);
    }
  });
  
  doc.save('jadwal.pdf');
}