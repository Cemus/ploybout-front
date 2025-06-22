import { useEffect, useState } from "react";
import { FighterInterface, ItemInterface } from "../../../types/types";
import Equipment from "./Equipment";
import EquipmentStats from "../top/EquipmentStats";

interface EquipmentEditorProps {
  currentFighter: FighterInterface;
  setCurrentFighter: React.Dispatch<
    React.SetStateAction<FighterInterface | null>
  >;
  selectedItem: ItemInterface | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<ItemInterface | null>>;
  currentEquipmentCollection: ItemInterface[] | null;
}

export default function EquipmentEditor({
  currentFighter,
  selectedItem,
  setSelectedItem,
  currentEquipmentCollection,
}: EquipmentEditorProps) {
  const [filter, setFilter] = useState("all");
  const [equipmentFiltered, setEquipmentFiltered] = useState<
    ItemInterface[] | null
  >(currentEquipmentCollection);

  const filterButtons = [
    {
      image:
        "https://game-icons.net/icons/ffffff/000000/1x1/various-artists/infinity.svg",
      filter: "all",
    },
    {
      image:
        "https://game-icons.net/icons/ffffff/000000/1x1/delapouite/sword-brandish.svg",
      filter: "weapon",
    },
    {
      image:
        "https://game-icons.net/icons/ffffff/000000/1x1/delapouite/gloves.svg",
      filter: "hands",
    },
    {
      image:
        "https://game-icons.net/icons/ffffff/000000/1x1/delapouite/chest-armor.svg",
      filter: "body",
    },
    {
      image:
        "https://game-icons.net/icons/ffffff/000000/1x1/lorc/steeltoe-boots.svg",
      filter: "feet",
    },
  ];

  useEffect(() => {
    setEquipmentFiltered(() => {
      if (!currentEquipmentCollection) return null;
      return filter !== "all"
        ? currentEquipmentCollection.filter(
            (equipment) => equipment.slot === filter
          )
        : currentEquipmentCollection;
    });
  }, [filter, currentEquipmentCollection]);

  return (
    <div className="flex-1 mt-4 overflow-x-auto">
      <div>
        <EquipmentStats
          currentFighter={currentFighter}
          selectedItem={selectedItem}
        />
      </div>
      <div className="flex flex-col">
        {/*top*/}
        <div className=" flex  items-center justify-around gap-2">
          {filterButtons.map((button, index) => {
            return (
              <button
                key={index}
                className={`bg-black h-16 w-full rounded-md flex items-center border-2  justify-center ${
                  filter === button.filter ? "border-white" : "border-black"
                }`}
                onClick={() => setFilter(button.filter)}
              >
                <img className="w-12" src={button.image} alt={button.filter} />
              </button>
            );
          })}
        </div>
        <div className="flex">
          {equipmentFiltered?.map((equipment, index) => {
            return (
              <Equipment
                key={index}
                equipment={equipment}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                currentFighter={currentFighter}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
