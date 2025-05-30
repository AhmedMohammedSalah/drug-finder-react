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
  