import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const { login, isAdmin } = useStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  if (isAdmin) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-center text-card-foreground mb-1">Admin Login</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">Access the store dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full h-11 px-4 rounded-xl bg-background border border-border focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 pr-10 rounded-xl bg-background border border-border focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-all active:scale-[0.98]">
              Sign In
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
