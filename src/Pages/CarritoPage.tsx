import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatarMoeda } from '../utils/Formatadores';
import Swal from 'sweetalert2';
import axios from 'axios';

const CarritoPage = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const {
        cart,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        totalPrecio,
        clearCart
    } = useCart();

    const finalizarPedido = async () => {
        const { value: nombreCliente } = await Swal.fire({
            title: '<span style="color: #996515">¡Casi listo!</span>',
            text: 'Ingresa tu nombre para procesar el pedido:',
            input: 'text',
            confirmButtonText: 'Confirmar Pedido',
            confirmButtonColor: '#D4AF37',
            showCancelButton: true,
            background: '#FDFBF7',
            inputValidator: (value) => {
                if (!value) return 'El nombre es obligatorio';
            }
        });

        if (!nombreCliente) return;

        try {
            Swal.fire({
                title: 'Generando pedido...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            const response = await axios.post(`${API_URL}/api/pedidos/nuevo`, {
                cliente_nombre: nombreCliente,
                total: totalPrecio,
                items: cart.map(item => ({
                    id: item.id,
                    cantidad: item.cantidad,
                    precio: item.venta
                }))
            });

            const pedidoId = response.data.pedidoId;

            // --- CONSTRUCCIÓN SEGURA DEL MENSAJE ---
            const telefono = "595982771774";

            // 1. Creamos el texto limpio (con saltos de línea normales)
            let textoMensaje = `*Pedido #${pedidoId} - Aromas Sofia*\n`;
            textoMensaje += `*Cliente:* ${nombreCliente}\n`;
            textoMensaje += `--------------------------\n`;

            cart.forEach((item) => {
                textoMensaje += `*${item.cantidad}x* ${item.nombre} - ${formatarMoeda(item.venta * item.cantidad, 'PYG')}\n`;
            });

            textoMensaje += `--------------------------\n`;
            textoMensaje += `*Total: ${formatarMoeda(totalPrecio, 'PYG')}*\n\n`;
            textoMensaje += `_¡Hola! Acabo de realizar este pedido desde la web._`;

            // 2. Codificamos el texto para que sea una URL válida
            const mensajeCodificado = encodeURIComponent(textoMensaje);
            const url = `https://wa.me/${telefono}?text=${mensajeCodificado}`;

            // 5. Éxito y Redirección
            Swal.fire({
                icon: 'success',
                title: '¡Pedido Registrado!',
                text: `Pedido #${pedidoId} generado con éxito.`,
                confirmButtonColor: '#D4AF37',
                timer: 3000
            }).then(() => {
                window.open(url, '_blank');
                clearCart();
            });

        } catch (error) {
            console.error('Error:', error);
            Swal.fire({ icon: 'error', title: 'Error al conectar con el servidor' });
        }
    };

    const handleDisminuir = (id: number, cantidadActual: number) => {
        if (cantidadActual > 1) {
            decreaseQuantity(id);
        } else {
            Swal.fire({
                title: '¿Quitar producto?',
                text: "Se eliminará del carrito",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#D4AF37',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, quitar',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) removeFromCart(id);
            });
        }
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-[#F3E5AB]/20 p-6 rounded-full mb-4">
                    <Trash2 className="w-12 h-12 text-[#D4AF37]/50" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Tu carrito está vacío</h2>
                <p className="text-slate-500 mt-2">¿Aún no has elegido nada para tu hogar?</p>
                <Link to="/" className="mt-6 bg-[#D4AF37] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#996515] transition-all shadow-lg shadow-[#D4AF37]/20">
                    Volver a la tienda
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/" className="p-2 hover:bg-[#F3E5AB]/30 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-[#996515]" />
                </Link>
                <h1 className="text-3xl font-black text-slate-900">Finalizar Compra</h1>
            </div>

            <div className="flex flex-col gap-8">
                <div className="space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-[2rem] border border-[#F3E5AB]/30 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                            <img
                                src={item.img || 'https://placehold.co/100/FDFBF7/D4AF37?text=S/I'}
                                alt={item.nombre}
                                className="w-24 h-24 object-cover rounded-2xl bg-[#F3E5AB]/10"
                            />
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="font-bold text-slate-800">{item.nombre}</h3>
                                <p className="text-[#D4AF37] font-black text-lg">
                                    {formatarMoeda(item.venta, 'PYG')}
                                </p>
                            </div>

                            <div className="flex items-center bg-[#F3E5AB]/20 rounded-xl p-1">
                                <button
                                    onClick={() => handleDisminuir(item.id, item.cantidad)}
                                    className="p-2 hover:bg-white rounded-lg transition-colors text-[#996515]"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 font-bold text-slate-700 w-8 text-center">{item.cantidad}</span>
                                <button
                                    onClick={() => addToCart(item)}
                                    className="p-2 hover:bg-white rounded-lg transition-colors text-[#996515]"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-3 text-rose-400 hover:bg-rose-50 rounded-xl transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="w-full">
                    <div className="bg-[#1a1405] text-white p-8 rounded-[2.5rem] shadow-xl border border-[#D4AF37]/20">
                        <h2 className="text-xl font-bold mb-6 text-center sm:text-left text-[#F3E5AB]">Resumen del Pedido</h2>

                        <div className="space-y-4 mb-6 border-b border-[#F3E5AB]/10 pb-6">
                            <div className="flex justify-between text-[#F3E5AB]/80">
                                <span>Subtotal productos</span>
                                <span>{formatarMoeda(totalPrecio, 'PYG')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[#F3E5AB]/80">Costo de envío</span>
                                <span className="text-[#D4AF37] text-sm font-medium italic">A coordinar</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <span className="text-[#F3E5AB]/60 block text-sm">Total parcial</span>
                                <span className="text-3xl font-black text-[#D4AF37]">{formatarMoeda(totalPrecio, 'PYG')}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={finalizarPedido}
                                className="bg-[#D4AF37] hover:bg-[#996515] text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-black/20 order-1 sm:order-2 active:scale-95"
                            >
                                <MessageCircle className="w-6 h-6" />
                                Finalizar por WhatsApp
                            </button>

                            <button
                                onClick={() => {
                                    Swal.fire({
                                        title: '¿Vaciar carrito?',
                                        icon: 'question',
                                        showCancelButton: true,
                                        confirmButtonColor: '#d33',
                                        confirmButtonText: 'Sí, vaciar'
                                    }).then(res => res.isConfirmed && clearCart());
                                }}
                                className="text-[#F3E5AB]/40 text-sm hover:text-rose-400 transition-colors py-4 order-2 sm:order-1"
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