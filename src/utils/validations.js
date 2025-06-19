// USAGE: LOGIN FORM
export function validateLoginForm(email, password) {
  // CONTAINERS
  let errors = { email: "", password: "" };
  let valid = true;

  // EMAIL VALIDATION=========================
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    // EMPTY
    errors.email = "Email is required";
    valid = false;
  } else if (!emailRegex.test(email)) {
    // FORMAT
    errors.email = "Invalid email format";
    valid = false;
  }

  // PASSWORD VALIDATION=====================
  if (!password) {
    // EMPTY
    errors.password = "Password is required";
    valid = false;
  } else if (password.length < 6) {
    // MIN CHAR
    errors.password = "Password must be at least 6 characters";
    valid = false;
  }

  return { valid, errors };
}

// USAGE: REGISTER FORM :
export function validateRegisterForm(data) {
  let errors = {
    fullName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    imageProfile: "",
    imageLicense: "",
  };

  let valid = true;

  // FULL NAME
  if (!data.fullName || data.fullName.trim() === "") {
    errors.fullName = "Full name is required";
    valid = false;
  }

  // EMAIL
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || data.email.trim() === "") {
    errors.email = "Email is required";
    valid = false;
  } else if (!emailRegex.test(data.email)) {
    errors.email = "Invalid email format";
    valid = false;
  }

  // ROLE
  if (!data.role || !["client", "pharmacist"].includes(data.role)) {
    errors.role = "Please select a valid role";
    valid = false;
  }

  // PASSWORD
  if (!data.password || data.password.trim() === "") {
    errors.password = "Password is required";
    valid = false;
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
    valid = false;
  }

  // CONFIRM PASSWORD
  if (!data.confirmPassword || data.confirmPassword.trim() === "") {
    errors.confirmPassword = "Please confirm your password";
    valid = false;
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
    valid = false;
  }

  // FILE VALIDATION FOR PHARMACIST
  if (data.role === "pharmacist") {
    if (!data.imageProfile || data.imageProfile === "skip") {
      errors.imageProfile = "Profile image is required for pharmacists";
      valid = false;
    }
    if (!data.imageLicense || data.imageLicense === "skip") {
      errors.imageLicense = "License image is required for pharmacists";
      valid = false;
    }
  }

  return { valid, errors };
}
