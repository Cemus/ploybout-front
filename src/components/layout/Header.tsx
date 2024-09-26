import NavBarLarge from "./NavBarLarge";
import { useWindowWidth } from "../../hooks/useWindowWidth";

export default function Header() {
  const currentWidth = useWindowWidth();
  return (
    <header className="bg-black bg-opacity-35">
      {currentWidth > 768 && <NavBarLarge />}
    </header>
  );
}
