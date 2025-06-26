import axios, { AxiosError } from "axios";
import { useFighter } from "../../hooks/useFighter";
import {
  EquipmentInterface,
  FighterInterface,
  ItemInterface,
} from "../../types/types";
import { useEffect, useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { useFn } from "../../hooks/useFn";
import EquipmentView from "./top/EquipmentView";
import EquipmentEditor from "./bottom/EquipmentEditor";

export default function EquipmentPage() {
  const { selectedFighter } = useFighter();
  const [loading, setLoading] = useState(false);
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
    equipmentSlots: EquipmentInterface
  ) => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/equipment/update`,
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
      setLoading(false);
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
    setCurrentFighter((prev) => prev ?? selectedFighter);

    setCurrentEquipmentCollection(
      (prev) => prev ?? profile?.equipmentCollection
    );
  }, [stableFetchProfile, selectedFighter, profile]);

  return (
    <div className="flex-1 flex flex-col  p-4 select-none text-white pb-24 md:pb-0">
      {currentFighter && (
        <>
          <EquipmentView
            currentFighter={currentFighter}
            setCurrentFighter={setCurrentFighter}
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
            className="button w-96 text-center self-center"
            onClick={() =>
              updateServerEquipment(currentFighter.id, currentFighter.equipment)
            }
            disabled={loading}
          >
            {loading ? "Please wait..." : "Submit"}
          </button>
        </>
      )}
    </div>
  );
}
