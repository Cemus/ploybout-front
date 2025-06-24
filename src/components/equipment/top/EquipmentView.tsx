import { useEffect, useState } from "react";
import CharacterCanvas from "../../character/CharacterCanvas";
import {
  EquipmentInterface,
  EquipmentSlotInterface,
  EquipmentSlots,
  FighterInterface,
  ItemInterface,
} from "../../../types/types";
import EquipmentSlot from "./EquipmentSlot";

interface EquipmentViewProps {
  currentFighter: FighterInterface;
  setCurrentFighter: React.Dispatch<
    React.SetStateAction<FighterInterface | null>
  >;
  currentEquipmentCollection: ItemInterface[] | null;
  setCurrentEquipmentCollection: React.Dispatch<
    React.SetStateAction<ItemInterface[] | null>
  >;
}

export default function EquipmentView({
  currentFighter,
  setCurrentFighter,
  currentEquipmentCollection,
  setCurrentEquipmentCollection,
}: EquipmentViewProps) {
  const [equipmentSlots, setEquipmentSlots] = useState<EquipmentSlots>({
    weapon: null,
    hands: null,
    feet: null,
    body: null,
  });

  const equipItem = (item: ItemInterface, slot: EquipmentSlotInterface) => {
    setEquipmentSlots((prevSlots) => ({
      ...prevSlots,
      [slot]: item,
    }));

    setCurrentFighter((prevFighter) => {
      if (!prevFighter) {
        console.log("merde");
        return prevFighter;
      }

      const updatedEquipment: EquipmentInterface = {
        ...prevFighter.equipment,
        [slot]: item,
      };

      return {
        ...prevFighter,
        equipment: updatedEquipment,
      };
    });

    setCurrentEquipmentCollection((prevCollection) => {
      if (!prevCollection) return null;

      return prevCollection
        .map((equip) =>
          equip.id === item.id && equip.quantity
            ? { ...equip, quantity: equip.quantity - 1 }
            : equip
        )
        .filter((equip) => !equip.quantity || equip.quantity > 0);
    });
  };

  const unequipItem = (slot: EquipmentSlotInterface) => {
    const itemToUnequip = currentFighter.equipment[slot];
    if (!itemToUnequip) {
      return;
    }

    setEquipmentSlots((prevSlots) => ({
      ...prevSlots,
      [slot]: null,
    }));

    const updatedEquipment: EquipmentInterface = {
      ...currentFighter.equipment,
      [slot]: null,
    };

    setCurrentFighter((prevFighter) => {
      console.log(
        prevFighter
          ? { ...prevFighter, equipment: updatedEquipment }
          : prevFighter
      );
      return prevFighter
        ? { ...prevFighter, equipment: updatedEquipment }
        : prevFighter;
    });

    const updatedCurrentEquipmentCollection = currentEquipmentCollection?.map(
      (equip) =>
        equip.id === itemToUnequip.id && equip.quantity
          ? { ...equip, quantity: equip.quantity + 1 }
          : equip
    );

    setCurrentEquipmentCollection(updatedCurrentEquipmentCollection || []);
  };

  useEffect(() => {
    if (currentFighter) {
      const mappedSlots: EquipmentSlots = {
        weapon: currentFighter.equipment.weapon || null,
        hands: currentFighter.equipment.hands || null,
        feet: currentFighter.equipment.feet || null,
        body: currentFighter.equipment.body || null,
      };
      setEquipmentSlots(mappedSlots);
    }
  }, [currentFighter]);

  const slotTypes: EquipmentSlotInterface[] = [
    "hands",
    "body",
    "feet",
    "weapon",
  ];

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
            item={equipmentSlots.weapon}
            type="weapon"
            equipItem={equipItem}
            unequipItem={unequipItem}
          />
        </div>
      </div>
    </div>
  );
}
