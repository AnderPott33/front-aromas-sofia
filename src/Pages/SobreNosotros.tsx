import React from 'react';
import { Sparkles, Heart, Leaf, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SobreNosotros = () => {
    return (
        <div className="bg-[#FDFBF7] min-h-screen">
            {/* Hero Section - Historia */}
            <div className="relative py-20 px-4 overflow-hidden">
                <div className="max-w-screen-xl mx-auto text-center relative z-10">
                    <span className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Desde el corazón</span>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
                        Nuestra <span className="text-[#D4AF37]">Esencia</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-slate-600 text-lg leading-relaxed">
                        En Aromas Sofia, creemos que un aroma no es solo una fragancia, es un recuerdo que cobra vida en tu hogar.
                    </p>
                </div>
                {/* Elementos decorativos de fondo */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-[#D4AF37] rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#F3E5AB] rounded-full blur-[120px]"></div>
                </div>
            </div>

            {/* Sección de Relato */}
            <div className="max-w-screen-xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                            <img 
                                src="https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?q=80&w=1000&auto=format&fit=crop" 
                                alt="Artesanía en aromas" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-[2rem] shadow-xl border border-[#F3E5AB] hidden lg:block">
                            <p className="text-[#D4AF37] font-black text-4xl">100%</p>
                            <p className="text-slate-500 font-medium">Artesanal</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 text-[#996515] px-4 py-2 rounded-full text-sm font-bold">
                            <Sparkles className="w-4 h-4" /> Cómo empezamos
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                            Todo comenzó con una vela y un deseo de <span className="text-[#D4AF37]">bienestar</span>.
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            Aromas Sofia nació en el calor de nuestro hogar, buscando crear ambientes que abrazaran a quienes los habitan. Lo que comenzó como un pequeño experimento con aceites esenciales y ceras naturales, se transformó en una pasión por transformar espacios.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            Cada producto de nuestra colección es seleccionado y preparado con una premisa clara: la calidad no es negociable. Queremos que cada vez que enciendas una de nuestras fragancias, sientas la paz que solo un hogar en armonía puede brindar.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-[#D4AF37] p-2 rounded-lg text-white">
                                    <Leaf className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Natural</h4>
                                    <p className="text-xs text-slate-500">Insumos premium</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-[#D4AF37] p-2 rounded-lg text-white">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Pasión</h4>
                                    <p className="text-xs text-slate-500">Hecho con amor</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Valores de la Marca */}
            <div className="bg-[#1a1405] py-20 mt-10">
                <div className="max-w-screen-xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#F3E5AB]">Nuestros Compromisos</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Calidad Suprema",
                                desc: "No escatimamos en la pureza de nuestras esencias. Solo lo mejor llega a tus manos.",
                                icon: <Sparkles className="w-8 h-8" />
                            },
                            {
                                title: "Sostenibilidad",
                                desc: "Nuestros procesos respetan el medio ambiente, priorizando materiales biodegradables.",
                                icon: <Leaf className="w-8 h-8" />
                            },
                            {
                                title: "Cercanía",
                                desc: "Somos una familia atendiendo a familias. Tu satisfacción es nuestro motor.",
                                icon: <MapPin className="w-8 h-8" />
                            }
                        ].map((valor, idx) => (
                            <div key={idx} className="bg-white/5 border border-[#D4AF37]/20 p-10 rounded-[2.5rem] hover:bg-white/10 transition-colors group">
                                <div className="text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform">
                                    {valor.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">{valor.title}</h3>
                                <p className="text-[#F3E5AB]/60 leading-relaxed">
                                    {valor.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="py-24 px-4 text-center">
                <div className="max-w-2xl mx-auto bg-white border border-[#F3E5AB] p-12 rounded-[3rem] shadow-xl shadow-[#F3E5AB]/20">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">¿Listo para transformar tu hogar?</h2>
                    <p className="text-slate-500 mb-8">
                        Explora nuestra colección de fragancias exclusivas y encuentra el aroma que cuenta tu historia.
                    </p>
                    <Link 
                        to="/catalogo" 
                        className="inline-flex items-center gap-3 bg-[#D4AF37] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#996515] transition-all shadow-lg shadow-[#D4AF37]/30 group"
                    >
                        Ver Catálogo 
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SobreNosotros;