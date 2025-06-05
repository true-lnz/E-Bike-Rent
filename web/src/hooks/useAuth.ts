import { useAuthContext } from "../contexts/AuthContext";

// useAuth.ts
export const useAuth = () => {
  const { email, setEmail, isVerified, setIsVerified, user, setUser, isLoading } = useAuthContext();
  return {
    email,
    setEmail,
    isVerified,
    setIsVerified,
    user,
    setUser,
    isLoading,
  };
};
