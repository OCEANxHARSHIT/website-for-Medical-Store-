import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, Medicine, Order } from '@/context/StoreContext';
import { LogOut, Plus, Edit2, Trash2, Package, ShoppingCart, Settings, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'medicines' | 'orders' | 'settings';

const AdminDashboard = () => {
  const store = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('medicines');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [medForm, setMedForm] = useState({ name: '', price: '', stock: '', description: '', image: '', category: '' });
  const [settingsForm, setSettingsForm] = useState(store.settings);

  if (!store.isAdmin) {
    navigate('/admin');
    return null;
  }

  const handleLogout = () => {
    store.logout();
    toast.info('Logged out');
    navigate('/');
  };

  const resetMedForm = () => {
    setMedForm({ name: '', price: '', stock: '', description: '', image: '', category: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleSaveMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: medForm.name,
      price: Number(medForm.price),
      stock: Number(medForm.stock),
      description: medForm.description,
      image: medForm.image,
      category: medForm.category,
    };
    if (editId) {
      store.updateMedicine(editId, data);
      toast.success('Medicine updated');
    } else {
      store.addMedicine(data);
      toast.success('Medicine added to inventory');
    }
    resetMedForm();
  };

  const handleEdit = (med: Medicine) => {
    setMedForm({
      name: med.name,
      price: med.price.toString(),
      stock: med.stock.toString(),
      description: med.description || '',
      image: med.image || '',
      category: med.category || '',
    });
    setEditId(med.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    store.deleteMedicine(id);
    toast.success('Medicine removed');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings(settingsForm);
    toast.success('Store settings updated');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setMedForm(f => ({ ...f, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const statusColors: Record<Order['status'], string> = {
    new: 'bg-blue-100 text-blue-700',
    processing: 'bg-amber-100 text-amber-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-emerald-100 text-emerald-700',
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'medicines', label: 'Medicines', icon: <Package className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors px-3 py-2 rounded-lg hover:bg-accent">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              tab === t.id ? 'bg-card text-card-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {tab === 'medicines' && (
          <motion.div key="medicines" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">{store.medicines.length} Medicines</h2>
              <button
                onClick={() => { resetMedForm(); setShowForm(!showForm); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all active:scale-[0.97]"
              >
                <Plus className="w-4 h-4" /> Add Medicine
              </button>
            </div>

            {/* Medicine form */}
            <AnimatePresence>
              {showForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSaveMedicine}
                  className="bg-card border border-border rounded-2xl p-5 mb-6 overflow-hidden"
                >
                  <h3 className="font-semibold text-card-foreground mb-4">{editId ? 'Edit Medicine' : 'Add New Medicine'}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Medicine Name</label>
                      <input value={medForm.name} onChange={e => setMedForm(f => ({ ...f, name: e.target.value }))} required
                        className="w-full h-10 px-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Category</label>
                      <input value={medForm.category} onChange={e => setMedForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full h-10 px-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Price (₹)</label>
                      <input type="number" min="0" value={medForm.price} onChange={e => setMedForm(f => ({ ...f, price: e.target.value }))} required
                        className="w-full h-10 px-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-sm tabular-nums" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Stock</label>
                      <input type="number" min="0" value={medForm.stock} onChange={e => setMedForm(f => ({ ...f, stock: e.target.value }))} required
                        className="w-full h-10 px-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-sm tabular-nums" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-foreground mb-1">Description</label>
                      <input value={medForm.description} onChange={e => setMedForm(f => ({ ...f, description: e.target.value }))}
                        className="w-full h-10 px-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-foreground mb-1">Medicine Image</label>
                      <input type="file" accept="image/*" onChange={handleImageUpload}
                        className="w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent file:text-accent-foreground file:font-medium file:text-sm hover:file:bg-accent/80 file:cursor-pointer" />
                      {medForm.image && <img src={medForm.image} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-lg border border-border" />}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button type="submit" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
                      {editId ? 'Save Changes' : 'Add to Inventory'}
                    </button>
                    <button type="button" onClick={resetMedForm} className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Medicine list */}
            <div className="space-y-2">
              {store.medicines.map(med => (
                <div key={med.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center shrink-0 overflow-hidden">
                    {med.image ? <img src={med.image} alt={med.name} className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-primary/40" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-card-foreground truncate">{med.name}</p>
                    <p className="text-xs text-muted-foreground">₹{med.price} · {med.stock > 0 ? `${med.stock} in stock` : 'Out of stock'}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(med)} className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(med.id)} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'orders' && (
          <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {store.orders.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {store.orders.map(order => (
                  <div key={order.id} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-card-foreground">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.phone} · {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                        <div className="relative group">
                          <button className="p-1 hover:bg-accent rounded-lg"><ChevronDown className="w-4 h-4 text-muted-foreground" /></button>
                          <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg py-1 hidden group-hover:block z-10 min-w-[120px]">
                            {(['new', 'processing', 'shipped', 'delivered'] as const).map(s => (
                              <button key={s} onClick={() => store.updateOrderStatus(order.id, s)}
                                className="block w-full text-left px-3 py-1.5 text-xs hover:bg-accent capitalize transition-colors">
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p><strong className="text-card-foreground">Items:</strong> {order.items.map(i => `${i.medicine.name} x${i.qty}`).join(', ')}</p>
                      <p><strong className="text-card-foreground">Address:</strong> {order.address}</p>
                      <p><strong className="text-card-foreground">Payment:</strong> {order.paymentMethod}</p>
                    </div>
                    <p className="text-right font-bold text-card-foreground tabular-nums mt-2">₹{order.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <form onSubmit={handleSaveSettings} className="bg-card border border-border rounded-2xl p-5 space-y-4 max-w-xl">
              <h3 className="font-semibold text-card-foreground">Store Settings</h3>
              {[
                { label: 'Store Name', key: 'name' as const, type: 'text' },
                { label: 'Phone Number', key: 'phone' as const, type: 'tel' },
                { label: 'WhatsApp Number (with country code)', key: 'whatsapp' as const, type: 'text' },
                { label: 'UPI ID', key: 'upiId' as const, type: 'text' },
                { label: 'Store Address', key: 'address' as const, type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-foreground mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={settingsForm[field.key]}
                    onChange={e => setSettingsForm(f => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-sm"
                    required
                  />
                </div>
              ))}
              <button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
                Save Changes
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
