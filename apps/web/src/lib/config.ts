export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  singleUserMode: process.env.SINGLE_USER_MODE === "true",
  defaultUserEmail: process.env.DEFAULT_USER_EMAIL || "admin@tencoder.dev",
  defaultUserName: process.env.DEFAULT_USER_NAME || "Admin User",
} as const;
