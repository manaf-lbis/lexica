import ApiError from "./apiError";

export function validateName(name:string) {
  if (!name || typeof name !== 'string') throw new ApiError('Name is required.');

  const trimmedName = name.trim();
  if (trimmedName.length < 3) throw new ApiError('Name must be at least 3 characters long.');
  if (!/^[A-Za-z\s]+$/.test(trimmedName)) throw new ApiError('Name can only contain letters and spaces.');

  return trimmedName.replace(/\s+/g, ' ');
}

export function validateEmail(email:string) {
  if (!email || typeof email !== 'string') throw new ApiError('Email is required.');

  const trimmedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) throw new ApiError('Invalid email format.');
  return trimmedEmail;
}


export function validatePassword(password:string) {
  if (!password || typeof password !== 'string') throw new ApiError('Password is required.');
  if (password.length < 6) throw new ApiError('Password must be at least 6 characters long.');
  return password;
}


export function validateDateOfBirth(dateOfBirth:string) {
  if (!dateOfBirth || typeof dateOfBirth !== 'string') throw new ApiError('Date of birth is required.');

  const dob = new Date(dateOfBirth);

  if (isNaN(dob.getTime())) throw new ApiError('Invalid date format.');

  const ageDifMs = Date.now() - dob.getTime();
  const ageDate = new Date(ageDifMs);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);

  if (age < 13) throw new ApiError('User must be at least 18 years old.');

  return dob; 
}

export function validateOtp(otp: string, length: number = 6) {
  if (!otp || typeof otp !== "string") throw new ApiError("OTP is required.");

  const trimmedOtp = otp.trim();

  if (!/^\d+$/.test(trimmedOtp)) throw new ApiError("OTP must contain only numbers.");

  if (trimmedOtp.length !== length)
    throw new ApiError(`OTP must be exactly ${length} digits.`);

  return trimmedOtp; 
}


