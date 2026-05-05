import { useState, useRef, useEffect, type KeyboardEvent, type ReactNode } from "react";
import { HiChevronDown, HiMiniXMark } from "react-icons/hi2";

type Option = {
    label: ReactNode;
    value: string | number;
    searchTerms?: string;
};

type SelectCustomProps = {
    options: Option[];
    value: string | number | null | undefined;
    onChange: (value: string | number | "") => void;
    placeholder?: string;
    isClearable?: boolean;
    disabled?: boolean;
    searchable?: boolean; // Prop para habilitar/deshabilitar filtro
    icon?: ReactNode;
    className?: string;
};

export default function SelectCustom({
    options = [],
    value,
    onChange,
    placeholder = "Seleccione",
    isClearable = true,
    disabled = false,
    searchable = true, // Por defecto está habilitado
    icon,
    className = ""
}: SelectCustomProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [highlightIndex, setHighlightIndex] = useState(0);
    const [dropdownDirection, setDropdownDirection] = useState<"top" | "bottom">("bottom");

    const ref = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const selected = options.find((opt) => opt.value === value);

    // Filtrado condicional según la prop searchable
    const filtered = searchable 
        ? options.filter((opt) => {
            const term = opt.searchTerms || (typeof opt.label === "string" ? opt.label : "");
            return term.toLowerCase().includes(search.toLowerCase());
          })
        : options;

    // Cerrar al hacer click afuera
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Resetear el resaltado cuando cambia la búsqueda
    useEffect(() => {
        setHighlightIndex(0);
    }, [search]);

    // Lógica de posicionamiento (arriba o abajo)
    useEffect(() => {
        if (!open) return;
        const handlePosition = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                const spaceAbove = rect.top;
                setDropdownDirection(spaceBelow < 300 && spaceAbove > spaceBelow ? "top" : "bottom");
            }
        };
        handlePosition();
        window.addEventListener("resize", handlePosition);
        return () => window.removeEventListener("resize", handlePosition);
    }, [open]);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement | HTMLInputElement>) => {
        if (disabled) return;
        if (!open) {
            if (e.key === "ArrowDown" || e.key === "Enter") setOpen(true);
            return;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        if (e.key === "Enter") {
            e.preventDefault();
            const selectedOption = filtered[highlightIndex];
            if (selectedOption) {
                onChange(selectedOption.value);
                setOpen(false);
                setSearch("");
            }
        }
        if (e.key === "Escape") setOpen(false);
    };

    return (
        <div ref={ref} className={`relative w-full ${className}`}>
            {/* CONTROL PRINCIPAL */}
            <div
                tabIndex={disabled ? -1 : 0}
                onKeyDown={handleKeyDown}
                onClick={() => !disabled && setOpen(!open)}
                className={`
                    flex gap-3 justify-start items-center w-full transition-all duration-200 
                    rounded-lg text-sm border outline-none px-4 py-1.5 min-h-10 max-h-10
                    ${disabled 
                        ? "bg-[#1e293b] border-slate-700 opacity-50 cursor-not-allowed text-slate-500" 
                        : "bg-[#333c4d] border-slate-600 text-slate-200 hover:border-slate-500 cursor-pointer"
                    }
                    ${open && !disabled ? "border-blue-500/50 ring-1 ring-blue-500/20" : ""}
                `}
            >
                {icon && (
                    <div className={`flex-shrink-0 transition-colors ${
                        disabled ? "text-slate-600" : open ? "text-blue-400" : "text-slate-400"
                    }`}>
                        {icon}
                    </div>
                )}

                <div className="flex-1 truncate text-md flex items-center overflow-hidden">
                    {selected ? (
                        <div className="flex items-center w-full truncate text-slate-100">
                            {selected.label}
                        </div>
                    ) : (
                        <span className="text-slate-500">{placeholder}</span>
                    )}
                </div>

                <div className="flex items-center gap-2 ml-2">
                    {isClearable && selected && !disabled && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange("");
                            }}
                            className="p-1 hover:bg-slate-700 rounded-full transition-colors group/btn flex items-center justify-center"
                        >
                            <HiMiniXMark 
                                size={18}
                                className="text-slate-400 group-hover/btn:text-red-400"
                            />
                        </button>
                    )}

                    <HiChevronDown
                        size={18}
                        className={`transition-transform duration-200 text-slate-400
                            ${open ? "rotate-180 text-blue-400" : ""}
                        `}
                    />
                </div>
            </div>

            {/* LISTA DESPLEGABLE */}
            {open && !disabled && (
                <div
                    className={`absolute w-full bg-[#1e293b] border border-slate-700 rounded-lg shadow-2xl z-[100] p-2 mt-1
                    ${dropdownDirection === "bottom" ? "top-full" : "bottom-full mb-2"}`}
                >
                    {/* Búsqueda condicional */}
                    {searchable && (
                        <input
                            autoFocus
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Buscar..."
                            className="w-full bg-[#0f172a] border border-slate-700 text-slate-200 px-3 py-1.5 min-h-10 max-h-10 rounded-md
                            focus:outline-none focus:border-blue-500/50 text-sm mb-2 placeholder:text-slate-600"
                        />
                    )}

                    <div ref={listRef} className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                        {filtered.length > 0 ? (
                            filtered.map((opt, index) => (
                                <div
                                    key={opt.value}
                                    onMouseDown={() => {
                                        onChange(opt.value);
                                        setOpen(false);
                                        setSearch("");
                                    }}
                                    className={`px-3 py-2 rounded-md cursor-pointer text-sm transition-colors mb-0.5 flex items-center
                                    ${index === highlightIndex
                                        ? "bg-blue-600 text-white"
                                        : value === opt.value
                                            ? "bg-blue-900/40 text-blue-300 font-semibold"
                                            : "text-slate-300 hover:bg-slate-700"
                                    }`}
                                >
                                    {opt.label}
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-slate-500 py-4 text-xs italic">
                                Sin resultados
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}