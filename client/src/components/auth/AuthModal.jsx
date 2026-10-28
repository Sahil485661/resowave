import React, { useState, useEffect } from 'react';
import { X, Loader2, Disc3 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';

export function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const { login, register, isLoading } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(initialMode === 'register');

  useEffect(() => {
    if (isOpen) {
      setIsRegisterMode(initialMode === 'register');
    }
  }, [isOpen, initialMode]);

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('22');
  const [role, setRole] = useState('artist'); // 'artist' or 'user'
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegisterMode) {
        if (!email || !userName || !password) {
          toast.error('Please complete all required fields');
          return;
        }
        await register({ email, userName, name: name || userName, role, age, password });
        toast.success(`Account created as ${role.toUpperCase()}!`);
      } else {
        if (!identifier || !password) {
          toast.error('Please enter identifier and password');
          return;
        }
        await login({ identifier, password });
        toast.success('Logged in successfully!');
      }
      onClose?.();
    } catch (err) {
      toast.error(err.userMessage || err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-spotify-surface p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="Resowave" className="h-6 w-6 rounded-md object-contain" />
            <h2 className="text-lg font-bold text-white">
              {isRegisterMode ? 'Create Resowave Account' : 'Log in to Resowave'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded p-1 text-spotify-subtext hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {isRegisterMode ? (
            <>
              <div>
                <label className="text-xs font-semibold text-spotify-subtext">Email</label>
                <Input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-spotify-subtext">Username</label>
                <Input
                  placeholder="john_doe"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-spotify-subtext">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="flex h-11 w-full rounded-md border border-white/10 bg-spotify-highlight/60 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-spotify-green"
                  >
                    <option value="artist">Artist (Upload tracks)</option>
                    <option value="user">Listener (Stream music)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-spotify-subtext">Age</label>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="text-xs font-semibold text-spotify-subtext">Email or Username</label>
              <Input
                placeholder="Enter email or username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-spotify-subtext">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-spotify-green py-3 text-sm font-bold text-black hover:bg-spotify-green-hover hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{isRegisterMode ? 'Create Account' : 'Log In'}</span>
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-xs text-spotify-subtext hover:text-white underline underline-offset-4"
          >
            {isRegisterMode ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
