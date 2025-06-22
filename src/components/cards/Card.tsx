import { useCallback, useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import cardIcons from "../../utils/cardIcons";
import { useDrop } from "react-dnd";
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
              className="w-6 h-6 mr-1 bg-white rounded-full"
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
          <div className="flex gap-1">
            <p>
              Gain<span className="font-bold text-green-300"> {value}</span>
            </p>
            <img
              src={cardIcons[effect.slice(4, effect.length).toLowerCase()]}
              alt={`${effect.slice(4, effect.length)} cost`}
              className="w-6 h-6 mr-1 bg-white rounded-full"
            />
          </div>
        );
      case "movement":
        return (
          <div className="flex gap-1">
            <p>
              Move {value > 0 ? "forward" : "back"} to
              <span className="font-bold text-green-300"> {value}</span>
            </p>{" "}
            cell
          </div>
        );
      default:
        return null;
    }
  };
  useEffect(() => {
    if (isEquipped && context === "collection") {
      quantity <= 0 ? setIsGrayed(true) : setIsGrayed(false);
    }
    if (isDraggable()) {
      isDragging ? setIsGrayed(true) : setIsGrayed(false);
    }
  }, [setIsGrayed, isDragging, isDraggable, quantity, isEquipped, context]);
  return (
    <div
      ref={(node) => {
        if (isDraggable()) {
          drag(node);
          drop(node);
        }
      }}
      className={`flex flex-col items-center justify-between text-center text-xs w-24 h-32 lg:text-base lg:w-48 lg:h-72 bg-slate-500 border-4 border-black rounded-lg shadow-black shadow-2xl p-2 text-white select-none ${
        isGrayed ? "cursor-not-allowed" : "cursor-grab"
      }  ${isGrayed ? "opacity-50" : "opacity-100"} ${
        isOver && "border-green-500"
      }  `}
    >
      <header className="flex w-full justify-between items-center p-2 bg-slate-900 min-h-8 lg:min-h-16 text-white font-semibold rounded-lg ">
        <div className="flex items-center">{getCost()}</div>
        <h3 className="flex-grow text-xs md:text-xl text-center">{name}</h3>
      </header>

      <div className="flex flex-col h-1/3 bg-slate-900 bg-opacity-50 w-full justify-center items-center rounded-sm">
        {effects.map((effect, index) => (
          <div className="flex" key={index}>
            {getEffect(effect.type, effect.value)}
          </div>
        ))}
      </div>
      <footer>
        {context === "collection" && (
          <p className="md:text-xl text-white">x {quantity}</p>
        )}
      </footer>
    </div>
  );
}
