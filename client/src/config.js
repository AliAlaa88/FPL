// API configuration for deployment
// In development: uses Vite proxy (empty string)
// In production: uses VITE_API_URL environment variable

export const API_BASE_URL = import.meta.env.VITE_API_URL || "";
