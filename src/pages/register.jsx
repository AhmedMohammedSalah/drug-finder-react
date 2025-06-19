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

export default function RegisterPage() {
  const navigate = useNavigate();
  // STATE ==============================
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageProfile, setImageProfile] = useState(null);
  const [imageLicense, setImageLicense] = useState(null);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [backendErrors, setBackendErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    imageLicense: "",
    imageProfile: "",
  });

  // Reset requirements when role changes
  useEffect(() => {
    if (role !== "pharmacist") {
      setErrors((prev) => ({
        ...prev,
        imageLicense: "",
        imageProfile: "",
      }));
      setBackendErrors((prev) => ({
        ...prev,
        image_license: "",
        image_profile: "",
      }));
    }
  }, [role]);

  // STATIC DATA ========================
  const roleOptions = [
    { id: "client", name: "Client" },
    { id: "pharmacist", name: "Pharmacist" },
  ];

  // Handle file uploads
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

  // Convert backend errors to strings
  const getErrorString = (field) => {
    const error = backendErrors[field];
    if (!error) return "";
    if (Array.isArray(error)) return error.join(" ");
    return error;
  };

  // SUBMIT ============================
  const submit = async (e) => {
    e.preventDefault();

    // Create form data with files
    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);

    // Append files if they exist
    if (imageProfile) formData.append("image_profile", imageProfile);
    if (imageLicense) formData.append("image_license", imageLicense);

    // Run frontend validation
    const validationResult = validateRegisterForm({
      fullName,
      email,
      role,
      password,
      confirmPassword,
      imageProfile: role === "pharmacist" ? imageProfile : "skip",
      imageLicense: role === "pharmacist" ? imageLicense : "skip",
    });

    setErrors(validationResult.errors);

    // Only submit if valid
    if (validationResult.valid) {
      try {
        // Clear previous errors
        dispatch(clearError());
        setBackendErrors({});
        setGeneralError("");

        // Dispatch register action with formData
        const result = await dispatch(registerUser(formData));
        console.log(result);
        if (registerUser.fulfilled.match(result)) {
          
          navigate("/login");
        } else {
          throw result.payload;
        }
      } catch (error) {
        const errorData = error.payload || error;
        console.log("Registration error:", errorData);

        if (errorData && typeof errorData === "object") {
          const fieldErrors = {};
          let generalErrorMsg = "";

          // Convert all error values to strings
          Object.keys(errorData).forEach((key) => {
            if (Array.isArray(errorData[key])) {
              fieldErrors[key] = errorData[key].join(" ");
            } else {
              fieldErrors[key] = errorData[key];
            }
          });

          // Special handling for different error formats
          if (fieldErrors.error) {
            generalErrorMsg = fieldErrors.error;
            delete fieldErrors.error;
          } else if (fieldErrors.detail) {
            generalErrorMsg = fieldErrors.detail;
            delete fieldErrors.detail;
          } else if (fieldErrors.non_field_errors) {
            generalErrorMsg = fieldErrors.non_field_errors;
            delete fieldErrors.non_field_errors;
          }

          setBackendErrors(fieldErrors);
          setGeneralError(generalErrorMsg);
        } else if (typeof errorData === "string") {
          setGeneralError(errorData);
        } else {
          setGeneralError("Registration failed. Please try again.");
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white shadow-md flex w-[1200px] border border-gray-300 rounded-lg overflow-hidden">
        {/* LEFT-COL (30%) */}
        <div className="w-[30%] bg-gray-200">
          <img
            src="./images/register/drugRegister.png"
            alt="Register illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT-COL (70%) */}
        <div className="w-[70%] p-10">
          <FormWrapper className="flex flex-col gap-6 h-full" onSubmit={submit}>
            {generalError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {generalError}
              </div>
            )}

            {/* Heading */}
            <div className="text-start">
              <h1 className="text-4xl font-bold mb-2">Registration</h1>
            </div>

            {/* GRID: TWO COLS */}
            <div className="grid grid-cols-2 gap-6">
              {/* FIRST COL */}
              <div className="flex flex-col gap-4">
                {/* full name */}
                <InputField
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={errors.fullName || getErrorString("name")}
                />

                {/* email */}
                <InputField
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email || getErrorString("email")}
                />

                {/* password */}
                <InputField
                  label="Password"
                  type="password"
                  placeholder="Choose your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password || getErrorString("password")}
                />
              </div>

              {/* SECOND COL */}
              <div className="flex flex-col gap-4">
                {/* role (Dropdown) */}
                <DropdownList
                  label="Role"
                  options={roleOptions}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  error={errors.role || getErrorString("role")}
                />

                {/* confirm password */}
                <InputField
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={
                    errors.confirmPassword || getErrorString("confirm_password")
                  }
                />

                {/* Profile Image Upload */}
                {role === "pharmacist" && (
                  <FileUpload
                    label="Profile Image (Required)"
                    onFileChange={handleProfileImage}
                    accept="image/*"
                    error={
                      errors.imageProfile || getErrorString("image_profile")
                    }
                    required
                  />
                )}
              </div>
            </div>

            {/* File Uploads Row */}
            <div className="grid grid-cols-2 gap-6 mt-4">
              {/* Profile Image for Patient */}
              {role === "client" && (
                <div className="col-span-1">
                  <FileUpload
                    label="Profile Image (Optional)"
                    onFileChange={handleProfileImage}
                    accept="image/*"
                    error={getErrorString("image_profile")}
                  />
                </div>
              )}

              {/* License Image for Pharmacist */}
              {role === "pharmacist" && (
                <div className="col-span-1">
                  <FileUpload
                    label="License Image (Required)"
                    onFileChange={handleLicenseImage}
                    accept="image/*"
                    error={
                      errors.imageLicense || getErrorString("image_license")
                    }
                    required
                  />
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <BigBtn
              text={loading ? "Registering..." : "Register"}
              onClick={submit}
              disabled={loading}
              className="mt-4"
            />
          </FormWrapper>
        </div>
      </div>
    </div>
  );
}
