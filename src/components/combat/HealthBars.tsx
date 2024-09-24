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
            className={`h-8  w-8 rounded-full bg-blue-500
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
              className={`h-8  w-8 rounded-full bg-black
              `}
            ></div>
          );
        }
      }
    }
    return <div className="flex gap-1">{energyCircles}</div>;
  };

  return (
    <div className=" flex justify-between gap-48">
      <div className="flex w-1/2 flex-col">
        <div className="relative w-full h-6 bg-gray-700">
          <div
            className="absolute left-0 top-0 h-full bg-red-500 transition-width duration-500 ease-out"
            style={{ width: `${hpBar(true)}%` }}
          ></div>
        </div>
        <label className="p-2">{props.playerFighter.name}</label>
        <div className="place-self-center">
          {drawEnergy(props.playerEnergy)}
        </div>
      </div>
      <div>
        <p>TURN : {props.turn}</p>
      </div>
      <div className="flex w-1/2 flex-col">
        <div className="relative w-full h-6 bg-gray-700">
          <div
            className="absolute right-0 top-0 h-full bg-red-500 transition-width duration-500 ease-out"
            style={{ width: `${hpBar(false)}%` }}
          ></div>
        </div>
        <label className="place-self-end p-2">
          {props.opponentFighter.name}
        </label>
        <div className="place-self-center">
          {drawEnergy(props.opponentEnergy)}
        </div>
      </div>
    </div>
  );
}
