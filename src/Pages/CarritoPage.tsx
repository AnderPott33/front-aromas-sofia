import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatarMoeda } from '../utils/Formatadores';

const CarritoPage = () => {
    const { cart, addToCart, removeFromCart, totalPrecio, clearCart } = useCart();

    const enviarWhatsApp = () => {
        const telefono = "595982771774"; 
        
        let mensaje = `*Pedido - Aromas Sofia*%0A`;
        mensaje += `--------------------------%0A`;

        cart.forEach((item) => {
            mensaje += `*${item.cantidad}x* ${item.nombre} - ${formatarMoeda(item.venta * item.cantidad, 'PYG')}%0A`;
        });

        mensaje += `--------------------------%0A`;
        mensaje += `*Total Productos: ${formatarMoeda(totalPrecio, 'PYG')}*%0A`;
        mensaje += `_Envío a coordinar por WhatsApp_%0A%0A`;
        mensaje += `_¡Hola! Me gustaría confirmar este pedido._`;

        const url = `https://wa.me/${telefono}?text=${mensaje}`;
        window.open(url, '_blank');
    };

    const handleDisminuir = (item: any) => {
        if (item.cantidad > 1) {
            // Nota: Si no tienes decreaseQuantity, puedes pasar un objeto con cantidad negativa o similar según tu lógica
            alert("Función para restar cantidad pendiente en CartContext");
        } else {
            removeFromCart(item.id);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-violet-50 p-6 rounded-full mb-4">
                    <Trash2 className="w-12 h-12 text-violet-300" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Tu carrito está vacío</h2>
                <p className="text-slate-500 mt-2">¿Aún no has elegido nada para tu hogar?</p>
                <Link to="/" className="mt-6 bg-violet-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-violet-700 transition-all">
                    Volver a la tienda
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Cabecera */}
            <div className="flex items-center gap-4 mb-8">
                <Link to="/" className="p-2 hover:bg-violet-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-violet-600" />
                </Link>
                <h1 className="text-3xl font-black text-slate-900">Finalizar Compra</h1>
            </div>

            <div className="flex flex-col gap-8">
                {/* 1. Lista de Productos */}
                <div className="space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-[2rem] border border-violet-50 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                            <img 
                                src={item.img || 'https://placehold.co/100'} 
                                alt={item.nombre} 
                                className="w-24 h-24 object-cover rounded-2xl bg-violet-50"
                            />
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="font-bold text-slate-800">{item.nombre}</h3>
                                <p className="text-violet-600 font-black text-lg">
                                    {formatarMoeda(item.venta, 'PYG')}
                                </p>
                            </div>
                            
                            <div className="flex items-center bg-violet-50 rounded-xl p-1">
                                <button 
                                    onClick={() => handleDisminuir(item)}
                                    className="p-2 hover:bg-white rounded-lg transition-colors text-violet-600"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 font-bold text-slate-700">{item.cantidad}</span>
                                <button 
                                    onClick={() => addToCart(item)}
                                    className="p-2 hover:bg-white rounded-lg transition-colors text-violet-600"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <button 
                                onClick={() => removeFromCart(item.id)}
                                className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* 2. Resumen de Pago (Ahora abajo de la lista) */}
                <div className="w-full">
                    <div className="bg-violet-950 text-white p-8 rounded-[2.5rem] shadow-xl">
                        <h2 className="text-xl font-bold mb-6 text-center sm:text-left">Resumen del Pedido</h2>
                        
                        <div className="space-y-4 mb-6 border-b border-white/10 pb-6">
                            <div className="flex justify-between text-violet-200">
                                <span>Subtotal productos</span>
                                <span>{formatarMoeda(totalPrecio, 'PYG')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-violet-200">Costo de envío</span>
                                <span className="text-violet-400 text-sm font-medium italic">A coordinar por WhatsApp</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <span className="text-violet-300 block text-sm">Total parcial</span>
                                <span className="text-3xl font-black">{formatarMoeda(totalPrecio, 'PYG')}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-violet-400 uppercase tracking-widest">Sujeto a entrega</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button 
                                onClick={enviarWhatsApp}
                                className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-black/20 order-1 sm:order-2"
                            >
                                <MessageCircle className="w-6 h-6" />
                                Finalizar por WhatsApp
                            </button>

                            <button 
                                onClick={clearCart}
                                className="text-violet-400 text-sm hover:text-white transition-colors py-4 order-2 sm:order-1"
                            >
                                Vaciar Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarritoPage;