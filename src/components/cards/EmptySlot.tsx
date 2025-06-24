import { useDrop } from "react-dnd";

interface EmptySlotProps {
  dropToEquip?: (id: number, slot: number) => void;
  dropToCollection?: (id: number, slot: number) => void;
  dropToSwapEquippedCards?: (index1: number, index2: number) => void;
  slot: number;
  context: "deck" | "collection";
}

export default function EmptySlot({
  dropToEquip,
  dropToCollection,
  dropToSwapEquippedCards,
  slot,
  context,
}: EmptySlotProps) {
  const [{ isOver }, drop] = useDrop({
    accept: "CARD",
    drop: (card: {
      id: number;
      context: "deck" | "collection";
      slot: number;
    }) => {
      if (dropToEquip && dropToSwapEquippedCards) {
        card.context === "collection" && context === "deck"
          ? dropToEquip(card.id, slot)
          : dropToSwapEquippedCards(card.slot, slot);
      }
      if (dropToCollection) {
        card.context === "deck" &&
          context === "collection" &&
          dropToCollection(card.id, card.slot);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  return (
    <div
      ref={drop}
      className={`flex items-center justify-center text-center 
                  w-32 h-48 lg:w-48 lg:h-72 
                  border-2 border-dashed border-slate-200 
                  rounded-md select-none 
                  ${isOver ? "bg-green-500" : "bg-slate-900"}`}
    >
      <span className="text-slate-200">Empty Slot</span>
    </div>
  );
}
