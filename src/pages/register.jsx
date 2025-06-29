import React, { useState, useEffect } from "react";
import FormWrapper from "../components/shared/FormWrapper.js";
import InputField from "../components/shared/InputField.js";
import BigBtn from "../components/shared/BigBtn.js";
import DropdownList from "../components/shared/DropdownList.js";
import FileUpload from "../components/shared/FileUpload.js";
import { validateRegisterForm } from "../utils/validations.js";
import { registerUser, clearError } from "../features/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../components/shared/LoadingOverlay.jsx";
import Header from "../components/home/header.jsx";


export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageProfile, setImageProfile] = useState(null);
  const [imageLicense, setImageLicense] = useState(null);
  const [backendErrors, setBackendErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [errors, setErrors] = useState({
    fullName: "", email: "", role: "", password: "", confirmPassword: "",
    imageLicense: "", imageProfile: ""
  });

  useEffect(() => {
    if (role !== "pharmacist") {
      setErrors((prev) => ({ ...prev, imageLicense: "", imageProfile: "" }));
      setBackendErrors((prev) => ({ ...prev, image_license: "", image_profile: "" }));
    }
  }, [role]);

  const roleOptions = [
    { id: "client", name: "Client" },
    { id: "pharmacist", name: "Pharmacist" },
  ];

  const handleProfileImage = (file) => {
    setImageProfile(file);
    if (file) {
      setErrors((prev) => ({ ...prev, imageProfile: "" }));
      setBackendErrors((prev) => ({ ...prev, image_profile: "" }));
    }
  };

  const handleLicenseImage = (file) => {
    setImageLicense(file);
    if (file) {
      setErrors((prev) => ({ ...prev, imageLicense: "" }));
      setBackendErrors((prev) => ({ ...prev, image_license: "" }));
    }
  };

  const getErrorString = (field) => {
    const error = backendErrors[field];
    if (!error) return "";
    return Array.isArray(error) ? error.join(" ") : error;
  };

  const submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    if (imageProfile) formData.append("image_profile", imageProfile);
    if (imageLicense) formData.append("image_license", imageLicense);

    const validationResult = validateRegisterForm({
      fullName, email, role, password, confirmPassword,
      imageProfile: role === "pharmacist" ? imageProfile : "skip",
      imageLicense: role === "pharmacist" ? imageLicense : "skip",
    });

    setErrors(validationResult.errors);

    if (validationResult.valid) {
      try {
        dispatch(clearError());
        setBackendErrors({});
        setGeneralError("");
        const result = await dispatch(registerUser(formData));
        if (registerUser.fulfilled.match(result)) {
          navigate("/login");
        } else {
          throw result.payload;
        }
      } catch (error) {
        const errorData = error.payload || error;
        const fieldErrors = {};
        let generalErrorMsg = "";

        Object.keys(errorData).forEach((key) => {
          if (Array.isArray(errorData[key])) {
            fieldErrors[key] = errorData[key].join(" ");
          } else {
            fieldErrors[key] = errorData[key];
          }
        });

        if (fieldErrors.error || fieldErrors.detail || fieldErrors.non_field_errors) {
          generalErrorMsg =
            fieldErrors.error || fieldErrors.detail || fieldErrors.non_field_errors;
          delete fieldErrors.error;
          delete fieldErrors.detail;
          delete fieldErrors.non_field_errors;
        }

        setBackendErrors(fieldErrors);
        setGeneralError(generalErrorMsg);
      }
    }
  };

  return (
    <>
    <Header />
      {loading && <LoadingOverlay />}
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
     
      <div className="bg-white shadow-2xl rounded-xl w-full max-w-5xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* Left Side – Image / Branding */}
        <div className="hidden md:flex flex-col items-center justify-center bg-blue-500 text-white p-8">
          <img
            src="/logo.png"
            alt="Register illustration"
            className="w-28 h-28 object-contain mb-6 drop-shadow-md"
          />
          <h5 className="text-3xl font-bold mb-2">Join Drug Finder</h5>
          <p className="text-center text-base font-medium opacity-90 leading-relaxed">
            Register and find your medicine in no time....
          </p>
        </div>

        {/* Right Side – Form */}
        <div className="p-10">
          <FormWrapper className="flex flex-col gap-6" onSubmit={submit}>
            {generalError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {generalError}
              </div>
            )}

            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-blue-600 mb-1">Create an Account 🚀</h1>
              <p className="text-gray-500 text-base">Register to access all features</p>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                placeholder="Enter your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName || getErrorString("name")}
              />
              <InputField
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email || getErrorString("email")}
              />
              <InputField
                label="Password"
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password || getErrorString("password")}
              />
              <InputField
                label="Confirm Password"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword || getErrorString("confirm_password")}
              />
              <DropdownList
                label="Role"
                options={roleOptions}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                error={errors.role || getErrorString("role")}
              />
              {role === "pharmacist" && (
                <FileUpload
                  label="Profile Image"
                  onFileChange={handleProfileImage}
                  accept="image/*"
                  error={errors.imageProfile || getErrorString("image_profile")}
                  required
                />
              )}
              {role === "pharmacist" && (
                <FileUpload
                  label="License Image"
                  onFileChange={handleLicenseImage}
                  accept="image/*"
                  error={errors.imageLicense || getErrorString("image_license")}
                  required
                />
              )}
              {role === "client" && (
                <FileUpload
                  label="Profile Image (Optional)"
                  onFileChange={handleProfileImage}
                  accept="image/*"
                  error={getErrorString("image_profile")}
                />
              )}
            </div>

            {/* Submit */}
            <BigBtn
              text={loading ? "Registering..." : "Register"}
              onClick={submit}
              disabled={loading}
              className="mt-4"
            />

            {/* Login Redirect */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 font-medium hover:underline">
                Login
              </a>
            </p>
          </FormWrapper>
        </div>
      </div>
    </div>
    </>
  );
}
