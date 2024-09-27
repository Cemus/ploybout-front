import { useWindowWidth } from "../../hooks/useWindowWidth";
import NavBarMobile from "./NavBarMobile";

export default function Footer() {
  const currentWidth = useWindowWidth();
  return (
    <footer className="fixed  bottom-0 left-0 right-0  bg-black bg-opacity-35">
      {currentWidth <= 768 && <NavBarMobile />}
    </footer>
  );
}
