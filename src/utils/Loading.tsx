import React from 'react';

const Loading = () => {
    return (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-slate-950 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-800 border-t-indigo-500"></div>
                <div className="absolute">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                </div>
            </div>
            <div className="mt-4 flex flex-col items-center">
                <h2 className="text-sm font-medium tracking-widest text-slate-200 ">
                    Cargando...
                </h2>
            </div>
        </div>
    );
};

export default Loading;