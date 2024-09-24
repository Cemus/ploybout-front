import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Overview() {
  const { isLoggedIn } = useAuth();
  return (
    <main className="flex flex-col items-center border-2 border-gray-200 border-opacity-10 w-4/6">
      <div className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-purple-800 to-50% w-full h-32">
        <div className="flex flex-col w-1/2 items-center justify-center">
          <p className="text-white text-lg">
            Welcome to <em className=" not-italic text-2xl">AutoBattler</em>
          </p>
          <p className="text-white opacity-50 text-md">
            Participate at joyful fights!
          </p>
        </div>
        <div className="flex flex-col w-1/2  items-center justify-center">
          <p className="text-white text-center">BLABLABLA</p>
        </div>
      </div>
      {!isLoggedIn && (
        <button className="relative bottom-5 text-white bg-orange-500 w-24 py-2 text-center rounded-lg">
          <Link to="/login">Sign in!</Link>
        </button>
      )}
    </main>
  );
}
