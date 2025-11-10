
import { CLOUDINARY_BASE } from "../constants/cloudinary";
export const getCloudinaryImage = (publicId:string, options = "") => {
  return `${CLOUDINARY_BASE}${options ? options + "/" : ""}${publicId}`;
};