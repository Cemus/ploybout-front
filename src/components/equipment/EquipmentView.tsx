import { useEffect, useState } from "react";
import CharacterCanvas from "../character/CharacterCanvas";
import { FighterInterface, ItemInterface } from "../../types/types";
import EquipmentSlot from "./EquipmentSlot";

interface EquipmentViewProps {
  currentFighter: FighterInterface;
  setCurrentFighter: React.Dispatch<
    React.SetStateAction<FighterInterface | null>
  >;
  selectedItem: ItemInterface | null;
}

export default function EquipmentView({
  currentFighter,
  setCurrentFighter,
}: EquipmentViewProps) {
  const [equipmentSlots, setEquipmentSlots] = useState({
    hands: null,
    body: null,
    feet: null,
    weapon: null,
  } as Record<string, ItemInterface | null>);

  const equipItem = (item: ItemInterface, slot: string) => {
    setEquipmentSlots((prevSlots) => ({
      ...prevSlots,
      [slot]: item,
    }));
    const updatedEquipments = currentFighter.equipment.map((equip) => {
      if (equip.slot === slot) {
        return { ...equip, equipped: currentFighter.id };
      }
      return equip;
    });

    setCurrentFighter((prevFighter) => {
      if (!prevFighter) return prevFighter;
      return {
        ...prevFighter,
        equipments: updatedEquipments,
      };
    });
  };

  const unequipItem = (slot: string) => {
    setEquipmentSlots((prevSlots) => ({
      ...prevSlots,
      [slot]: null,
    }));

    setCurrentFighter((prevFighter) => {
      if (!prevFighter) return prevFighter;
      return {
        ...prevFighter,
        equipment: prevFighter.equipment.filter((equip) => equip.slot !== slot),
      };
    });
  };

  useEffect(() => {
    if (currentFighter) {
      const newSlots: Record<string, ItemInterface | null> = {
        hands: null,
        body: null,
        feet: null,
        weapon: null,
      };

      currentFighter.equipment.forEach((equipment: ItemInterface) => {
        newSlots[equipment.slot] = equipment;
      });

      setEquipmentSlots(newSlots);
    }
  }, [currentFighter]);

  const slotTypes = ["hands", "body", "feet", "weapon"];

  return (
    <div className="flex items-center justify-center gap-8">
      <div className="flex flex-1 justify-around items-center">
        <div className="flex items-center">
          <div className="flex flex-col gap-4">
            {slotTypes.slice(0, 3).map((slot) => (
              <EquipmentSlot
                key={slot}
                item={equipmentSlots[slot]}
                type={slot}
                equipItem={equipItem}
                unequipItem={unequipItem}
              />
            ))}
          </div>
          <div className="h-48 w-48">
            {currentFighter && (
              <CharacterCanvas fighter={currentFighter} shot="full" />
            )}
          </div>
          <EquipmentSlot
            item={equipmentSlots["weapon"]}
            type="weapon"
            equipItem={equipItem}
            unequipItem={unequipItem}
          />
        </div>
      </div>
    </div>
  );
}
