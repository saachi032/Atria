import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DonorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter both your email and password.');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      alert('Login successful! Redirecting to the homepage...');
      navigate('/');
    } else {
      alert(result.error || 'Login failed. Check your credentials.');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-20 px-4">
      <div className={`w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden my-8 transition-all duration-700 ease-out ${isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        {/* Left Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="text-center md:text-left mb-10">
            <span className="font-extrabold text-3xl text-red-500">♦ Atria</span>
            <h2 className="text-3xl font-bold text-gray-800 mt-4">Welcome Back, Lifesaver!</h2>
            <p className="text-gray-500 mt-2">
              Login to continue your journey of saving lives.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 transition"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 transition"
                autoComplete="current-password"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-base font-bold text-white tracking-wide uppercase bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/30 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-red-500/50 hover:scale-100 hover:-translate-y-1"
                disabled={loading}
              >
                {loading ? 'Logging In...' : 'Login'}
              </button>
            </div>
            {error && <div className="text-red-600 text-sm pt-1">{error}</div>}
          </form>
        </div>
        {/* Right Side: "Register Now" call to action */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-red-300 bg-cover bg-center flex flex-col items-center justify-center text-center">
          <div className='bg-white/20 backdrop-blur-sm p-8 rounded-lg'>
            <h3 className="text-3xl font-bold text-white mb-4">New to Atria?</h3>
            <p className="text-white/90 mb-8">
              Become a part of our life-saving community. Your registration can bring hope to someone in need.
            </p>
            <Link
              to="/register"
              className="w-full max-w-xs py-3 px-4 rounded-xl text-base font-bold text-red-500 tracking-wide uppercase bg-white border-2 border-red-600 shadow-md transition-all duration-300 ease-in-out hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-600/30 hover:scale-100 hover:-translate-y-1"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}