import React, { createContext, useState, useContext } from "react";

type Role = "visitor" | "user" | "gestor";

interface AuthContextProps {
  role: Role;
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextProps>({
  role: "visitor",
  setRole: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRole] = useState<Role>("visitor");

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper hook
export const useAuth = () => useContext(AuthContext);
