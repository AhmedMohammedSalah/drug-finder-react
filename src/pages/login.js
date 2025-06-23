import  { useState } from "react";
import FormWrapper from "./../components/shared/FormWrapper.js";
import InputField from "./../components/shared/InputField.js";
import BigBtn from "./../components/shared/BigBtn.js";
import { validateLoginForm } from "./../utils/validations.js"; 
import { Link } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from "../features/authSlice.js"
import { useDispatch, useSelector } from "react-redux";



export default function LoginPage() {

    // CARRY EMAIL, PASSWORD VALUES===+ERRORS=========================
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ email: "", password: "" });
    //================================================================
    const dispatch = useDispatch();
    const { loading, error: authError } = useSelector((state) => state.auth);
    const [backendError, setBackendError] = useState("");
    const navigate = useNavigate();

    const submit = async (e) => {
      e.preventDefault();
      const { valid, errors: validationErrors } = validateLoginForm(email, password);
      setErrors(validationErrors);
    
      if (valid) {
        try {
          dispatch(clearError());
          setBackendError("");
    
          // Login and unwrap the result to get the user payload
          const result = await dispatch(loginUser({ email, password })).unwrap();
    
          const role = result?.user?.role?.toLowerCase(); // assuming backend returns user.role
    
          // [SENU] Redirect based on role
          if (role === 'admin') {
            navigate('/admin');
          } else if (role === 'pharmacist') {
            navigate('/pharmacy');
          } else if (role === 'client') {
            navigate('/client');
          } else {
            navigate('/'); // fallback if role unknown
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
    

    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-100">

        <div className="bg-white shadow-md grid grid-cols-2 w-[1000px] border border-gray-300 rounded-lg">

          {/* LEFT-COL - Form */}
          <FormWrapper className="p-10 flex flex-col gap-10" onSubmit={submit}>
            {backendError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {backendError}
              </div> )}
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">Welcome back</h1>
              <h1 className="text-2xl text-gray-500">Find your Medicine with no time</h1>
            </div>

            {/* EMAIL */}
            <InputField
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}  // Pass error here
            />

            {/* PASSWORD LABEL + FORGET LINK */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium">Password</label>
                <a href="#" className="text-md hover:underline">Forgot password?</a>
              </div>
              {/* PASSWORD */}
              <InputField
                type="password"
                placeholder="Enter your password"
                noLabel
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}  // Pass error here
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
              <button className="border px-9 py-3 rounded-md hover:bg-gray-100">
                <i className="fa-brands fa-google fa-2x"></i>
              </button>
              <button className="border px-9 py-3 rounded-md hover:bg-gray-100">
                <i className="fa-brands fa-twitter fa-2x"></i>
              </button>
            </div>

            {/* SIGN UP DIRECTION */}
            <p className="text-center text-lg mt-2">
              Don’t have another account?{' '}
              <a href="#" className="underline font-medium">Sign up</a>
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
    );
}
