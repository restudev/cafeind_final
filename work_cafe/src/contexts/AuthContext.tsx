import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "editor";
  avatar?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load user from session storage on mount
  useEffect(() => {
    try {
      const storedUserData = sessionStorage.getItem("auth_user");
      if (storedUserData) {
        const parsedUser = JSON.parse(storedUserData);
        
        // Validate token expiry if exists
        if (parsedUser.token) {
          try {
            const tokenData = JSON.parse(atob(parsedUser.token));
            if (tokenData.exp && tokenData.exp > Math.floor(Date.now() / 1000)) {
              setUser(parsedUser);
              setIsAuthenticated(true);
            } else {
              // Token expired, clear storage
              sessionStorage.removeItem("auth_user");
              console.log("Token expired, cleared storage");
            }
          } catch (tokenError) {
            console.error("Token validation error:", tokenError);
            sessionStorage.removeItem("auth_user");
          }
        } else {
          // No token, but user data exists
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      }
    } catch (storageError) {
      console.error("Storage error:", storageError);
      sessionStorage.removeItem("auth_user");
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      
      // Client-side validation
      if (!email.trim() || !password) {
        setError("Email and password are required");
        return false;
      }

      if (!email.includes("@")) {
        setError("Invalid email format");
        return false;
      }

      console.log("Attempting login for:", email);

      const response = await fetch("https://cafeind.my.id/cafeind_api/api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password: password 
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get response text first to check format
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Response text:", responseText);
        setError("Server returned invalid response format");
        return false;
      }

      console.log("Parsed response:", data);

      if (data.success && data.user) {
        const { user: userData, token } = data;
        const authUser: User = { ...userData, token };
        
        setUser(authUser);
        setIsAuthenticated(true);
        
        // Store user data
        try {
          sessionStorage.setItem("auth_user", JSON.stringify(authUser));
          console.log("User data stored successfully");
        } catch (storageError) {
          console.warn("Could not store user data:", storageError);
        }
        
        return true;
      } else {
        setError(data.message || "Login failed");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error instanceof TypeError && error.message.includes("fetch")) {
        setError("Cannot connect to server. Please ensure the API server is running.");
      } else if (error instanceof SyntaxError) {
        setError("Invalid server response. Please check API configuration.");
      } else {
        setError(error instanceof Error ? error.message : "An error occurred during login");
      }
      
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    
    try {
      sessionStorage.removeItem("auth_user");
      console.log("User logged out successfully");
    } catch (storageError) {
      console.warn("Could not clear storage:", storageError);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};