import { type ReactNode } from "react";

export default function PageBanner({
  title,
  subtitle,
  icon
}: {
  title: string;
  subtitle?: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 py-4 px-2 bg-[#0f172a] text-white">
      
      {/* CONTENEDOR DEL ICONO (Estilo redondeado con fondo azulado sutil) */}
      <div className="flex items-center justify-center w-15 h-15 rounded-2xl bg-[#1d4ed8]/25 border border-[#38bdf8] text-[#38bdf8] shadow-inner">
        <div className="text-2xl">
          {icon}
        </div>
      </div>

      {/* TEXTOS (Sin uppercase forzado, respetando el peso visual de la foto) */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm font-medium text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

    </div>
  );
}