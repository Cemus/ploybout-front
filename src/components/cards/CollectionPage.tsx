import useCardCollection from "../../hooks/useCardCollection";
import SubmitDeckButton from "../common/SubmitDeckButton";
import Collection from "./Collection";
import EquippedCards from "./EquippedCards";

export default function CollectionPage() {
  const {
    cards,
    equippedCards,
    initialEquippedCards,
    loading,
    handleDropToCollection,
    handleDropToEquipped,
    handleEquippedCardSwap,
    saveEquippedCards,
  } = useCardCollection();

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-4 select-none">
      <Collection
        cards={cards}
        handleDropToCollection={handleDropToCollection}
      />
      <EquippedCards
        equippedCards={equippedCards}
        dropToEquip={handleDropToEquipped}
        dropToSwapEquippedCards={handleEquippedCardSwap}
      />
      <SubmitDeckButton
        loading={loading}
        initialEquippedCards={initialEquippedCards}
        equippedCards={equippedCards}
        saveEquippedCards={saveEquippedCards}
      />
    </div>
  );
}
