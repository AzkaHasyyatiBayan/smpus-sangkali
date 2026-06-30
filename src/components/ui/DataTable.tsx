interface DataTableProps {
  columns: string[];
  rows: string[][];
  onRowSelect?: (idx: number) => void;
  selectedRows?: number[];
}

export default function DataTable({ columns, rows, onRowSelect, selectedRows = [] }: DataTableProps) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {onRowSelect && <th className="px-3 py-3 w-8"></th>}
            {columns.map((col, i) => (
              <th key={i} className="px-3 py-3 text-left font-semibold text-gray-700">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map((row, idx) => (
            <tr key={idx} className={selectedRows.includes(idx) ? 'bg-puskesmas-50' : 'hover:bg-gray-50'}>
              {onRowSelect && (
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(idx)}
                    onChange={() => onRowSelect(idx)}
                    className="rounded"
                  />
                </td>
              )}
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 whitespace-pre-wrap">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}