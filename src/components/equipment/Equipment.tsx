import { useState } from "react";
import { EquipmentInterface, ItemInterface } from "../../types/types";
import { useDrag } from "react-dnd";

interface EquipmentProps {
  equipment: EquipmentInterface;
  selectedItem: ItemInterface | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<ItemInterface | null>>;
  fighterId: number;
}

export default function Equipment({
  equipment,
  selectedItem,
  setSelectedItem,
  fighterId,
}: EquipmentProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ITEM",
    item: { id: equipment.item.id, equipment },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  const [equipmentStat] = useState({
    hp: equipment.item.hp,
    atk: equipment.item.atk,
    spd: equipment.item.spd,
    mag: equipment.item.mag,
    range: equipment.item.range,
  });

  const displayStat = () => {
    return Object.entries(equipmentStat)
      .filter(([, value]) => value !== 0)
      .map(([key, value]) => (
        <p key={key}>
          {key.toUpperCase()}: {value}
        </p>
      ));
  };

  const getImage = (type: string) => {
    switch (type) {
      case "dagger":
        return "https://game-icons.net/icons/ffffff/000000/1x1/lorc/curvy-knife.svg";
      case "sword":
        return "https://game-icons.net/icons/ffffff/000000/1x1/skoll/stiletto.svg";
      case "staff":
        return "https://game-icons.net/icons/ffffff/000000/1x1/lorc/wizard-staff.svg";
      case "axe":
        return "https://game-icons.net/icons/ffffff/000000/1x1/lorc/battle-axe.svg";
      default:
        break;
    }
  };
  return (
    <div
      ref={drag}
      className={`relative flex flex-col text-center justify-center items-center bg-black m-1 p-1 border-2 border-black w-32 rounded-md hover:border-slate-500 cursor-pointer  ${
        selectedItem === equipment.item ? "border-white" : "border-black"
      }`}
      onClick={() =>
        setSelectedItem(() =>
          selectedItem !== equipment.item ? equipment.item : null
        )
      }
    >
      <p className="bg-slate-800 w-full">{equipment.item.name}</p>
      <div className="w-16 h-16">
        <img src={getImage(equipment.item.type)} alt={equipment.item.name} />
      </div>
      <div className="bg-slate-800 w-full">{displayStat()}</div>

      {equipment.equipped === fighterId && (
        <div className="absolute top-1 left-1 bg-yellow-400 text-black font-bold p-2 rounded-full w-5 h-5 flex items-center justify-center text-xs">
          E
        </div>
      )}
    </div>
  );
}
