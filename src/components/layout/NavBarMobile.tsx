import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useExitSession from "../../hooks/useExitSession";

export default function NavBarMobile() {
  const exitSession = useExitSession();
  const { isLoggedIn } = useAuth();

  const handleLogout = () => {
    exitSession();
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white text-xs shadow-lg z-50">
      <ul className="grid grid-cols-5 gap-2 p-2">
        {isLoggedIn ? (
          <>
            <li className="text-center">
              <Link
                to="/profile"
                className="block p-2 bg-gray-700 rounded-md hover:bg-gray-600 w-full"
              >
                <div className="text-lg">👤</div>
                <span>Profile</span>
              </Link>
            </li>
            <li className="text-center">
              <Link
                to="/collection"
                className="block p-2 bg-gray-700 rounded-md hover:bg-gray-600 w-full"
              >
                <div className="text-lg">📜</div>
                <span>Collection</span>
              </Link>
            </li>
            <li className="text-center">
              <Link
                to="/equipment"
                className="block p-2 bg-gray-700 rounded-md hover:bg-gray-600 w-full"
              >
                <div className="text-lg">🛡️</div>
                <span>Equipment</span>
              </Link>
            </li>
            <li className="text-center">
              <Link
                to="/arena"
                className="block p-2 bg-gray-700 rounded-md hover:bg-gray-600 w-full"
              >
                <div className="text-lg">⚔️</div>
                <span>Arena</span>
              </Link>
            </li>
            <li className="text-center">
              <button
                onClick={handleLogout}
                className="block p-2 bg-red-600 rounded-md hover:bg-red-500 w-full"
              >
                <div className="text-lg">🚪</div>
                <span>Logout</span>
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="text-center">
              <Link
                to="/"
                className="block p-2 bg-gray-700 rounded-md hover:bg-gray-600"
              >
                <div className="text-lg">🏠</div>
                <span>Home</span>
              </Link>
            </li>
            <li className="text-center">
              <Link
                to="/news"
                className="block p-2 bg-gray-700 rounded-md hover:bg-gray-600"
              >
                <div className="text-lg">📰</div>
                <span>News</span>
              </Link>
            </li>
            <li className="text-center">
              <Link
                to="/about"
                className="block p-2 bg-gray-700 rounded-md hover:bg-gray-600"
              >
                <div className="text-lg">❓</div>
                <span>About</span>
              </Link>
            </li>
            <li className="text-center">
              <Link
                to="/register"
                className="block p-2 bg-green-600 rounded-md hover:bg-green-500"
              >
                <div className="text-lg">📝</div>
                <span>Register</span>
              </Link>
            </li>
            <li className="text-center">
              <Link
                to="/login"
                className="block p-2 bg-blue-600 rounded-md hover:bg-blue-500"
              >
                <div className="text-lg">🔑</div>
                <span>Login</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
