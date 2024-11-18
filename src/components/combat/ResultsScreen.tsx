import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { combatLogInterface, FighterInterface } from "../../types/types";

interface ResultsScreenProps {
  playerHealth: number;
  opponentHealth: number;
  serverBattleResult: combatLogInterface | null;
  playerFighter: FighterInterface;
  opponentFighter: FighterInterface;
}

export default function ResultsScreen() {
  const location = useLocation();
  const {
    playerHealth,
    opponentHealth,
    serverBattleResult,
    playerFighter,
    opponentFighter,
  } = location.state as ResultsScreenProps;

  const [winner, setWinner] = useState<number | undefined>(0);
  const [serverWinner, setServerWinner] = useState<number | undefined>(0);
  useEffect(() => {
    const getWinner = () => {
      if (playerHealth <= 0 || opponentHealth <= 0) {
        setWinner(
          playerHealth > opponentHealth ? playerFighter.id : opponentFighter.id
        );
        setServerWinner(serverBattleResult?.winner_id);
      }
    };
    getWinner();
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center">
      {winner === serverWinner ? (
        winner === playerFighter.id ? (
          <h1>You win!</h1>
        ) : (
          <h1>You lose!</h1>
        )
      ) : (
        <h1>CHEATED</h1>
      )}
    </div>
  );
}
