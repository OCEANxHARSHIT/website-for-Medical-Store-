import { Plus, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore, Medicine } from '@/context/StoreContext';
import { toast } from 'sonner';

const MedicineCard = ({ medicine, index }: { medicine: Medicine; index: number }) => {
  const { addToCart } = useStore();
  const isOutOfStock = medicine.stock <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(medicine);
    toast.success(`${medicine.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="medicine-card bg-card p-4 rounded-2xl border border-border flex flex-col h-full"
    >
      {/* Image area */}
      <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-accent">
        {medicine.image ? (
          <img src={medicine.image} alt={medicine.name} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-primary/30" />
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-card/80 backdrop-blur-sm flex items-center justify-center">
            <span className="font-bold text-sm text-destructive">Out of Stock</span>
          </div>
        )}
        {!isOutOfStock && (
          <span className="absolute top-2 right-2 bg-primary/10 text-accent-foreground text-[10px] font-semibold px-2 py-1 rounded-full">
            {medicine.stock} in stock
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1">
        <h3 className="font-bold text-base mb-1 text-card-foreground text-balance">{medicine.name}</h3>
        {medicine.description && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{medicine.description}</p>
        )}
        <p className="text-primary font-bold text-xl tabular-nums">₹{medicine.price}</p>
      </div>

      {/* Add to cart */}
      <button
        onClick={handleAdd}
        disabled={isOutOfStock}
        className={`w-full mt-4 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
          isOutOfStock
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground active:scale-[0.97]'
        }`}
      >
        {isOutOfStock ? 'Unavailable' : <><Plus className="w-4 h-4" /> Add to Cart</>}
      </button>
    </motion.div>
  );
};

export default MedicineCard;
