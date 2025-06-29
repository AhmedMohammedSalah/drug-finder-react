import { useState, useEffect } from 'react';
import { Pill, Home, Search, Phone, ArrowLeft, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
    }, []);

    const floatingPills = [
        { id: 1, delay: '0s', duration: '3s' },
        { id: 2, delay: '0.5s', duration: '2.5s' },
        { id: 3, delay: '1s', duration: '3.5s' },
        { id: 4, delay: '1.5s', duration: '2.8s' },
        { id: 5, delay: '2s', duration: '3.2s' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center relative overflow-hidden">
            {/* Floating Pills Background Animation */}
            {floatingPills.map((pill) => (
                <div
                    key={pill.id}
                    className="absolute opacity-10"
                    style={{
                        animation: `float ${pill.duration} ease-in-out infinite`,
                        animationDelay: pill.delay,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                >
                    <Pill size={32} className="text-blue-600" />
                </div>
            ))}

            {/* Main Content */}
            <div className={`text-center px-6 max-w-4xl mx-auto transform transition-all duration-1000 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>

                {/* Large 404 with Pill Icons */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="relative">
                            <span className="text-8xl md:text-9xl font-bold text-blue-600 select-none">4</span>
                            <Pill className="absolute -top-2 -right-2 text-blue-500 w-8 h-8 animate-pulse" />
                        </div>
                        <div className="relative">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-full flex items-center justify-center animate-bounce">
                                <Heart className="text-white w-8 h-8 md:w-10 md:h-10" fill="currentColor" />
                            </div>
                        </div>
                        <div className="relative">
                            <span className="text-8xl md:text-9xl font-bold text-blue-600 select-none">4</span>
                            <Pill className="absolute -top-2 -left-2 text-blue-500 w-8 h-8 animate-pulse" style={{ animationDelay: '0.5s' }} />
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
                        Page Not Found!
                    </h1>
                    <p className="text-lg md:text-xl text-blue-700 mb-2 max-w-2xl mx-auto">
                        Oops! The page you're looking for seems to not found in our website.
                    </p>

                </div>

                {/* Action Buttons */}




                {/* Back Link */}
                <div className="flex justify-center mb-8">
    <Link
        to="/"
        className="group bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3"
    >
        <Home className="w-5 h-5 group-hover:animate-bounce" />
        <span>Back to Home</span>
    </Link>
</div>

            </div>

            <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(120deg);
          }
          66% {
            transform: translateY(10px) rotate(240deg);
          }
        }
      `}</style>
        </div>
    );
}