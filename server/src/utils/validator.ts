export function validateName(name:string) {
  if (!name || typeof name !== 'string') throw new Error('Name is required.');

  const trimmedName = name.trim();
  if (trimmedName.length < 3) throw new Error('Name must be at least 3 characters long.');
  if (!/^[A-Za-z\s]+$/.test(trimmedName)) throw new Error('Name can only contain letters and spaces.');

  return trimmedName.replace(/\s+/g, ' ');
}

export function validateEmail(email:string) {
  if (!email || typeof email !== 'string') throw new Error('Email is required.');

  const trimmedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) throw new Error('Invalid email format.');
  return trimmedEmail;
}


export function validatePassword(password:string) {
  if (!password || typeof password !== 'string') throw new Error('Password is required.');
  if (password.length < 6) throw new Error('Password must be at least 6 characters long.');
  return password;
}


export function validateDateOfBirth(dateOfBirth:string) {
  if (!dateOfBirth || typeof dateOfBirth !== 'string') throw new Error('Date of birth is required.');

  const dob = new Date(dateOfBirth);

  if (isNaN(dob.getTime())) throw new Error('Invalid date format.');

  const ageDifMs = Date.now() - dob.getTime();
  const ageDate = new Date(ageDifMs);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);

  if (age < 13) throw new Error('User must be at least 18 years old.');

  return dob; 
}

export function validateOtp(otp: string, length: number = 6) {
  if (!otp || typeof otp !== "string") throw new Error("OTP is required.");

  const trimmedOtp = otp.trim();

  if (!/^\d+$/.test(trimmedOtp)) throw new Error("OTP must contain only numbers.");

  if (trimmedOtp.length !== length)
    throw new Error(`OTP must be exactly ${length} digits.`);

  return trimmedOtp; 
}
