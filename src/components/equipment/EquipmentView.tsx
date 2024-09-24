import { useEffect, useState } from "react";
import CharacterCanvas from "../character/CharacterCanvas";
import {
  EquipmentInterface,
  FighterInterface,
  ItemInterface,
} from "../../types/types";
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
    const updatedEquipments = currentFighter.equipments.map((equipment) => {
      if (equipment.item.slot === slot) {
        return { ...equipment, equipped: currentFighter.id };
      }
      return equipment;
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

    const updatedEquipments = currentFighter.equipments.map((equipment) => {
      if (equipment.item.slot === slot) {
        return { ...equipment, equipped: -1 };
      }
      return equipment;
    });

    setCurrentFighter((prevFighter) => {
      if (!prevFighter) return prevFighter;
      return {
        ...prevFighter,
        equipments: updatedEquipments,
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

      currentFighter.equipments.forEach((equipment: EquipmentInterface) => {
        if (equipment.equipped === currentFighter.id) {
          newSlots[equipment.item.slot] = equipment.item;
        }
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
