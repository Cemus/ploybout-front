import { useState, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface LoginFormData {
  username: string;
  password: string;
}

const initialFormData: LoginFormData = {
  username: "",
  password: "",
};

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post("/api/login", {
        username: formData.username,
        password: formData.password,
      });

      const data = response.data;
      const hasFighters = data.hasFighters;
      const token = data.token;

      if (token) {
        login(token);
        setError(null);
        setSuccessMessage("User successfully logged in.");
        setFormData(initialFormData);
        hasFighters ? navigate("/profile") : navigate("/editor");
      } else {
        console.error("No token");
      }
    } catch (error) {
      const e = error as AxiosError;
      const errorMessage = (e.response?.data as { error?: string }).error;
      setError(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center ">
      <form onSubmit={handleSubmit} className="form">
        <h3>Login</h3>
        <div className="flex flex-col items-center justify-between w-full">
          <label htmlFor="username">Username:</label>
          <input
            className="p-2"
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </div>
        <div className="flex flex-col items-center justify-between w-full">
          <label htmlFor="password" className="max-w-1/2">
            Password:
          </label>
          <input
            className="p-2"
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="password"
          />
        </div>
        <div className="w-full text-center my-2">
          <div
            className={`transition-opacity duration-300 ${
              error || successMessage ? "opacity-100" : "opacity-0"
            } h-4`}
          >
            {error && <p className="text-red-600">{error}</p>}
            {successMessage && (
              <p className="text-green-600">{successMessage}</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className={`${loading && "hidden"}`}
          disabled={loading}
        >
          Login
        </button>
        {loading && (
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="animate-pulse text-md text-green-500">Logging in</p>
            <div className="loading-circle animate-spin"></div>
          </div>
        )}
      </form>
    </div>
  );
}
