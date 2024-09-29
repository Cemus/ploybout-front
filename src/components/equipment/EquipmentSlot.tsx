import { EquipmentInterface, ItemInterface } from "../../types/types";
import capitalize from "../../utils/capitalize";
import { useDrop } from "react-dnd";

interface EquipmentSlotProps {
  item?: ItemInterface | null;
  type: string;
  equipItem: (item: ItemInterface, slot: string) => void;
  unequipItem: (slot: string) => void;
}

export default function EquipmentSlot({
  item,
  type,
  equipItem,
  unequipItem,
}: EquipmentSlotProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "ITEM",
    drop: (draggedItem: { equipment: EquipmentInterface }) => {
      const item = draggedItem.equipment.item;
      if (type === item.slot) {
        equipItem(item, type);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  return (
    <div
      className="relative flex items-center justify-center h-16 w-16 lg:h-32 lg:w-32 bg-black rounded-md shadow-md shadow-black"
      ref={drop}
    >
      {item ? (
        <>
          <p>{item.name}</p>
          <div
            className="absolute flex items-center justify-center font-bold top-1 right-1 bg-red-500 h-6 w-6 lg:h-8 lg:w-8 border-2 border-black cursor-pointer hover:border-white rounded-md transition-all"
            onClick={() => unequipItem(type)}
          >
            X
          </div>
        </>
      ) : (
        <p>{capitalize(type)}</p>
      )}
    </div>
  );
}
