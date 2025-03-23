import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const savedUsername = localStorage.getItem('rememberedUsername');
        if (savedUsername) {
            setUsername(savedUsername);
            setRememberMe(true);
        }
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
    
        try {
            const res = await fetch('/api/login_form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
    
            const data = await res.json();
    
            if (!res.ok) {
                setError(data.error || 'Login failed. Please try again.');
            } else {
                localStorage.setItem('fullname', data.fullname);
                localStorage.setItem('usertype', data.usertype); // Store user type for session validation
    
                if (rememberMe) {
                    localStorage.setItem('rememberedUsername', username);
                } else {
                    localStorage.removeItem('rememberedUsername');
                }
    
                router.push(data.dashboardRoute);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/images/Background.jpg')" }}
        >
            {/* Blur effect over background */}
            <div className="absolute inset-0 backdrop-blur-[1px]"></div>

            {/* Logo */}
            <div className="absolute top-10 flex flex-col items-center">
                <Image src="/images/logo2.png" alt="SHS Logo" width={220} height={220} />
            </div>

            {/* Login Form */}
            <div className="relative z-10 w-full max-w-sm bg-white shadow-lg rounded-lg mt-10">
                <div className="bg-blue-700 text-white text-center py-3 rounded-t-lg text-lg font-semibold">
                    SRCB SENIOR HIGH LOGIN
                </div>

                <div className="p-6">
                    <form className="space-y-4" onSubmit={handleLogin}>
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Username or Email
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black pr-10"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                className="mr-2"
                            />
                            <label htmlFor="rememberMe" className="text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            className={`w-full bg-blue-700 text-white py-2 rounded-full 
                                hover:bg-blue-800 transition ${isLoading && 'opacity-50 cursor-not-allowed'}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
