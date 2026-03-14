import { useState, useMemo } from 'react';
import { Phone, MapPin } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import SearchBar from '@/components/store/SearchBar';
import MedicineCard from '@/components/store/MedicineCard';
import { motion } from 'framer-motion';

const Index = () => {
  const { medicines, settings } = useStore();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase())),
    [medicines, search]
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-balance">
            Pure formulations. Direct to your door.
          </h2>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {settings.phone}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {settings.address}</span>
          </div>
        </motion.div>
        <SearchBar value={search} onChange={setSearch} />
      </header>

      {/* Catalog */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium">No medicines found matching "{search}"</p>
            <p className="text-sm mt-1">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((med, i) => (
              <MedicineCard key={med.id} medicine={med} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
