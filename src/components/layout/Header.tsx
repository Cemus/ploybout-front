import NavBarDesktop from "./NavBarDesktop";
import { useWindowWidth } from "../../hooks/useWindowWidth";

export default function Header() {
  const currentWidth = useWindowWidth();
  return (
    <header className="bg-black bg-opacity-35">
      {currentWidth > 768 && <NavBarDesktop />}
    </header>
  );
}
