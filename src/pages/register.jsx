import React, { useState } from "react";
import FormWrapper from "../components/shared/FormWrapper.js";
import InputField from "../components/shared/InputField.js";
import BigBtn from "../components/shared/BigBtn.js";
import DropdownList from "../components/shared/DropdownList.js";
import { validateRegisterForm } from "../utils/validations.js";

export default function RegisterPage() {
  // STATE ==============================
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    country: "",
    city: "",
    phone: "",
    role: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  // STATIC DATA ========================
  const countryOptions = [
    { id: "eg", name: "Egypt" },
    { id: "us", name: "USA" },
    { id: "fr", name: "France" },
    { id: "de", name: "Germany" },
  ];

  const roleOptions = [
    { id: "patient", name: "Patient" },
    { id: "pharmacist", name: "Pharmacist" },
  ];

  // SUBMIT ============================
  const submit = (e) => {
    e.preventDefault();
    const { valid, errors } = validateRegisterForm({
      fullName,
      email,
      country,
      city,
      phone,
      role,
      gender,
      password,
      confirmPassword,
    });

    setErrors(errors);

    if (valid) {

      // check + add backend
      // ON PROGRESS....

      // logic
      alert("HEY WE DID IT SENU! GO TO LOGIN PAGE");
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
          <FormWrapper className="flex flex-col gap-10 h-full" onSubmit={submit}>

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
                  error={errors.fullName}
                />

                {/* email */}
                <InputField
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                />

                {/* country (Dropdown) */}
                <DropdownList
                  label="Country"
                  options={countryOptions}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  error={errors.country}
                />

                {/* password */}
                <InputField
                  label="Password"
                  type="password"
                  placeholder="Choose your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
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
                  error={errors.role}
                />

                {/* phone number */}
                <InputField
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={errors.phone}
                />

                {/* city */}
                <InputField
                  label="City"
                  type="text"
                  placeholder="Enter your city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  error={errors.city}
                />

                {/* confirm password */}
                <InputField
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                />
              </div>

              {/* GENDER */}
              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Gender</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === "male"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === "female"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    Female
                  </label>
                </div>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <BigBtn text="Register" onClick={submit} />

          </FormWrapper>
        </div>
      </div>
    </div>
  );
}
