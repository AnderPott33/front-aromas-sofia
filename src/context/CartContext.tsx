import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface CartItem {
    id: number;
    nombre: string;
    venta: number;
    img: string | null;
    cantidad: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (producto: any) => void;
    decreaseQuantity: (id: number) => void; // Función para restar
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrecio: number;
    searchTerm: string;      // Estado para el buscador
    setSearchTerm: (term: string) => void; // Función para actualizar buscador
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState(""); // Estado global de búsqueda

    // 1. Agregar o incrementar cantidad
    const addToCart = (producto: any) => {
        setCart((prevCart) => {
            const existe = prevCart.find((item) => item.id === producto.id);
            if (existe) {
                return prevCart.map((item) =>
                    item.id === producto.id 
                    ? { ...item, cantidad: item.cantidad + 1 } 
                    : item
                );
            }
            return [...prevCart, { 
                id: producto.id, 
                nombre: producto.nombre, 
                venta: Number(producto.venta), 
                img: producto.img, 
                cantidad: 1 
            }];
        });
    };

    // 2. Disminuir cantidad (La que faltaba para CarritoPage)
    const decreaseQuantity = (id: number) => {
        setCart((prevCart) => {
            return prevCart.map((item) => {
                if (item.id === id) {
                    return { ...item, cantidad: Math.max(1, item.cantidad - 1) };
                }
                return item;
            });
        });
    };

    const removeFromCart = (id: number) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => setCart([]);

    // Cálculos automáticos
    const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
    const totalPrecio = cart.reduce((acc, item) => acc + (item.venta * item.cantidad), 0);

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            decreaseQuantity, 
            removeFromCart, 
            clearCart, 
            totalItems, 
            totalPrecio,
            searchTerm,
            setSearchTerm 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
    return context;
};