import { useMemo, useState, type ReactNode } from "react";
import { 
  HiChevronUp, HiChevronDown, HiChevronLeft, HiChevronRight, 
  HiSearch, HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight 
} from "react-icons/hi";

export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  sortable?: boolean;
  filterable?: boolean;
  align?: "start" | "center" | "end" | "right";
  cell?: (row: T) => ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  initialSort?: { column: string; direction: "ascending" | "descending" } | null;
  pageSizeOptions?: number[];
  initialPageSize?: number;
  selectable?: boolean;
  selectedIds?: (string | number)[];
  setSelectedIds?: React.Dispatch<React.SetStateAction<(string | number)[]>>;
  onRowDoubleClick?: (row: T) => void;
  showFilters?: boolean;
  pagination?: boolean; // Prop para activar/desactivar paginación
}

export default function DataTable<T extends { id: string | number }>({
  data = [],
  columns = [],
  initialSort = null,
  pageSizeOptions = [10, 20, 50, 100],
  initialPageSize = 20,
  selectable = false,
  selectedIds = [],
  setSelectedIds = () => {},
  onRowDoubleClick = () => {},
  showFilters = true,
  pagination = true, // Por defecto activada
}: DataTableProps<T>) {
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string | null;
    direction: "ascending" | "descending";
  }>(initialSort || { column: null, direction: "ascending" });

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handleSort = (columnId: string) => {
    setSortDescriptor((prev) => ({
      column: columnId,
      direction: prev.column === columnId && prev.direction === "ascending" ? "descending" : "ascending",
    }));
  };

  // --- FILTRADO ---
  const filteredData = useMemo(() => {
    const activeFilters = Object.entries(filters).filter(([_, val]) => val.trim() !== "");
    
    if (!showFilters || activeFilters.length === 0) return data;

    return data.filter((row) =>
      activeFilters.every(([accessor, filterValue]) => {
        const column = columns.find(c => c.accessor === accessor);
        if (!column) return true;

        let valueToCompare: any;

        if (column.cell) {
          const rendered = column.cell(row);
          if (typeof rendered === 'string' || typeof rendered === 'number') {
            valueToCompare = rendered;
          } else {
            valueToCompare = row[accessor as keyof T];
          }
        } else {
          valueToCompare = row[accessor as keyof T];
        }

        if (valueToCompare == null) return false;

        return String(valueToCompare)
          .toLowerCase()
          .includes(filterValue.toLowerCase().trim());
      })
    );
  }, [data, filters, columns, showFilters]);

  // --- ORDENAMIENTO ---
  const sortedData = useMemo(() => {
    if (!sortDescriptor.column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof T];
      const second = b[sortDescriptor.column as keyof T];

      if (first == null) return 1;
      if (second == null) return -1;

      const isFirstNumeric = !isNaN(Number(first)) && typeof first !== 'boolean';
      const isSecondNumeric = !isNaN(Number(second)) && typeof second !== 'boolean';

      if (isFirstNumeric && isSecondNumeric) {
        return sortDescriptor.direction === "ascending"
          ? Number(first) - Number(second)
          : Number(second) - Number(first);
      }

      return sortDescriptor.direction === "ascending"
        ? String(first).localeCompare(String(second), "es", { numeric: true, sensitivity: 'base' })
        : String(second).localeCompare(String(first), "es", { numeric: true, sensitivity: 'base' });
    });
  }, [filteredData, sortDescriptor]);

  // --- LÓGICA DE PAGINACIÓN / VISTA COMPLETA ---
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData; // Si pagination es false, devolvemos todo
    const start = page * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize, pagination]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));

  return (
    <div className="flex flex-col h-full bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl overflow-hidden text-slate-300">
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-30 bg-[#1e293b]">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-4 border-b border-[#334155] text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-blue-500 cursor-pointer rounded border-[#4a5568] bg-[#0f172a]"
                    checked={paginatedData.length > 0 && paginatedData.every((r) => selectedIds.includes(r.id))}
                    onChange={(e) => {
                      const ids = paginatedData.map((r) => r.id);
                      setSelectedIds(prev => e.target.checked ? Array.from(new Set([...prev, ...ids])) : prev.filter(id => !ids.includes(id)));
                    }}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={String(col.accessor)}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(String(col.accessor))}
                  className={`px-4 py-4 border-b border-[#334155] text-[13px] font-semibold text-slate-100 select-none
                    ${col.sortable ? "cursor-pointer hover:bg-[#334155]/50 transition-colors" : ""}
                    ${col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"}`}
                >
                  <div className={`flex items-center gap-1.5 ${col.align === "center" ? "justify-center" : col.align === "right" ? "justify-end" : ""}`}>
                    {col.header}
                    {col.sortable && (
                      <span className="text-slate-500">
                         {sortDescriptor.column === col.accessor ? (
                          sortDescriptor.direction === "ascending" ? <HiChevronUp size={14} className="text-blue-500" /> : <HiChevronDown size={14} className="text-blue-500" />
                        ) : (
                          <div className="flex flex-col -space-y-1 opacity-30">
                             <HiChevronUp size={10} />
                             <HiChevronDown size={10} />
                          </div>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>

            {showFilters && (
              <tr className="bg-[#1e293b]/50">
                {selectable && <th className="border-b border-[#334155]" />}
                {columns.map((col) => (
                  <th key={`filter-${String(col.accessor)}`} className="px-2 py-2 border-b border-[#334155]">
                    {col.filterable ? (
                      <div className="relative">
                        <input
                          type="text"
                          value={filters[col.accessor as string] || ""}
                          onChange={(e) => { 
                            setFilters(prev => ({ ...prev, [col.accessor as string]: e.target.value })); 
                            setPage(0); 
                          }}
                          placeholder="Buscar..."
                          className="w-full bg-[#0f172a]/40 border border-[#334155] text-slate-300 text-xs rounded-lg py-1.5 pl-3 pr-8 outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                        />
                        <HiSearch className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                      </div>
                    ) : null}
                  </th>
                ))}
              </tr>
            )}
          </thead>

          <tbody className="divide-y divide-[#334155]/40 bg-[#1e293b]">
            {paginatedData.map((row) => (
              <tr
                key={String(row.id)}
                onDoubleClick={() => onRowDoubleClick(row)}
                className={`group transition-colors duration-150 ${selectedIds.includes(row.id) ? "bg-blue-600/10" : "hover:bg-[#334155]/30"}`}
              >
                {selectable && (
                  <td className="px-4 py-3.5 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => setSelectedIds(prev => prev.includes(row.id) ? prev.filter(x => x !== row.id) : [...prev, row.id])}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={String(col.accessor)} className={`px-4 py-3.5 text-[13px] text-slate-300 font-medium ${col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"}`}>
                    {col.cell ? col.cell(row) : (row[col.accessor as keyof T] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-3 text-center text-slate-500 text-sm italic">
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer renderizado solo si la paginación está activa */}
      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 bg-[#1e293b] border-t border-[#334155]">
          <div className="flex items-center bg-[#0f172a]/30 border border-[#334155] rounded-xl p-1">
            <button onClick={() => setPage(0)} disabled={page === 0} className="p-2 text-slate-500 hover:text-white disabled:opacity-10 transition-colors"><HiOutlineChevronDoubleLeft size={18}/></button>
            <button onClick={() => setPage(p => p - 1)} disabled={page === 0} className="p-2 text-slate-500 hover:text-white disabled:opacity-10 transition-colors"><HiChevronLeft size={18}/></button>
            <div className="flex items-center px-4">
              <span className="text-slate-400 text-sm font-semibold">
                {sortedData.length > 0 ? page * pageSize + 1 : 0} - {Math.min((page + 1) * pageSize, sortedData.length)} de {sortedData.length}
              </span>
            </div>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} className="p-2 text-slate-500 hover:text-white disabled:opacity-10 transition-colors"><HiChevronRight size={18}/></button>
            <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1} className="p-2 text-slate-500 hover:text-white disabled:opacity-10 transition-colors"><HiOutlineChevronDoubleRight size={18}/></button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm">Ítems por página:</span>
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
                className="appearance-none bg-[#0f172a]/50 border border-[#334155] text-slate-200 text-sm rounded-lg pl-4 pr-10 py-2 outline-none focus:border-blue-500/50 cursor-pointer"
              >
                {pageSizeOptions.map((opt) => <option key={opt} value={opt} className="bg-[#1e293b]">{opt}</option>)}
              </select>
              <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}