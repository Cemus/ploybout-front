import { useState, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import capitalize from "../../utils/capitalize";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

const initialFormData: RegisterFormData = {
  username: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
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

  const areInputsValid = () => {
    let result = true;
    if (formData.username.length < 3) {
      setError("Username must contain at least 3 characters.");
      result = false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      result = false;
    }
    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      result = false;
    }
    return result;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!areInputsValid()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/register", {
        username: formData.username,
        password: formData.password,
      });

      const data = response.data;
      const token = data.token;

      if (token) {
        setSuccessMessage("User successfully registered.");
        login(token);
        setFormData(initialFormData);
        navigate("/editor");
        setError(null);
      } else {
        setError("Token not received");
      }
    } catch (error) {
      const e = error as AxiosError;
      const errorMessage = capitalize(
        (e.response?.data as { error?: string }).error
      );
      setError(`${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center  min-h-screen">
      <form onSubmit={handleSubmit} className="form">
        <h3>Register</h3>
        <div>
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
        <div>
          <label htmlFor="password">Password:</label>
          <input
            className="p-2"
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            className="p-2"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
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
          className={` ${loading ? "invisible" : "visible"}`}
        >
          Register
        </button>
        {loading && (
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="animate-pulse text-md text-green-500">
              Registering {formData.username}
            </p>
            <div className="loading-circle animate-spin"></div>
          </div>
        )}
      </form>
    </div>
  );
}
