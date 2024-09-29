import { FighterInterface } from "../../types/types";

interface HealthBarProps {
  playerHealth: number;
  opponentHealth: number;
  playerFighter: FighterInterface;
  opponentFighter: FighterInterface;
  playerEnergy: string[];
  opponentEnergy: string[];
  turn: number;
}

export default function HealthBars(props: HealthBarProps) {
  const hpBar = (isPlayer: boolean) => {
    let result: number = isPlayer
      ? (props.playerHealth * 100) / props.playerFighter.stats.hp
      : (props.opponentHealth * 100) / props.opponentFighter.stats.hp;

    if (result < 0) {
      result = 0;
    }
    return result;
  };

  const drawEnergy = (fighterEnergy: string[], maxEnergy: number = 5) => {
    const energyCircles = [];
    for (let i = 0; i < fighterEnergy.length; i++) {
      if (i <= maxEnergy) {
        energyCircles.push(
          <div
            key={i}
            className={`h-4 w-4 md:h-8  md:w-8 rounded-full bg-blue-500
            `}
          ></div>
        );
      }
    }
    if (energyCircles.length < maxEnergy) {
      for (let i = 0; i < maxEnergy; i++) {
        if (!energyCircles[i]) {
          energyCircles.push(
            <div
              key={i}
              className={`h-4 w-4 md:h-8  md:w-8  rounded-full bg-black
              `}
            ></div>
          );
        }
      }
    }
    return <div className="flex gap-1">{energyCircles}</div>;
  };

  return (
    <div className=" flex justify-between md:gap-48 items-center">
      <div className="flex flex-1 flex-col">
        {/*Health bar P1*/}
        <div className="relative w-full h-4 md:h-6 bg-gray-700">
          <div
            className="absolute left-0 top-0 h-full bg-red-500 transition-width duration-500 ease-out"
            style={{ width: `${hpBar(true)}%` }}
          ></div>
        </div>
        <label className="p-2">{props.playerFighter.name}</label>
        <div className="px-2 place-self-start ">
          {drawEnergy(props.playerEnergy)}
        </div>
      </div>

      <p className=" text-base md:text-lg ">Turn {props.turn} </p>

      <div className="flex flex-1 flex-col">
        {/*Health bar P2*/}
        <div className="relative w-full  h-4 md:h-6 bg-gray-700">
          <div
            className="absolute right-0 top-0 h-full bg-red-500 transition-width duration-500 ease-out"
            style={{ width: `${hpBar(false)}%` }}
          ></div>
        </div>
        <label className="place-self-end p-2">
          {props.opponentFighter.name}
        </label>
        <div className="px-2 place-self-end">
          {drawEnergy(props.opponentEnergy)}
        </div>
      </div>
    </div>
  );
}
