import { FighterInterface } from "../../types/types";

interface HealthBarProps {
  playerHealth?: number;
  opponentHealth?: number;
  playerFighter?: FighterInterface;
  opponentFighter?: FighterInterface;
  playerEnergy?: string[];
  opponentEnergy?: string[];
  turn?: number;
}

export default function HealthBars({
  playerHealth = 100,
  opponentHealth = 100,
  playerFighter,
  opponentFighter,
  playerEnergy = [],
  opponentEnergy = [],
  turn = 0,
}: HealthBarProps) {
  const hpBar = (isPlayer: boolean) => {
    if (!playerFighter || !opponentFighter) return 50;
    const maxHp = isPlayer ? playerFighter.stats.hp : opponentFighter.stats.hp;
    const currentHp = isPlayer ? playerHealth : opponentHealth;

    let result = (currentHp * 100) / maxHp;
    if (result < 0) result = 0;
    return result;
  };

  const drawEnergy = (fighterEnergy: string[], maxEnergy: number = 5) => {
    if (!playerFighter || !opponentFighter) {
      return (
        <div className="flex gap-1 animate-pulse">
          {[...Array(maxEnergy)].map((_, i) => (
            <div
              key={i}
              className="h-4 w-4 md:h-8 md:w-8 rounded-full bg-gray-400"
            ></div>
          ))}
        </div>
      );
    }

    const energyCircles = [];
    for (let i = 0; i < fighterEnergy.length; i++) {
      if (i < maxEnergy) {
        energyCircles.push(
          <div
            key={i}
            className="h-4 w-4 md:h-8 md:w-8 rounded-full bg-blue-500"
          ></div>
        );
      }
    }
    if (energyCircles.length < maxEnergy) {
      for (let i = energyCircles.length; i < maxEnergy; i++) {
        energyCircles.push(
          <div
            key={i}
            className="h-4 w-4 md:h-8 md:w-8 rounded-full bg-black"
          ></div>
        );
      }
    }
    return <div className="flex gap-1">{energyCircles}</div>;
  };

  return (
    <div className="flex justify-between md:gap-48 items-center select-none">
      <div className="flex flex-1 flex-col">
        {/* Health bar P1 */}
        <div className="relative w-full h-4 md:h-6 bg-gray-700 rounded overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full rounded transition-width duration-500 ease-out ${
              playerFighter ? "bg-red-500" : "bg-gray-400 animate-pulse"
            }`}
            style={{ width: `${hpBar(true)}%` }}
          ></div>
        </div>
        <label className="p-2 font-logo">
          {playerFighter ? playerFighter.name : "Loading..."}
        </label>
        <div className="px-2 place-self-start">{drawEnergy(playerEnergy)}</div>
      </div>

      <p className="text-base text-center md:text-2xl font-logo">
        Turn <span className="text-lg md:text-4xl">{turn + 1}</span>
      </p>

      <div className="flex flex-1 flex-col">
        {/* Health bar P2 */}
        <div className="relative w-full h-4 md:h-6 bg-gray-700 rounded overflow-hidden">
          <div
            className={`absolute right-0 top-0 h-full rounded transition-width duration-500 ease-out ${
              opponentFighter ? "bg-red-500" : "bg-gray-400 animate-pulse"
            }`}
            style={{ width: `${hpBar(false)}%` }}
          ></div>
        </div>
        <label className="place-self-end p-2 font-logo">
          {opponentFighter ? opponentFighter.name : "Loading..."}
        </label>
        <div className="px-2 place-self-end">{drawEnergy(opponentEnergy)}</div>
      </div>
    </div>
  );
}
