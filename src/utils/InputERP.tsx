import React, { useState, useRef } from 'react';
import { HiEye, HiEyeOff, HiPaperClip, HiCalendar } from 'react-icons/hi';

type MonedaSoportada = 'PYG' | 'USD' | 'BRL';

type InputType = 
  | 'text' | 'currency' | 'number' | 'date' | 'datetime-local' 
  | 'password' | 'checkbox' | 'email' | 'tel' | 'url' | 'search' 
  | 'color' | 'range' | 'file' | 'time' | 'month';

interface InputERPProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  icon?: React.ReactNode;
  type?: InputType;
  value?: any; 
  moneda?: MonedaSoportada | (string & {});
  onChange: (newValue: any) => void;
}

export default function InputERP({
  icon,
  placeholder,
  type = 'text',
  value,
  moneda = 'PYG',
  onChange,
  className = "",
  disabled = false,
  readOnly = false,
  ...props 
}: InputERPProps) {
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const configs: Record<string, { locale: string; symbol: string; digits: number }> = {
    PYG: { locale: 'de-DE', symbol: '₲', digits: 0 },
    USD: { locale: 'en-US', symbol: '$', digits: 2 },
    BRL: { locale: 'pt-BR', symbol: 'R$', digits: 2 },
  };

  const config = configs[moneda as string] || configs.PYG;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    const { checked, files, value: inputValue } = e.target;

    switch (type) {
      case 'checkbox': onChange(checked); break;
      case 'file': onChange(files); break;
      case 'number':
      case 'range': onChange(inputValue === "" ? "" : Number(inputValue)); break;
      case 'currency':
        const rawDigits = inputValue.replace(/\D/g, '');
        if (rawDigits === "") { onChange(""); return; }
        const numericValue = Number(rawDigits) / Math.pow(10, config.digits);
        onChange(numericValue);
        break;
      default: onChange(inputValue);
    }
  };

  const isDate = type === 'date' || type === 'datetime-local';

  // --- SWITCH (CHECKBOX) ---
  if (type === 'checkbox') {
    return (
      <label className={`flex items-center cursor-pointer select-none gap-3 ${disabled ? 'opacity-50' : ''} ${className}`}>
        <div className="relative inline-block">
          <input {...props} type="checkbox" checked={!!value} disabled={disabled} readOnly={readOnly} onChange={handleChange} className="sr-only peer" />
          <div className={`w-11 h-6 rounded-full transition-all ${!!value ? 'bg-blue-600' : 'bg-slate-700'}`}></div>
          <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${!!value ? 'translate-x-5' : 'translate-x-0'}`}></div>
        </div>
        {placeholder && <span className="text-slate-300 text-sm">{placeholder}</span>}
      </label>
    );
  }

  // --- LÓGICA DE FORMATEO DE VALOR (CORREGIDA PARA DATETIME-LOCAL) ---
  const safeValue = value ?? "";
  let displayValue = safeValue;

  if (type === 'currency' && safeValue !== "") {
    displayValue = Number(safeValue).toLocaleString(config.locale, {
      minimumFractionDigits: config.digits,
      maximumFractionDigits: config.digits,
    });
  } 
  else if (isDate && safeValue !== "") {
    const d = new Date(safeValue);
    if (!isNaN(d.getTime())) {
      const ano = d.getFullYear();
      const mes = String(d.getMonth() + 1).padStart(2, "0");
      const dia = String(d.getDate()).padStart(2, "0");
      
      if (type === 'datetime-local') {
        const hora = String(d.getHours()).padStart(2, "0");
        const min = String(d.getMinutes()).padStart(2, "0");
        // Forzamos el formato yyyy-MM-ddTHH:mm requerido por el navegador
        displayValue = `${ano}-${mes}-${dia}T${hora}:${min}`;
      } else {
        displayValue = `${ano}-${mes}-${dia}`;
      }
    }
  }

  const hasIcon = !!icon || type === 'currency' || isDate || type === 'file';

  return (
    <div className={`
      flex gap-3 items-center w-full rounded-lg text-sm border min-h-10 relative px-4 py-1.5 transition-all duration-200
      ${disabled 
        ? "bg-[#1e293b] border-slate-700 text-slate-500 opacity-50" 
        : "bg-[#333c4d] border-slate-600 text-slate-200 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20"}
      ${className}
    `}>
      {hasIcon && (
        <div className={`flex-shrink-0 transition-colors ${disabled ? "text-slate-600" : "text-slate-400"}`}>
          {type === 'currency' ? (
            <span className="font-semibold text-xs">{config.symbol}</span>
          ) : (
            isDate ? <HiCalendar size={18} /> : (type === 'file' ? <HiPaperClip size={18} /> : icon)
          )}
        </div>
      )}

      <input
        {...props}
        ref={type === 'file' ? fileInputRef : undefined}
        type={type === 'currency' ? 'text' : (type === 'password' && showPassword ? 'text' : type)}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        {...(type !== 'file' ? { value: displayValue } : {})}
        onChange={handleChange}
        className="w-full bg-transparent outline-none text-md placeholder:text-slate-500 text-slate-100"
      />

      {type === 'password' && !disabled && !readOnly && (
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-500 hover:text-blue-400 transition-colors">
          {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
        </button>
      )}
    </div>
  );
}