import { CardInterface } from "../../types/types";
import Card from "./Card";
import EmptySlot from "./EmptySlot";

interface EquippedCardProps {
  equippedCards: CardInterface[] | null;
  dropToEquip?: (id: number, slot: number) => void;
  dropToSwapEquippedCards?: (slot1: number, slot2: number) => void;
  dropToCollection?: (id: number) => void;
}

export default function EquippedCards({
  equippedCards,
  dropToEquip,
  dropToSwapEquippedCards,
}: EquippedCardProps) {
  const TOTAL_SLOTS = 5;
  const renderEquippedCards = () => {
    if (Array.isArray(equippedCards)) {
      const slots = [];
      for (let i = 0; i < TOTAL_SLOTS; i++) {
        const equippedCard = equippedCards?.find((card) => card.slot === i);
        if (equippedCard) {
          if (equippedCard.slot === i) {
            slots.push(
              <Card
                key={i}
                id={equippedCard.id}
                name={equippedCard.name}
                description={equippedCard.description}
                type={equippedCard.type}
                effects={equippedCard.effects}
                conditions={equippedCard.conditions}
                slot={equippedCard.slot}
                quantity={0}
                isEquipped={true}
                context={
                  dropToEquip || dropToSwapEquippedCards ? "deck" : "profile"
                }
                dropToSwapEquippedCards={dropToSwapEquippedCards}
              />
            );
          }
        } else {
          slots.push(
            <EmptySlot
              key={i}
              slot={i}
              context="deck"
              dropToEquip={dropToEquip}
              dropToSwapEquippedCards={dropToSwapEquippedCards}
            />
          );
        }
      }

      return slots;
    }
  };
  return (
    <>
      <div className="flex flex-col p-2 justify-center items-center max-w-[100vw]">
        <h3 className="text-white text-xl pb-4">Cards equipped</h3>
        <div
          className={`flex items-center gap-2 max-w-full overflow-x-auto min-h-52`}
        >
          {equippedCards ? (
            renderEquippedCards()
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <p className="animate-pulse text-2xl text-white">
                Loading equipped cards
              </p>
              <div className="loading-circle animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
