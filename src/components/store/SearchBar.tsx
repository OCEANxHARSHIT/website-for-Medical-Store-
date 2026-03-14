import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div className="relative group">
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Search for electrohomeopathy medicines..."
      className="w-full h-14 sm:h-16 pl-12 sm:pl-14 pr-6 rounded-2xl bg-card border border-border shadow-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-base sm:text-lg placeholder:text-muted-foreground"
    />
    <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
  </div>
);

export default SearchBar;
