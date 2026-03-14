import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { ArrowLeft, CreditCard, Banknote } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { cart, cartTotal, settings, addOrder, clearCart } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '', paymentMethod: 'UPI' as 'UPI' | 'COD' });

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium mb-2">Your cart is empty</p>
          <button onClick={() => navigate('/')} className="text-primary font-medium hover:underline">Browse medicines</button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      toast.error('Please fill all fields');
      return;
    }

    const order = addOrder({
      customerName: form.name,
      phone: form.phone,
      address: form.address,
      paymentMethod: form.paymentMethod,
      items: cart,
      total: cartTotal,
    });

    // Build WhatsApp message
    const medList = cart.map(i => `${i.medicine.name} (x${i.qty})`).join(', ');
    const message = `*New Medicine Order*%0A%0A` +
      `*Name:* ${form.name}%0A` +
      `*Phone:* ${form.phone}%0A` +
      `*Medicines:* ${medList}%0A` +
      `*Total:* ₹${cartTotal}%0A` +
      `*Address:* ${form.address}%0A` +
      `*Payment:* ${form.paymentMethod}`;

    if (form.paymentMethod === 'UPI') {
      const upiLink = `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(settings.name)}&am=${cartTotal}&cu=INR`;
      window.open(upiLink, '_blank');
      setTimeout(() => {
        window.open(`https://wa.me/${settings.whatsapp}?text=${message}`, '_blank');
      }, 1500);
    } else {
      window.open(`https://wa.me/${settings.whatsapp}?text=${message}`, '_blank');
    }

    clearCart();
    navigate('/order-success', { state: { orderId: order.id } });
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to shop
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-6">Checkout</h1>

        {/* Order summary */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-6">
          <h3 className="font-semibold text-card-foreground mb-3">Order Summary</h3>
          {cart.map(item => (
            <div key={item.medicine.id} className="flex justify-between py-2 text-sm border-b border-border last:border-0">
              <span className="text-card-foreground">{item.medicine.name} <span className="text-muted-foreground">x{item.qty}</span></span>
              <span className="tabular-nums font-medium">₹{(item.medicine.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 font-bold text-lg text-card-foreground">
            <span>Total</span>
            <span className="tabular-nums">₹{cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Your full name"
              className="w-full h-12 px-4 rounded-xl bg-card border border-border focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
            <input
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="+91 9876543210"
              type="tel"
              className="w-full h-12 px-4 rounded-xl bg-card border border-border focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Delivery Address</label>
            <textarea
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              placeholder="Full delivery address"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none"
              required
            />
          </div>

          {/* Payment method */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, paymentMethod: 'UPI' }))}
                className={`flex items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                  form.paymentMethod === 'UPI'
                    ? 'border-primary bg-accent text-accent-foreground'
                    : 'border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
                <CreditCard className="w-5 h-5" /> UPI Payment
              </button>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, paymentMethod: 'COD' }))}
                className={`flex items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                  form.paymentMethod === 'COD'
                    ? 'border-primary bg-accent text-accent-foreground'
                    : 'border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
                <Banknote className="w-5 h-5" /> Cash on Delivery
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-base transition-all active:scale-[0.98] mt-4"
          >
            {form.paymentMethod === 'UPI' ? 'Pay & Place Order' : 'Place Order'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Checkout;
