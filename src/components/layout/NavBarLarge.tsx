import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useExitSession from "../../hooks/useExitSession";

export default function NavBarLarge() {
  const exitSession = useExitSession();
  const { isLoggedIn } = useAuth();
  const handleLogout = () => {
    exitSession();
  };
  return (
    <nav className="text-white text-sm lg:text-base">
      <ul className="flex justify-between ">
        <div className="flex items-center justify-center gap-2  p-4 ">
          {isLoggedIn ? (
            <>
              <li className="px-2 select-none">
                <Link to="/profile">Profile</Link>
              </li>
              <li className="px-2 select-none">
                <Link to="/collection">Collection</Link>
              </li>
              <li className="px-2 select-none">
                <Link to="/equipment">Equipment</Link>
              </li>
              <li className="px-2 select-none">
                <Link to="/arena">Arena</Link>
              </li>
            </>
          ) : (
            <>
              <li className="px-2 select-none">
                <Link to="/">Home</Link>
              </li>
              <li className="px-2 select-none">
                <Link to="/news">News</Link>
              </li>
              <li className="px-2 select-none">
                <Link to="/about">About</Link>
              </li>
            </>
          )}
        </div>
        <div className="flex items-center justify-center p-4">
          {isLoggedIn ? (
            <>
              <li className="px-2 select-none">
                <button onClick={handleLogout} className="text-white">
                  Logout &rarr;
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="px-2 select-none">
                <Link to="/register">Register</Link>
              </li>
              <li className="px-2 select-none">
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
}
