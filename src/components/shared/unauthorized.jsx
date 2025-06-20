import React from "react";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Unauthorized = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
        <Lock size={48} className="text-emerald-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6 text-center max-w-xs">
          You do not have permission to view this page.
          <br />
          Please check your account role or contact support if you believe this
          is a mistake.
        </p>
        {user?.role === "patient" && (
          <Link
            to="/patient"
            className="px-5 py-2 bg-emerald-500 text-white rounded-full font-medium hover:bg-emerald-600 transition"
          >
            Go to Home
          </Link>
        )}
        {user?.role === "doctor" && (
          <Link
            to="/doctor"
            className="px-5 py-2 bg-emerald-500 text-white rounded-full font-medium hover:bg-emerald-600 transition"
          >
            Go to Home
          </Link>
        )}
        {!user?.role && (
          <Link
            to="/"
            className="px-5 py-2 bg-emerald-500 text-white rounded-full font-medium hover:bg-emerald-600 transition mt-2"
          >
            Go to Home
          </Link>
        )}
      </div>
    </div>
  );
};

export default Unauthorized;
