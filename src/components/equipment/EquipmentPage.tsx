import axios, { AxiosError } from "axios";
import { useFighter } from "../../hooks/useFighter";
import { FighterInterface, ItemInterface } from "../../types/types";
import { useEffect, useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { useFn } from "../../hooks/useFn";
import EquipmentView from "./top/EquipmentView";
import EquipmentEditor from "./bottom/EquipmentEditor";

export default function EquipmentPage() {
  const { selectedFighter } = useFighter();
  const [currentFighter, setCurrentFighter] = useState<FighterInterface | null>(
    null
  );
  const [currentEquipmentCollection, setCurrentEquipmentCollection] = useState<
    ItemInterface[] | null
  >(null);
  const { fetchProfile, profile } = useProfile();
  const stableFetchProfile = useFn(fetchProfile);

  const [selectedItem, setSelectedItem] = useState<ItemInterface | null>(null);

  const updateServerEquipment = async (
    fighterId: number,
    equipmentSlots: ItemInterface[]
  ) => {
    console.log("test");
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
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
      if (response.status !== 200) {
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      const errorMessage = error as AxiosError;
      console.error("Error during the equipment update", errorMessage);
    }
  };

  useEffect(() => {
    if (!selectedFighter || !profile) {
      stableFetchProfile();
      return;
    }
    if (!currentFighter) {
      setCurrentFighter(selectedFighter);
    }
    if (!currentEquipmentCollection) {
      setCurrentEquipmentCollection(profile?.equipmentCollection);
    }
  }, [
    stableFetchProfile,
    selectedFighter,
    currentFighter,
    currentEquipmentCollection,
    profile,
  ]);

  return (
    <div className="flex-1 flex flex-col  p-4 select-none text-white pb-24 md:pb-0">
      {currentFighter && (
        <>
          <EquipmentView
            currentFighter={currentFighter}
            setCurrentFighter={setCurrentFighter}
            selectedItem={selectedItem}
            currentEquipmentCollection={currentEquipmentCollection}
            setCurrentEquipmentCollection={setCurrentEquipmentCollection}
          />
          <EquipmentEditor
            currentFighter={currentFighter}
            setCurrentFighter={setCurrentFighter}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            currentEquipmentCollection={currentEquipmentCollection}
          />
          <button
            type="submit"
            className="button w-1/2 self-center"
            onClick={() =>
              updateServerEquipment(currentFighter.id, currentFighter.equipment)
            }
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
}
