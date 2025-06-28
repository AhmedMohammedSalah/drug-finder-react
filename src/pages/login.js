import { useState } from "react";
import FormWrapper from "./../components/shared/FormWrapper.js";
import InputField from "./../components/shared/InputField.js";
import BigBtn from "./../components/shared/BigBtn.js";
import { validateLoginForm } from "./../utils/validations.js";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  clearError,
  loginWithGoogle,
} from "../features/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const { loading, error: authError } = useSelector((state) => state.auth);
  const [backendError, setBackendError] = useState("");
  const navigate = useNavigate();

  const handleLoginSuccess = (result) => {
    const role = result?.user?.role?.toLowerCase();

    if (role === "admin") {
      navigate("/admin");
    } else if (role === "pharmacist") {
      const hasStore = result?.user?.pharmacist?.has_store;
      if (hasStore === false) {
        navigate("/pharmacy/store");
      } else {
        navigate("/pharmacy");
      }
    } else if (role === "client") {
      navigate("/client");
    } else {
      navigate("/");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const { valid, errors: validationErrors } = validateLoginForm(email, password);
    setErrors(validationErrors);

    if (valid) {
      try {
        dispatch(clearError());
        setBackendError("");

        const result = await dispatch(loginUser({ email, password })).unwrap();
        handleLoginSuccess(result);
      } catch (error) {
        if (error?.error === "email_not_verified") {
          setBackendError("Please verify your email before logging in");
        } else {
          setBackendError(error?.detail || "Invalid credentials. Please try again.");
        }
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      dispatch(clearError());
      setBackendError("");

      if (!credentialResponse.credential) {
        throw new Error("Google authentication failed: No credential received");
      }

      const result = await dispatch(
        loginWithGoogle({ token: credentialResponse.credential })
      ).unwrap();

      handleLoginSuccess(result);
    } catch (error) {
      console.error("Google login error:", error);
      setBackendError(
        error.message ||
        error.payload ||
        "Google login failed. Please try again."
      );
    }
  };

  return (
    <GoogleOAuthProvider clientId="830041637628-d3troc4aqg9q48q7rmncg1d62sc3q26b.apps.googleusercontent.com">
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-2xl rounded-xl w-full max-w-5xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

          {/* Left Column – Form */}
          <FormWrapper className="p-10 flex flex-col gap-6 justify-center" onSubmit={submit}>
            {/* Backend Error */}
            {backendError && (
              <div className="bg-red-100 border border-red-400 text-red-700 text-sm px-4 py-3 rounded">
                {backendError}
              </div>
            )}

            {/* Heading */}
            <div className="text-center mb-2">
              <h1 className="text-3xl font-extrabold text-blue-600 mb-1">Welcome Back 👋</h1>
              <p className="text-gray-500 text-base">Find your medicine in no time</p>
            </div>

            {/* Email */}
            <InputField
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              className="mt-2"
            />

            {/* Password */}
            <div className="mb-4">
              <div className="flex justify-between items-center mt-2">
                <label className="text-sm font-medium">Password</label>
                <a href="#" className="text-sm text-blue-500 hover:underline">Forgot password?</a>
              </div>
              
              <InputField
                type="password"
                placeholder="Enter your password"
                noLabel
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
            </div>

            {/* Login Button */}
            <BigBtn text="Login" bg-blue-500 onClick={submit} className="mt-4" />

            {/* OR separator */}
            <div className="flex items-center gap-3 my-4 text-gray-400 text-sm">
              <div className="flex-grow border-t" />
              <span>OR</span>
              <div className="flex-grow border-t" />
            </div>

            {/* Social Login */}
            <div className="flex justify-center gap-4">
              <button className="border px-4 py-2 rounded hover:bg-gray-100 transition">
                <i className="fa-brands fa-facebook-f text-blue-600 text-xl"></i>
              </button>
              <div className="border px-2 py-1 rounded hover:bg-gray-100 transition">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() =>
                    setBackendError("Google login failed. Please try again.")
                  }
                  useOneTap
                  auto_select
                  size="medium"
                  width="200"
                />
              </div>
              <button className="border px-4 py-2 rounded hover:bg-gray-100 transition">
                <i className="fa-brands fa-twitter text-sky-400 text-xl"></i>
              </button>
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Don’t have an account?{" "}
              <a href="#" className="text-blue-500 font-medium hover:underline">
                Sign up
              </a>
            </p>
          </FormWrapper>

          {/* Right Column – Image */}
          <div className="hidden md:block">
            <img
              src="/images/login/9052.jpg_wh300.jpg"
              alt="Pharmacy illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
