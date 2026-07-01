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

// ═══════════════════════════════════════════════════════════════════════════════
// URUTAN TETAP KEGIATAN (SESUAI TEMPLATE)
// ═══════════════════════════════════════════════════════════════════════════════
export const URUTAN_DALAM_GEDUNG: string[] = [
  'PENDAFTARAN',
  'SKRINING ILP 1',
  'SKRINING ILP 2',
  'POLI PROLANIS',
  'KLASTER DEWASA-LANSIA 1',
  'KLASTER DEWASA-LANSIA 2',
  'KLASTER IBU KIA & USG',
  'KLASTER ANAK',
  'R. IMUNISASI',
  'R. TINDAKAN',
  'BP GIGI',
  'APOTEK',
  'LAB',
  'R. TB',
  'ADMINISTRASI',
  'PIKET PERSALINAN PAGI',
  'PIKET PERSALINAN SORE',
  'PIKET PERSALINAN MALAM',
  'LIBUR PIKET PERSALINAN',
  'PELAYANAN PUSTU',
];

export const URUTAN_LUAR_GEDUNG: string[] = [
  'Pelacakan dan pengawasan minum obat untuk ODGJ Berat',
  'Pelacakan dan pelaporan kematian dan pelaksanaan otopsi verbal kematian Bayi/balita',
  'Pelaksanaan Kelas Ibu Hamil',
  'Skrining Kesehatan di Sekolah',
  'Pembinaan Kesehatan di Sekolah',
  'Pembinaan Kesehatan di Komunitas',
  'Pelaksanaan skrining dan intervensi hasil skrining masalah Kesehatan jiwa di UKBM/Lembaga',
  'Kunjungan Lapangan Bumil Masalah Gizi',
  'Kunjungan Lapangan Bayi Balita Masalah Gizi',
  'Pendampingan rujukan balita stunting/gizi buruk',
  'Sosialisasi Penyelenggaraan Imunisasi',
  'Pelaksanaan Imunisasi Bayi dan baduta di posyandu',
  'Pelayanan Imunisasi Kejar',
  'Deteksi dini dan cek kesehatan gratis di masyarakat',
  'Pemantauan dan tindak lanjut penyakit tidak menular',
  'Inspeksi Kesehatan Lingkungan (IKL) di sarana fasilitas umum',
  'Inspeksi Kesehatan Lingkungan di Sarana Tempat Pengolahan Pangan (TPP)',
  'Inspeksi Kesehatan Lingkungan di Sarana Air Minum',
  'Pemberdayaan kader masyarakat melalui pemicuan untuk implementasi pilar 2-5 STBM',
  'Monitoring Pemberdayaan kader masyarakat melalui pemicuan untuk implementasi pilar 2-5 STBM',
  'Verifikasi Pemberdayaan kader masyarakat melalui pemicuan untuk implementasi pilar 2-5 STBM',
  'Pemantauan minum obat dan terapi pencegahan TBC',
  'Penemuan Kasus Aktif TB',
  'Pelacakan Kasus Mangkir',
  'Investigasi Kasus TB',
  'Penemuan kasus dan deteksi dini pneumonia',
  'Kunjungan ulang 60 hari AFP',
  'Penemuan dan tindak lanjut penyakit tropis terabaikan',
  'Pemantauan bayi usia 9-12 bulan yang lahir dari ibu Hepatitis B',
  'Pemantauan status bayi dari ibu positif HIV/sifilis',
  'Pemeriksaan Jentik Nyamuk (survei Vektor DBD)',
  'PSN oleh kader G1R1J',
  'Larvasidasi DBD',
  'Pengasapan Atau Fogging Nyamuk',
  'Surveilans Kualitas Air Minum Rumah Tangga (KAMRT)',
  'Penyelidikan Kasus Epidemiologi Penyakit Kasus Penyakit menular',
  'Verifikasi Sinyal penyakit potensial wabah/KLB',
  'Penyelidikan Epidimiologi Penyakit Arbovirosis',
  'Penyelidikan Epidimiologi Penyakit Zoonosis',
  'Pendampingan pelaksanaan ILP di pustu dan Unit Pelayanan Kesehatan Desa/Kelurahan (UPKD/K)',
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER: SORT KEGIATAN BERDASARKAN URUTAN TETAP
// ═══════════════════════════════════════════════════════════════════════════════
function sortKegiatanByOrder(
  items: { kegiatan: string; hari: Record<string, string> }[],
  orderArray: string[]
): { kegiatan: string; hari: Record<string, string> }[] {
  return [...items].sort((a, b) => {
    const indexA = orderArray.findIndex(k => 
      k.toUpperCase() === a.kegiatan.toUpperCase() ||
      k.toUpperCase().replace(/\s+/g, '') === a.kegiatan.toUpperCase().replace(/\s+/g, '')
    );
    const indexB = orderArray.findIndex(k => 
      k.toUpperCase() === b.kegiatan.toUpperCase() ||
      k.toUpperCase().replace(/\s+/g, '') === b.kegiatan.toUpperCase().replace(/\s+/g, '')
    );
    
    // Jika tidak ada di array urutan, taruh di akhir
    const safeIndexA = indexA === -1 ? 9999 : indexA;
    const safeIndexB = indexB === -1 ? 9999 : indexB;
    
    return safeIndexA - safeIndexB;
  });
}

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
// GENERATE EXCEL
export async function generateExcel(data: Kegiatan[]): Promise<void> {
  if (!data.length) return;
  
  const workbook = new ExcelJS.Workbook();
  
  // Extract bulan dan tahun dari data untuk nama file
  const dates = data.map(d => new Date(d.tanggal));
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const bulanName = minDate.toLocaleDateString('id-ID', { month: 'long' }).toUpperCase();
  const tahun = minDate.getFullYear();
  
  // Nama file: DATABASE KEGIATAN [BULAN] [TAHUN].xlsx
  const actualFilename = `DATABASE KEGIATAN ${bulanName} ${tahun}.xlsx`;
  
  // Buat 1 sheet saja (tidak per minggu)
  const worksheet = workbook.addWorksheet('DATABASE KEGIATAN');
  
  // MAPPING LOKASI KE KELURAHAN
  const lokasiToKelurahan: Record<string, string> = {
    // Dalam Gedung
    'Dalam Gedung': 'Tamansari',
    'Pustu Ciangir': 'Tamansari',
    'Pustu Sumelap': 'Sumelap',
    
    // Posyandu - SUMELAP
    'Posyandu Cieurih': 'Sumelap',
    'Posyandu Liunggunung': 'Sumelap',
    'Posyandu Kadupandak': 'Sumelap',
    'Posyandu Perum Puri Sumelap': 'Sumelap',
    'Posyandu Babakan Jati': 'Sumelap',
    'Posyandu Sumelap': 'Sumelap',
    'Posyandu Sukaasih': 'Sumelap',
    'Posyandu Perum Sukawening': 'Sumelap',
    'Posyandu Cigintung': 'Sumelap',
    'Posyandu Ciharashas': 'Sumelap',
    
    // Posyandu - TAMANJAYA
    'Posyandu Kubangsari': 'Tamanjaya',
    'Posyandu Malingping': 'Tamanjaya',
    'Posyandu Sindangreret': 'Tamanjaya',
    'Posyandu Karisma': 'Tamanjaya',
    'Posyandu Cibeureum': 'Tamanjaya',
    'Posyandu Nagarasari': 'Tamanjaya',
    'Posyandu Situdukun': 'Tamanjaya',
    'Posyandu Gegernoong': 'Tamanjaya',
    'Posyandu Taman': 'Tamanjaya',
    'Posyandu Harapan Bunda': 'Tamanjaya',
    'Posyandu Kasih Bunda': 'Tamanjaya',
    'Posyandu Cidahu': 'Tamanjaya',
    'Posyandu Perum Nusa Indah': 'Tamanjaya',
    'Posyandu Bantarsari': 'Tamanjaya',
    
    // Posyandu - MUGARSARI
    'Posyandu Selaawi': 'Mugarsari',
    'Posyandu Sidamulih': 'Mugarsari',
    'Posyandu Bbk.Cipasung': 'Mugarsari',
    'Posyandu Nangela': 'Mugarsari',
    'Posyandu Jatiwangi': 'Mugarsari',
    'Posyandu Cipasung': 'Mugarsari',
    'Posyandu Kubang': 'Mugarsari',
    'Posyandu Nyantong': 'Mugarsari',
    
    // Posyandu - TAMANSARI
    'Posyandu Sinargalih': 'Tamansari',
    'Posyandu Ciatal': 'Tamansari',
    'Posyandu Bandung': 'Tamansari',
    'Posyandu Cipajaran': 'Tamansari',
    'Posyandu Situhiang': 'Tamansari',
    'Posyandu Ciledug': 'Tamansari',
    'Posyandu Selakaso': 'Tamansari',
    'Posyandu Cipamutih': 'Tamansari',
    'Posyandu Sangkali': 'Tamansari',
    'Posyandu Ciangir': 'Tamansari',
    'Posyandu Cipangebak': 'Tamansari',
    
    // Posbindu
    'Posbindu Cigintung': 'Sumelap',
    'Posbindu Sindangreret': 'Tamanjaya',
    'Posbindu Sidamulih': 'Mugarsari',
    'Posbindu Sumelap': 'Sumelap',
    'Posbindu Taman': 'Tamanjaya',
    'Posbindu Jatiwangi': 'Mugarsari',
    'Posbindu Cipamutih': 'Tamansari',
    'Posbindu Nagarasari': 'Tamanjaya',
    'Posbindu Sukaasih': 'Sumelap',
    'Posbindu Cidahu': 'Tamanjaya',
    'Posbindu Perum Tamanjaya': 'Tamanjaya',
    'Posbindu Sindangreret RW 05': 'Tamanjaya',
    
    // Pos Remaja
    'Pos Yandu Remaja Kereta': 'Tamanjaya',
    'Pos Yandu Remaja Sakura': 'Tamanjaya',
    
    // UKK
    'CV. Katumbiri': 'Sumelap',
    'Pasar Geger Noong': 'Tamanjaya',
    
    // Sekolah/Pesantren
    'SMP Bustanul Ulum': 'Sumelap',
    'MI dan MTS Al Hidayah': 'Tamansari',
  };
  
  const getKelurahan = (lokasi: string): string => {
    return lokasiToKelurahan[lokasi] || 'Tamansari';
  };
  
  const getKategori = (kategori: string): string => {
    return kategori === 'dalam_gedung' ? 'DALAM GEDUNG' : 'LUAR GEDUNG';
  };
  
  const getLokasiDisplay = (item: Kegiatan): string => {
    if (item.kategori === 'dalam_gedung') {
      return 'Puskesmas';
    }
    return item.lokasi;
  };
  
  // Format tanggal: DD/MM/YYYY
  const formatTanggalExcel = (tanggal: string): string => {
    const date = new Date(tanggal);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  // TRANSFORM DATA KE FORMAT FLAT
  interface FlatRow {
    tanggal: string;
    nama_kegiatan: string;
    pelaksana: string;
    lokasi: string;
    kelurahan: string;
    kategori: string;
  }
  
  const flatRows: FlatRow[] = [];
  
  data.forEach(item => {
    const penyertaList = parsePenyerta(item.penyerta);
    const kelurahan = getKelurahan(item.lokasi);
    const kategori = getKategori(item.kategori);
    const lokasiDisplay = getLokasiDisplay(item); 
    
    if (penyertaList.length === 0) {
      // Jika tidak ada penyerta, tetap buat 1 baris dengan pelaksana kosong
      flatRows.push({
        tanggal: item.tanggal,
        nama_kegiatan: item.kegiatan,
        pelaksana: '',
        lokasi: lokasiDisplay, 
        kelurahan: kelurahan,
        kategori: kategori,
      });
    } else {
      // 1 pelaksana per baris
      penyertaList.forEach((pelaksana) => {
        flatRows.push({
          tanggal: item.tanggal,
          nama_kegiatan: item.kegiatan,
          pelaksana: pelaksana,
          lokasi: lokasiDisplay, 
          kelurahan: kelurahan,
          kategori: kategori,
        });
      });
    }
  });

  // SORT DATA
  flatRows.sort((a, b) => {
    // 1. Sort tanggal (ascending)
    const dateA = new Date(a.tanggal).getTime();
    const dateB = new Date(b.tanggal).getTime();
    if (dateA !== dateB) return dateA - dateB;
    
    // 2. Sort kategori (Dalam Gedung dulu, baru Luar Gedung)
    if (a.kategori !== b.kategori) {
      return a.kategori === 'DALAM GEDUNG' ? -1 : 1;
    }
    
    // 3. Sort nama kegiatan sesuai urutan template
    const allUrutan = [...URUTAN_DALAM_GEDUNG, ...URUTAN_LUAR_GEDUNG];
    const indexA = allUrutan.findIndex(k => 
      k.toUpperCase() === a.nama_kegiatan.toUpperCase() ||
      k.toUpperCase().replace(/\s+/g, '') === a.nama_kegiatan.toUpperCase().replace(/\s+/g, '')
    );
    const indexB = allUrutan.findIndex(k => 
      k.toUpperCase() === b.nama_kegiatan.toUpperCase() ||
      k.toUpperCase().replace(/\s+/g, '') === b.nama_kegiatan.toUpperCase().replace(/\s+/g, '')
    );
    const safeIndexA = indexA === -1 ? 9999 : indexA;
    const safeIndexB = indexB === -1 ? 9999 : indexB;
    
    return safeIndexA - safeIndexB;
  });
  
  // HEADER
  const headers = ['NO', 'TANGGAL', 'NAMA KEGIATAN', 'PELAKSANA', 'LOKASI', 'KELURAHAN', 'KELURAHAN'];
  
  const headerRow = worksheet.getRow(1);
  headerRow.values = headers;
  headerRow.font = { bold: true, size: 11, color: { argb: 'FF000000' } };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: false };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7EB' } }; // Abu-abu
  headerRow.height = 25;
  
  // Border header
  headerRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // LEBAR KOLOM
  worksheet.getColumn(1).width = 6;   // NO
  worksheet.getColumn(2).width = 14;  // TANGGAL
  worksheet.getColumn(3).width = 85;  // NAMA KEGIATAN
  worksheet.getColumn(4).width = 45;  // PELAKSANA
  worksheet.getColumn(5).width = 35;  // LOKASI
  worksheet.getColumn(6).width = 15;  // KELURAHAN
  worksheet.getColumn(7).width = 18;  // KATEGORI
  
  // DATA ROWS
  flatRows.forEach((row, idx) => {
    const dataRow = worksheet.getRow(idx + 2);
    dataRow.values = [
      idx + 1,                              // NO
      formatTanggalExcel(row.tanggal),      // TANGGAL
      row.nama_kegiatan,                    // NAMA KEGIATAN
      row.pelaksana,                        // PELAKSANA
      row.lokasi,                           // LOKASI (sudah di-transform: "Puskesmas" untuk dalam gedung)
      row.kelurahan,                        // KELURAHAN
      row.kategori,                         // KATEGORI
    ];
    
    // Alignment per kolom
    dataRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle', wrapText: false }; // NO
    dataRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle', wrapText: false }; // TANGGAL
    dataRow.getCell(3).alignment = { horizontal: 'left', vertical: 'middle', wrapText: false };   // NAMA KEGIATAN
    dataRow.getCell(4).alignment = { horizontal: 'left', vertical: 'middle', wrapText: false };   // PELAKSANA
    dataRow.getCell(5).alignment = { horizontal: 'left', vertical: 'middle', wrapText: false };   // LOKASI
    dataRow.getCell(6).alignment = { horizontal: 'center', vertical: 'middle', wrapText: false }; // KELURAHAN
    dataRow.getCell(7).alignment = { horizontal: 'center', vertical: 'middle', wrapText: false }; // KATEGORI
    
    // Font normal (tidak bold)
    dataRow.font = { size: 11 };
    
    // Border tipis
    dataRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      if (colNumber <= 7) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    });
    
    dataRow.height = 20;
  });
  
  // GENERATE & DOWNLOAD FILE
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = actualFilename; // Nama file: DATABASE KEGIATAN [BULAN] [TAHUN].xlsx
  a.click();
  URL.revokeObjectURL(url);
}

