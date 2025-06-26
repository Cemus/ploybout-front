import { useNavigate } from "react-router-dom";

interface ResultsScreenProps {
  battleResult: boolean | null;
}

export default function ResultsScreen({ battleResult }: ResultsScreenProps) {
  const navigate = useNavigate();

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  let message;
  let colorClass;

  if (battleResult === true) {
    message = "You win!";
    colorClass = "text-[var(--green2)]";
  } else if (battleResult === null) {
    message = "ex æquo.";
    colorClass = "text-[var(--yellow2)]";
  } else {
    message = "You lose...";
    colorClass = "text-[var(--red3)]";
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <h1 className={`text-4xl font-bold font-logo ${colorClass}`}>
        {message}
      </h1>
      <button
        onClick={handleGoToProfile}
        className="px-6 py-3 bg-[var(--green2)] text-white rounded-lg transition hover:bg-[var(--green3)]"
      >
        Continue
      </button>
    </div>
  );
}
