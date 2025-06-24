import NavBarDesktop from "./NavBarDesktop";
import { useWindowWidth } from "../../hooks/useWindowWidth";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useExitSession from "../../hooks/useExitSession";
import logo from "../../assets/icons/ploybout.svg";

export default function Header() {
  const exitSession = useExitSession();
  const { isLoggedIn } = useAuth();
  const handleLogout = () => {
    exitSession();
  };
  const currentWidth = useWindowWidth();
  return (
    <header className="bg-black bg-opacity-35 md:text-lg">
      {currentWidth > 768 && (
        <>
          <div className="flex justify-between">
            <Link className="custom-nav-button" to="/">
              <object
                className=" pointer-events-none"
                data={logo}
                type="image/svg+xml"
              ></object>
            </Link>
            <div className="flex items-center justify-center p-4 gap-12">
              {isLoggedIn ? (
                <>
                  <li className="custom-nav-button custom-logout-button">
                    <button onClick={handleLogout} className="text-white">
                      Logout &rarr;
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      className="custom-nav-button custom-register-button"
                      to="/register"
                    >
                      Register
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="custom-nav-button custom-login-button "
                      to="/login"
                    >
                      Login
                    </Link>
                  </li>
                </>
              )}
            </div>
          </div>

          <NavBarDesktop />
        </>
      )}
    </header>
  );
}
