import axios from "axios";
import { useFighter } from "../../hooks/useFighter";
import {
  EquipmentInterface,
  FighterInterface,
  ItemInterface,
} from "../../types/types";
import { useEffect, useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { useFn } from "../../hooks/useFn";
import EquipmentView from "./EquipmentView";
import EquipmentEditor from "./EquipmentEditor";

export default function EquipmentPage() {
  const { selectedFighter } = useFighter();
  const [currentFighter, setCurrentFighter] = useState<FighterInterface | null>(
    null
  );
  const { fetchProfile } = useProfile();
  const stableFetchProfile = useFn(fetchProfile);

  const [selectedItem, setSelectedItem] = useState<ItemInterface | null>(null);

  const updateServerEquipment = async (
    fighterId: number,
    equipmentSlots: EquipmentInterface[]
  ) => {
    const token = localStorage.getItem("token");
    console.log(equipmentSlots);
    try {
      await axios.post(
        "/api/equipment/update",
        {
          fighterId,
          equipmentSlots,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Équipement mis à jour avec succès.");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'équipement:", error);
    }
  };

  useEffect(() => {
    if (!selectedFighter) {
      stableFetchProfile();
    }
    if (!currentFighter) {
      console.log("HEHEHE");
      setCurrentFighter(selectedFighter);
    }
  }, [stableFetchProfile, selectedFighter, currentFighter]);

  return (
    <div className="flex-1 flex flex-col  p-4 select-none text-white">
      {currentFighter && (
        <>
          <EquipmentView
            currentFighter={currentFighter}
            setCurrentFighter={setCurrentFighter}
            selectedItem={selectedItem}
          />
          <EquipmentEditor
            currentFighter={currentFighter}
            setCurrentFighter={setCurrentFighter}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
          <button
            type="submit"
            className="button w-1/2 self-center"
            onClick={() =>
              updateServerEquipment(
                currentFighter.id,
                currentFighter.equipments
              )
            }
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
}
