import { useState, useEffect } from "react";

export const useArticleValidation = (title: string, about: string) => {
  const [errors, setErrors] = useState({ title: "", about: "" });
  const [touched, setTouched] = useState({ title: false, about: false });

  useEffect(() => {
    const newErrors = { title: "", about: "" };
    if (touched.title && title.length < 5) newErrors.title = "Title must be at least 5 characters.";
    if (touched.title && title.length > 150) newErrors.title = "Title cannot exceed 150 characters.";
    if (touched.about && about.length > 300) newErrors.about = "About cannot exceed 300 characters.";
    setErrors(newErrors);
  }, [title, about, touched]);

  const isValid = !errors.title && !errors.about && title.trim() && about.trim();

  const handleBlur = (field: "title" | "about") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field: "title" | "about") => {
    if (!touched[field]) setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return { errors, isValid, handleBlur, handleChange };
};