import { useWindowWidth } from "../../hooks/useWindowWidth";
import NavBarMobile from "./NavBarMobile";

export default function Footer() {
  const currentWidth = useWindowWidth();
  return (
    <footer className="bg-black bg-opacity-35">
      {currentWidth <= 768 && <NavBarMobile />}
    </footer>
  );
}
