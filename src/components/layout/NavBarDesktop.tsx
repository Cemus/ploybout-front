import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function NavBarDesktop() {
  const { isLoggedIn } = useAuth();

  return (
    <nav className="text-white text-sm md:text-lg p-4">
      <div className="flex justify-between">
        <div className="flex items-center justify-center gap-2 ">
          {isLoggedIn ? (
            <ul className="flex">
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
            </ul>
          ) : (
            <ul className="flex">
              <li>
                <Link className="custom-nav-button" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="custom-nav-button" to="/news">
                  News
                </Link>
              </li>
              <li>
                <Link className="custom-nav-button" to="/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="custom-nav-button" to="/gcu">
                  Conditions of Use
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
