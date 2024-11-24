import { useEffect, useState } from "react";
import { checkEquippedCardsEquality } from "../../utils/checkEquippedCardEquality";
import { CardInterface } from "../../types/types";

interface SubmitDeckButtonProps {
  loading: boolean;
  initialEquippedCards: CardInterface[] | null;
  equippedCards: CardInterface[] | null;
  saveEquippedCards: (equippedCards: CardInterface[]) => void;
}

export default function SubmitDeckButton({
  loading,
  saveEquippedCards,
  initialEquippedCards,
  equippedCards,
}: SubmitDeckButtonProps) {
  const [areDecksEqual, setAreDecksEqual] = useState<boolean>(true);
  const handleSave = () => {
    if (equippedCards) {
      saveEquippedCards(equippedCards);
    }
  };

  useEffect(() => {
    setAreDecksEqual(
      checkEquippedCardsEquality(initialEquippedCards, equippedCards)
    );
  }, [initialEquippedCards, equippedCards]);
  return (
    <>
      {!loading ? (
        <button
          onClick={handleSave}
          className={`text-white text-base lg:text-xl py-2 lg:py-4 px-8 bg-green-700 rounded-xl shadow-xl  ${
            areDecksEqual ? "invisible" : "visible"
          }`}
          disabled={loading}
        >
          Save changes
        </button>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <p className="animate-pulse text-2xl text-white">Loading profile</p>
          <div className="loading-circle animate-spin"></div>
        </div>
      )}
    </>
  );
}
