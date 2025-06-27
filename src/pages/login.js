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
      navigate("/pharmacy");
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
  
        const role = result?.user?.role?.toLowerCase();
  
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "pharmacist") {
          const hasStore = result?.user?.pharmacist?.has_store;
  
          // ✅ Debug output (optional)
          console.log("hasStore =", hasStore);
  
          if (hasStore === false) {
            navigate("/pharmacy/store"); // redirect to store creation page
          } else {
            navigate("/pharmacy"); // go to pharmacist dashboard
          }
        } else if (role === "client") {
          navigate("/client");
        } else {
          navigate("/");
        }
  
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
    <GoogleOAuthProvider
      clientId={
        "830041637628-d3troc4aqg9q48q7rmncg1d62sc3q26b.apps.googleusercontent.com"
      }
      redirectUri="http://localhost:3000"
    >
      <div className="min-h-screen flex items-center justify-center bg-blue-100">
        <div className="bg-white shadow-md grid grid-cols-2 w-[1000px] border border-gray-300 rounded-lg">
          {/* LEFT-COL - Form */}
          <FormWrapper className="p-10 flex flex-col gap-10" onSubmit={submit}>
            {backendError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {backendError}
              </div>
            )}
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">Welcome back</h1>
              <h1 className="text-2xl text-gray-500">
                Find your Medicine with no time
              </h1>
            </div>

            {/* EMAIL */}
            <InputField
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            {/* PASSWORD LABEL + FORGET LINK */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium">Password</label>
                <a href="#" className="text-md hover:underline">
                  Forgot password?
                </a>
              </div>
              {/* PASSWORD */}
              <InputField
                type="password"
                placeholder="Enter your password"
                noLabel
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
            </div>

            {/* SUBMIT [BIG BUTTON] */}
            <BigBtn text="Login" onClick={submit} />

            {/* SEPARATOR */}
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">Or Continue with</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* AUTH BUTTONS */}
            <div className="flex justify-between">
              <button className="border px-9 py-3 rounded-md hover:bg-gray-100">
                <i className="fa-brands fa-facebook-f fa-2x"></i>
              </button>
              <div className="border rounded-md hover:bg-gray-100 overflow-hidden">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() =>
                    setBackendError("Google login failed. Please try again.")
                  }
                  useOneTap={true} // Enable Google One Tap
                  auto_select={true} // Automatically sign in returning users
                  size="medium"
                  width="200"
                />
              </div>
              <button className="border px-9 py-3 rounded-md hover:bg-gray-100">
                <i className="fa-brands fa-twitter fa-2x"></i>
              </button>
            </div>

            {/* SIGN UP DIRECTION */}
            <p className="text-center text-lg mt-2">
              Don’t have another account?{" "}
              <a href="#" className="underline font-medium">
                Sign up
              </a>
            </p>
          </FormWrapper>

          {/* RGHT-Col - IMG */}
          <div className="bg-gray-200 h-full w-full">
            <img
              src="./images/login/drugLogin.png"
              alt="Login illustration"
              className="w-full h-full object-cover rounded-r-md"
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
