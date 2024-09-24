import { useEffect, useState } from "react";
import { FighterInterface } from "../../types/types";
import { updateFighterStats } from "../../utils/combatUtils";
import CharacterCanvas from "../character/CharacterCanvas";

interface OpponentDetailProps {
  fighter: FighterInterface;
  handleFightOpponent: (fighter: FighterInterface) => void;
}

export default function OpponentDetail({
  fighter,
  handleFightOpponent,
}: OpponentDetailProps) {
  const [fighterStatsUpdated, setFighterStatsUpdated] =
    useState<FighterInterface | null>(null);

  useEffect(() => {
    if (!fighterStatsUpdated) {
      const fighterCopy = JSON.parse(JSON.stringify(fighter));
      setFighterStatsUpdated(updateFighterStats(fighterCopy));
    }
  }, [fighterStatsUpdated, fighter]);

  return (
    <li className="flex flex-col items-center  justify-center text-white  p-4  w-[24rem] select-none">
      <div className="relative top-4 flex items-baseline  justify-center gap-1  bg-white text-slate-700  w-full rounded-lg  text-center">
        <h3 className="font-bold text-xl">{fighter.name}</h3>
        <p className=" text-sm">
          (
          <span title="Battle rank" className=" cursor-help text-sm ">
            Level
          </span>{" "}
          {fighter.stats.level})
        </p>
      </div>
      <div className="flex flex-row bg-slate-700 p-2 rounded-lg items-center justify-between w-full  ">
        <div className="p-2 h-auto rounded-lg w-1/2 border-4 border-black bg-gradient-to-tr from-black">
          <CharacterCanvas fighter={fighter} shot="full" />
        </div>
        <div className="flex flex-col items-center justify-around w-1/2">
          <ul>
            {fighterStatsUpdated && (
              <>
                <li>HP : {fighterStatsUpdated.stats.hp}</li>
                <li>STR : {fighterStatsUpdated.stats.atk}</li>
                <li>VIT : {fighterStatsUpdated.stats.vit}</li>
                <li>WIS : {fighterStatsUpdated.stats.mag}</li>
              </>
            )}
          </ul>
        </div>
      </div>
      <button
        onClick={() => {
          handleFightOpponent(fighter);
        }}
        className="relative  bottom-6 text-center bg-green-700 w-2/3 p-2 rounded-lg hover:bg-green-500"
      >
        Fight <span className="text-lg font-bold">{fighter.name}</span>!
      </button>
    </li>
  );
}
