import useCardCollection from "../../hooks/useCardCollection";
import SubmitDeckButton from "../common/SubmitDeckButton";
import Collection from "./Collection";
import EquippedCards from "./EquippedCards";

export default function CollectionPage() {
  const {
    collection,
    equippedCards,
    initialEquippedCards,
    loading,
    handleDropToCollection,
    handleDropToEquipped,
    handleEquippedCardSwap,
    saveEquippedCards,
  } = useCardCollection();

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-2 select-none pb-24 md:pb-0">
      <Collection
        cards={collection}
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
