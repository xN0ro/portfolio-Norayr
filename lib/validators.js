// validation functions used in both frontend and backend

export function validateEmail(email) {
  if (!email || !email.trim()) return 'Email is required.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) return 'Please enter a valid email address.';
  return null;
}

export function validatePassword(password) {
  if (!password) return 'Password is required.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  return null;
}

export function validateName(name) {
  if (!name || !name.trim()) return 'Name is required.';
  if (name.trim().length < 2) return 'Name must be at least 2 characters.';
  return null;
}

export function validateMessage(message) {
  if (!message || !message.trim()) return 'Message is required.';
  if (message.trim().length < 10) return 'Message must be at least 10 characters.';
  if (message.trim().length > 1000) return 'Message must be less than 1000 characters.';
  return null;
}

// validates the whole registration form at once
export function validateRegister(data) {
  const errors = {};

  const nameErr = validateName(data.name);
  if (nameErr) errors.name = nameErr;

  const emailErr = validateEmail(data.email);
  if (emailErr) errors.email = emailErr;

  const passErr = validatePassword(data.password);
  if (passErr) errors.password = passErr;

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

export function validateLogin(data) {
  const errors = {};
  const emailErr = validateEmail(data.email);
  if (emailErr) errors.email = emailErr;

  const passErr = validatePassword(data.password);
  if (passErr) errors.password = passErr;

  return Object.keys(errors).length > 0 ? errors : null;
}

export function validateTestimonial(data) {
  const errors = {};
  const msgErr = validateMessage(data.message);
  if (msgErr) errors.message = msgErr;
  return Object.keys(errors).length > 0 ? errors : null;
}
