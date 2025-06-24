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

  const getCost = () => {
    return conditions.map((condition) => {
      if (condition.type.includes("_cost")) {
        return (
          <div className="flex items-center" key={condition.type}>
            <img
              src={
                cardIcons[
                  condition.type.slice(0, condition.type.indexOf("_cost"))
                ]
              }
              alt={`${condition.type} icon`}
              className="w-4 h-4 lg:w-6 lg:h-6 mr-1 bg-white rounded-full"
            />
            <span>{condition.value}</span>
          </div>
        );
      }
      return null;
    });
  };

  const getEffect = (effect: string, value: number) => {
    switch (effect) {
      case "damage":
        return (
          <span>
            Damage your opponent for{" "}
            <span className="font-bold text-green-300">{value}</span>
          </span>
        );
      case "gainEnergy":
        return (
          <div className="flex gap-1 justify-start">
            <p>
              Gain<span className="font-bold text-green-300"> {value}</span>
            </p>
            <img
              src={cardIcons[effect.slice(4).toLowerCase()]}
              alt={`${effect.slice(4)} cost`}
              className="relative bottom-1 w-4 h-4 lg:w-6 lg:h-6 bg-white rounded-full"
            />
          </div>
        );
      case "movement":
        return (
          <div className="flex gap-1">
            <p>
              Move {value > 0 ? "forward" : "back"} to
              <span className="font-bold text-green-300"> {value}&nbsp;</span>
              cell
            </p>
          </div>
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
        className={`w-40 h-60 lg:w-48 lg:h-72 flex flex-col justify-between text-center text-xs lg:text-sm p-2 bg-slate-500 border-4 border-black rounded-lg shadow-md select-none text-white ${
          isGrayed ? "cursor-not-allowed opacity-50" : "cursor-grab opacity-100"
        } ${isOver ? "border-green-500" : ""}`}
      >
        <header className="flex justify-between items-center p-1 bg-slate-900 min-h-[2rem] lg:min-h-[3rem] rounded-md">
          <div className="flex items-center gap-1">{getCost()}</div>
          <h3 className="flex-grow text-xs lg:text-lg text-center truncate">
            {name}
          </h3>
        </header>

        <div className="flex flex-col justify-center items-center overflow-hidden text-ellipsis px-1 py-2 h-24 lg:h-28 bg-slate-800 bg-opacity-40 rounded">
          {effects.map((effect, index) => (
            <div className="text-[10px] lg:text-base leading-tight" key={index}>
              {getEffect(effect.type, effect.value)}
            </div>
          ))}
        </div>
      </div>
      <footer className="text-sm text-white">
        {context === "collection" && <p>x {quantity}</p>}
      </footer>
    </>
  );
}