// ─── GENERATE PDF ───────────────────────────────────────────────────────────
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
    
    // Format subtitle sesuai template
    const formatRange = (date: Date) => {
      const day = date.getDate();
      const month = date.toLocaleDateString('id-ID', { month: 'long' }).toUpperCase();
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    };
    
    const tanggalRange = `${formatRange(minDate)} S/D ${formatRange(maxDate)}`;
    
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
    
    // Helper untuk render table dengan urutan tetap
    const renderSection = (sectionTitle: string, items: { kegiatan: string; hari: Record<string, string> }[], urutan: string[]) => {
      if (items.length === 0) return;
      
      // Sort kegiatan sesuai urutan template
      const sortedItems = sortKegiatanByOrder(items, urutan);
      
      // Siapkan data rows dengan nama stacked vertikal
      const rows = sortedItems.map(row => [
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
    
    // Render RUANG PELAYANAN (dalam gedung) dengan urutan template
    if (dalamGedung.length > 0) {
      const pivoted = pivotByHari(dalamGedung);
      renderSection('RUANG PELAYANAN', pivoted, URUTAN_DALAM_GEDUNG);
    }
    
    // Render KEGIATAN LUAR GEDUNG dengan urutan template
    if (luarGedung.length > 0) {
      if (startY > pageHeight - 30) {
        doc.addPage();
        startY = 10;
      }
      const pivoted = pivotByHari(luarGedung);
      renderSection('KEGIATAN LUAR GEDUNG', pivoted, URUTAN_LUAR_GEDUNG);
    }
  });
  
  doc.save('jadwal.pdf');
}