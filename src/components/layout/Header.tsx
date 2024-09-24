import NavBarLarge from "./NavBarLarge";
export default function Header() {
  return (
    <header className="bg-black bg-opacity-35">
      <div className="hidden lg:visible">
        <NavBarLarge />
      </div>
    </header>
  );
}
