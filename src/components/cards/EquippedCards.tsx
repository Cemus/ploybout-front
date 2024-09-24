import { DeckSlotInterface } from "../../types/types";
import Card from "./Card";
import EmptySlot from "./EmptySlot";

interface EquippedCardProps {
  equippedCards: DeckSlotInterface[] | null;
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
                id={equippedCard.card.id}
                name={equippedCard.card.name}
                description={equippedCard.card.description}
                type={equippedCard.card.type}
                effects={equippedCard.card.effects}
                conditions={equippedCard.card.conditions}
                slot={equippedCard.slot}
                quantity={0}
                isEquipped={true}
                context={
                  dropToEquip || dropToSwapEquippedCards
                    ? "equipped"
                    : "profile"
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
              context="equipped"
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
      <div className="flex flex-col p-4 items-center">
        <h3 className="text-white text-xl pb-4">Cards equipped</h3>
        <div className={`flex items-center justify-center flex-wrap gap-2 `}>
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
