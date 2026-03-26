import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type CartLine = {
  catalogId: string;
  title: string;
  category: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  totalQuantity: number;
  quantityFor: (catalogId: string) => number;
  addOrIncrement: (catalogId: string, title: string, category: string) => void;
  setQuantity: (catalogId: string, quantity: number) => void;
  removeLine: (catalogId: string) => void;
  clearCart: () => void;
  orderNotes: string;
  setOrderNotes: (s: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [orderNotes, setOrderNotes] = useState('');

  const addOrIncrement = useCallback((catalogId: string, title: string, category: string) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.catalogId === catalogId);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + 1 };
        return next;
      }
      return [...prev, { catalogId, title, category, quantity: 1 }];
    });
  }, []);

  const setQuantity = useCallback((catalogId: string, quantity: number) => {
    if (quantity < 1) {
      setLines((prev) => prev.filter((l) => l.catalogId !== catalogId));
      return;
    }
    setLines((prev) =>
      prev.map((l) => (l.catalogId === catalogId ? { ...l, quantity } : l))
    );
  }, []);

  const removeLine = useCallback((catalogId: string) => {
    setLines((prev) => prev.filter((l) => l.catalogId !== catalogId));
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
    setOrderNotes('');
  }, []);

  const totalQuantity = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines]
  );

  const quantityFor = useCallback(
    (catalogId: string) => lines.find((l) => l.catalogId === catalogId)?.quantity ?? 0,
    [lines]
  );

  const value = useMemo(
    () => ({
      lines,
      totalQuantity,
      quantityFor,
      addOrIncrement,
      setQuantity,
      removeLine,
      clearCart,
      orderNotes,
      setOrderNotes,
    }),
    [
      lines,
      totalQuantity,
      quantityFor,
      addOrIncrement,
      setQuantity,
      removeLine,
      clearCart,
      orderNotes,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
