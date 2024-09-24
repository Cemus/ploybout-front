import { useDrop } from "react-dnd";

interface EmptySlotProps {
  dropToEquip?: (id: number, slot: number) => void;
  dropToCollection?: (id: number, slot: number) => void;
  dropToSwapEquippedCards?: (index1: number, index2: number) => void;
  slot: number;
  context: "equipped" | "collection";
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
    drop: (item: {
      id: number;
      context: "equipped" | "collection";
      slot: number;
    }) => {
      if (dropToEquip && dropToSwapEquippedCards) {
        item.context === "collection" && context === "equipped"
          ? dropToEquip(item.id, slot)
          : dropToSwapEquippedCards(item.slot, slot);
      }
      if (dropToCollection) {
        item.context === "equipped" &&
          context === "collection" &&
          dropToCollection(item.id, item.slot);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  return (
    <div
      ref={drop}
      className={`flex items-center justify-center w-24 h-32 lg:text-base lg:w-48 lg:h-72 border-2 border-dashed border-slate-200 rounded-md ${
        isOver ? "bg-green-500" : "bg-slate-900"
      } select-none`}
    >
      <span className="text-slate-200">Empty Slot</span>
    </div>
  );
}
