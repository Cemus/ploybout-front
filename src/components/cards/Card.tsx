import { useCallback, useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import cardIcons from "../../utils/cardIcons";
import { CardInterface } from "../../types/types";

export default function Card({
  id,
  name,
  effects,
  isEquipped,
  conditions,
  quantity,
  context,
  slot,
  dropToSwapEquippedCards,
}: CardInterface) {
  const [isGrayed, setIsGrayed] = useState<boolean>(false);

  const isDraggable = useCallback(() => {
    switch (context) {
      case "profile":
        return false;
      case "deck":
        return true;
      case "collection":
        return quantity > 0;
      default:
        return false;
    }
  }, [context, quantity]);

  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: { id, slot, context },
    canDrag: () => isDraggable(),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "CARD",
    drop: (item: { id: number; slot: number }) => {
      if (dropToSwapEquippedCards && slot !== undefined) {
        dropToSwapEquippedCards(item.slot, slot);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  useEffect(() => {
    if (isEquipped && context === "collection") {
      quantity <= 0 ? setIsGrayed(true) : setIsGrayed(false);
    }
    if (isDraggable()) {
      isDragging ? setIsGrayed(true) : setIsGrayed(false);
    }
  }, [setIsGrayed, isDragging, isDraggable, quantity, isEquipped, context]);

  const getCondition = (condition: string, value: number) => {
    switch (condition) {
      case "energyCost":
        return (
          <li className="flex items-center" key={condition}>
            <p>Cost</p>
            <span className="condeffect lg:px-2 px-1">{value}</span>

            <img
              src={cardIcons[condition.slice(0, condition.indexOf("Cost"))]}
              alt={`${condition} icon`}
              className="w-4 h-4 lg:w-6 lg:h-6 mr-1 bg-white rounded-full"
            />
          </li>
        );

      case "weaponReach":
        if (value === -1) {
          return (
            <li className="flex items-center" key={condition}>
              <p>Adjacent to opponent</p>
            </li>
          );
        } else {
          return null;
        }

      case "canMove":
        return (
          <li className="flex items-center" key={condition}>
            <p>
              Can move to
              <span className="condeffect lg:px-2 px-1">{value}</span>
              to one cell
            </p>
          </li>
        );

      default:
        null;
    }
  };

  const getEffect = (effect: string, value: number) => {
    switch (effect) {
      case "damage":
        return (
          <li>
            Damage your opponent for
            <span className="condeffect lg:px-2 px-1">{value}</span>
          </li>
        );
      case "gainEnergy":
        return (
          <li className="flex gap-1 justify-start">
            <p>
              Gain
              <span className="condeffect lg:px-2 px-1">{value}</span>
            </p>
            <img
              src={cardIcons[effect.slice(4).toLowerCase()]}
              alt={`${effect.slice(4)} cost`}
              className="relative bottom-1 w-4 h-4 lg:w-6 lg:h-6 bg-white rounded-full"
            />
          </li>
        );
      case "movement":
        return (
          <li className="flex gap-1">
            <p>
              Move {value > 0 ? "forward" : "back"} to
              <span className="condeffect lg:px-2 px-1">{value}</span>
              cell
            </p>
          </li>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        ref={(node) => {
          if (isDraggable()) {
            drag(node);
            drop(node);
          }
        }}
        className={`w-40 h-60 lg:w-48 lg:h-72 flex flex-col justify-between text-center text-xs lg:text-sm  bg-slate-500 border-4 border-black rounded-lg shadow-md select-none text-white ${
          isGrayed ? "cursor-not-allowed opacity-50" : "cursor-grab opacity-100"
        } ${isOver ? "border-green-500" : ""}`}
      >
        <header className="flex justify-between items-center p-1 bg-slate-900 min-h-[2rem] lg:min-h-[3rem] ">
          <h3 className="flex-grow text-xs lg:text-lg text-center truncate">
            {name}
          </h3>
        </header>

        <div className="flex flex-1 flex-col gap-1 m-1">
          <div className="flex flex-1  flex-col justify-center items-center overflow-hidden text-ellipsis px-1 py-2 h-12 lg:h-16 bg-green-900 bg-opacity-40 rounded">
            {effects.map((effect, index) => (
              <ul
                className="text-[10px]  lg:text-base leading-tight"
                key={index}
              >
                {getEffect(effect.type, effect.value)}
              </ul>
            ))}
          </div>
          {conditions && conditions.length > 0 && (
            <div className="flex flex-1  flex-col justify-center items-center overflow-hidden text-ellipsis px-1 py-2 h-12 lg:h-16 bg-red-900 bg-opacity-40 rounded">
              {conditions.map((condition, index) => (
                <ul
                  className="text-[10px]  lg:text-base leading-tight"
                  key={index}
                >
                  {getCondition(condition.type, condition.value)}
                </ul>
              ))}
            </div>
          )}
        </div>
      </div>
      <footer className="text-sm text-white">
        {context === "collection" && <p>x {quantity}</p>}
      </footer>
    </>
  );
}
