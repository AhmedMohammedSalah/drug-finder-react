import { useState, useEffect } from "react";
import { Pill,Lock, AlertTriangle, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const floatingPills = [
    { id: 1, delay: "0s", duration: "3s" },
    { id: 2, delay: "0.5s", duration: "2.8s" },
    { id: 3, delay: "1s", duration: "3.2s" },
    { id: 4, delay: "1.5s", duration: "2.6s" },
    { id: 5, delay: "2s", duration: "3.4s" },
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
      <div
        className={`relative z-10 text-center px-6 max-w-3xl mx-auto transition-all duration-1000 ${
          animate ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Header Icons */}
        <div className="relative inline-block mb-8">
         <div className="w-28 h-28 bg-blue-600 rounded-full flex items-center justify-center animate-pulse shadow-xl">
  <Lock className="w-12 h-12 text-white" />
</div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-6xl font-bold text-blue-800 mb-4">401</h1>
        <h2 className="text-2xl font-semibold text-blue-600 mb-6">
          Unauthorized Access
        </h2>
        <p className="text-lg text-blue-700 mb-10 max-w-2xl mx-auto">
          You do not have permission to access this page. Please ensure you're logged in.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Go to Login
          </Link>
          <Link
            to="/"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Back to Home
          </Link>
        </div>

        {/* Support Info */}
       
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
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
