import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CartSidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { cart, cartTotal, removeFromCart, updateCartQty } = useStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold text-card-foreground">Your Cart</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-accent">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <ShoppingBag className="w-12 h-12 mb-3 opacity-30" />
                  <p className="font-medium">Your medicine cabinet is empty.</p>
                  <p className="text-sm mt-1">Start browsing our catalog.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.medicine.id} className="flex items-center gap-3 bg-accent/50 p-3 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-card-foreground truncate">{item.medicine.name}</p>
                      <p className="text-xs text-muted-foreground tabular-nums">₹{item.medicine.price} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateCartQty(item.medicine.id, item.qty - 1)} className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold w-6 text-center tabular-nums">{item.qty}</span>
                      <button onClick={() => updateCartQty(item.medicine.id, item.qty + 1)} className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.medicine.id)} className="text-destructive/60 hover:text-destructive text-xs font-medium ml-1">
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-border bg-accent/30">
                <div className="flex justify-between mb-4 font-bold text-lg text-card-foreground">
                  <span>Total</span>
                  <span className="tabular-nums">₹{cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold transition-all active:scale-[0.98]"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
