import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
    footer?: React.ReactNode; // Soporta el fragmento <> con botones que pasaste
    widthClass?: string; 
    heightClass?: string;
}

const ModalGeneral: React.FC<ModalProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    footer,
    widthClass = "max-w-lg", 
    heightClass = "h-80"
}) => {
    // Control de tecla Escape
    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Contenedor del Modal */}
            <div className={`relative w-full ${widthClass} transform overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl transition-all flex flex-col`}>

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/50">
                    <h3 className="text-lg font-bold text-slate-100 tracking-tight">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-200 transition-all"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body con scroll dinámico */}
                <div className="bg-slate-900  flex-1">
                    <div className={`text-slate-300 antialiased overflow-y-auto p-2 ${heightClass}
                        scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent`}>
                        {children}
                    </div>
                </div>

                {/* Footer (Se renderiza solo si pasas la prop footer) */}
                {footer && (
                    <div className="flex justify-end gap-3 bg-slate-900/80 px-6 py-4 border-t border-slate-800">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default ModalGeneral;