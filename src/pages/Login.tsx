import React, { useState } from 'react';
import { motion } from 'motion/react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Moon, Mail, Lock, Globe, ArrowRight } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-3xl shadow-2xl border border-emerald-100"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-800 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
            <Moon size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-emerald-900">Welcome to Noor</h2>
          <p className="text-emerald-600 mt-2">Join our community of wisdom and faith.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-emerald-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-800 outline-none"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-emerald-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-800 outline-none"
              required
            />
          </div>
          <button type="submit" className="w-full btn-primary py-3 text-lg font-bold flex items-center justify-center space-x-2">
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-emerald-100"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-emerald-400">Or continue with</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center space-x-3 bg-white border border-emerald-100 py-3 rounded-xl hover:bg-emerald-50 transition-all font-medium text-emerald-800"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          <span>Google Account</span>
        </button>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-700 font-medium hover:text-emerald-900 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
