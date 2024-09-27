import { useEffect, useState } from "react";
import { useLocation /* useNavigate */ } from "react-router-dom";
import axios, { AxiosError } from "axios";
import useExitSession from "../../hooks/useExitSession";
import { Arena } from "./Arena";
import { useFn } from "../../hooks/useFn";
import HealthBars from "./HealthBars";
import { isFightReady, updateFighterStats } from "../../utils/combatUtils";
import { CardInterface, AnimationState } from "../../types/types";

interface CardSpecific {
  card: CardInterface;
}

interface CombatLog {
  card: CardSpecific;
  currentFighter: number;
  fighter1: { health: number; energy: string[]; position: number };
  fighter2: { health: number; energy: string[]; position: number };
  turn: number;
}

interface Fighter {
  id: number;
  health: number;
  energy: string[];
  position: number;
  animationState: AnimationState;
}

const Battlefield = () => {
  const location = useLocation();

  const exitSession = useExitSession();
  const stableExitSession = useFn(exitSession);

  const [playerFighter, setPlayerFighter] = useState({
    ...location.state?.player,
  });
  const [opponentFighter, setOpponentFighter] = useState({
    ...location.state?.opponent,
  });

  const [player, setPlayer] = useState<Fighter>({
    id: playerFighter.id,
    health: playerFighter.stats.hp,
    energy: [],
    animationState: { prevAnimation: "none", currentAnimation: "idle", id: 0 },
    position: -3,
  });

  const [opponent, setOpponent] = useState<Fighter>({
    id: opponentFighter.id,
    health: opponentFighter.stats.hp,
    energy: [],
    animationState: { prevAnimation: "none", currentAnimation: "idle", id: 0 },
    position: 3,
  });

  const [battleStarts, setBattleStarts] = useState<boolean>(false);
  const [battleEnds] = useState<boolean>(false);

  const [loader, setLoader] = useState<{
    playerIsReady: boolean;
    opponentIsReady: boolean;
  }>({ playerIsReady: false, opponentIsReady: false });

  const [battleLog, setBattleLog] = useState<CombatLog[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);

  const [endingPopUp, setEndingPopUp] = useState(false);

  //STATS

  useEffect(() => {
    if (playerFighter && opponentFighter) {
      const updatedPlayerFighter = updateFighterStats(playerFighter);
      const updatedOpponentFighter = updateFighterStats(opponentFighter);

      setPlayerFighter(updatedPlayerFighter);
      setOpponentFighter(updatedOpponentFighter);
    }
  }, []);

  //FETCH

  useEffect(() => {
    console.log("fetch");
    const fetchBattleResult = async () => {
      if (!playerFighter || !opponentFighter) {
        return;
      }
      console.log(playerFighter);
      console.log(opponentFighter);

      try {
        const response = await axios.post(
          "/api/combat-result/",
          { fighter1: playerFighter, fighter2: opponentFighter },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("fetch Ok");
        console.log(response.data.combat.combat_log);
        setBattleLog(response.data.combat.combat_log);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des cartes possédées ou équipées:",
          error
        );
        const e = error as AxiosError;
        const errorMessage = (e.response?.data as { error?: string }).error;
        console.log(errorMessage);
        if (e.response?.status === 401) {
          stableExitSession();
        }
      }
    };

    fetchBattleResult();
  }, [stableExitSession]);

  ///READY BATTLE
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isFightReady(loader)) {
        setBattleStarts(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [loader]);

  ///TURN MANAGER

  const triggerAnimation = async (
    cardType: string,
    isPlayer: boolean,
    logEntry: CombatLog
  ) => {
    return new Promise<void>((resolve) => {
      let animationDuration = 500;
      console.log("salut");
      console.log(cardType);
      switch (cardType) {
        case "attack":
          console.log("attaque");
          animationDuration = 500;
          if (isPlayer) {
            setPlayer((prevPlayer) => ({
              ...prevPlayer,
              animationState: {
                prevAnimation: prevPlayer.animationState.currentAnimation,
                currentAnimation: "attack",
                id: prevPlayer.animationState.id + 1,
              },
            }));
          } else {
            setOpponent((prevOpponent) => ({
              ...prevOpponent,
              animationState: {
                prevAnimation: prevOpponent.animationState.currentAnimation,
                currentAnimation: "attack",
                id: prevOpponent.animationState.id + 1,
              },
            }));
          }
          break;

        case "defense":
          animationDuration = 1000;
          if (isPlayer) {
            setPlayer((prevPlayer) => ({
              ...prevPlayer,
              animationState: {
                prevAnimation: prevPlayer.animationState.currentAnimation,
                currentAnimation: "defense",
                id: prevPlayer.animationState.id + 1,
              },
            }));
          } else {
            setOpponent((prevOpponent) => ({
              ...prevOpponent,
              animationState: {
                prevAnimation: prevOpponent.animationState.currentAnimation,
                currentAnimation: "defense",
                id: prevOpponent.animationState.id + 1,
              },
            }));
          }
          break;

        case "movement":
          animationDuration = 500;
          if (isPlayer) {
            setPlayer((prevPlayer) => ({
              ...prevPlayer,
              animationState: {
                prevAnimation: prevPlayer.animationState.currentAnimation,
                currentAnimation: "movement",
                id: prevPlayer.animationState.id + 1,
              },
            }));
          } else {
            setOpponent((prevOpponent) => ({
              ...prevOpponent,
              animationState: {
                prevAnimation: prevOpponent.animationState.currentAnimation,
                currentAnimation: "movement",
                id: prevOpponent.animationState.id + 1,
              },
            }));
          }
          break;

        case "resource":
          animationDuration = 500;
          if (isPlayer) {
            setPlayer((prevPlayer) => ({
              ...prevPlayer,
              animationState: {
                prevAnimation: prevPlayer.animationState.currentAnimation,
                currentAnimation: "cast",
                id: prevPlayer.animationState.id + 1,
              },
            }));
          } else {
            setOpponent((prevOpponent) => ({
              ...prevOpponent,
              animationState: {
                prevAnimation: prevOpponent.animationState.currentAnimation,
                currentAnimation: "cast",
                id: prevOpponent.animationState.id + 1,
              },
            }));
          }
          break;

        default:
          break;
      }

      setTimeout(() => {
        if (cardType === "attack") {
          isPlayer
            ? setOpponent((prevOpponent) => ({
                ...prevOpponent,
                animationState: {
                  prevAnimation: prevOpponent.animationState.currentAnimation,
                  currentAnimation: "hurt",
                  id: prevOpponent.animationState.id + 1,
                },
              }))
            : setPlayer((prevPlayer) => ({
                ...prevPlayer,
                animationState: {
                  prevAnimation: prevPlayer.animationState.currentAnimation,
                  currentAnimation: "hurt",
                  id: prevPlayer.animationState.id + 1,
                },
              }));
        }
        setPlayer((prevPlayer) => ({
          ...prevPlayer,
          health: logEntry.fighter1.health,
          energy: logEntry.fighter1.energy,
          position: logEntry.fighter1.position,
        }));
        setOpponent((prevOpponent) => ({
          ...prevOpponent,
          health: logEntry.fighter2.health,
          energy: logEntry.fighter2.energy,
          position: logEntry.fighter2.position,
        }));
        resolve();
      }, animationDuration);
    });
  };

  const resetToIdle = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setPlayer((prevPlayer) => ({
          ...prevPlayer,
          animationState: {
            prevAnimation: prevPlayer.animationState.currentAnimation,
            currentAnimation: "idle",
            id: prevPlayer.animationState.id + 1,
          },
        }));
        setOpponent((prevOpponent) => ({
          ...prevOpponent,
          animationState: {
            prevAnimation: prevOpponent.animationState.currentAnimation,
            currentAnimation: "idle",
            id: prevOpponent.animationState.id + 1,
          },
        }));
        resolve();
      }, 500);
    });
  };

  useEffect(() => {
    if (!battleLog || battleLog.length === 0 || !battleStarts) {
      return;
    }
    const executeTurn = async () => {
      const logEntry = battleLog[currentLogIndex];
      const card = logEntry.card;
      const cardType = card.card.type;

      await triggerAnimation(
        cardType,
        logEntry.currentFighter === player.id,
        logEntry
      );
      await resetToIdle();
      setTimeout(() => {
        if (currentLogIndex + 1 < battleLog.length)
          setCurrentLogIndex(currentLogIndex + 1);
      }, 1000);
    };

    executeTurn();
  }, [battleLog, battleStarts, currentLogIndex]);

  ///END BATTLE
  useEffect(() => {
    if (battleEnds) {
      setTimeout(() => {
        setEndingPopUp(true);
      }, 5000);
    }
  }, [battleEnds]);

  // AFTER BATTLE
  /*   const handleContinue = () => {
    navigate("/results", {
      state: {
        playerHealth,
        opponentHealth,
        serverBattleResult,
        playerFighter,
        opponentFighter,
      },
    });
  }; */
  return (
    <div className="flex-1 flex text-white text-2xl pb-24 md:pb-0">
      {endingPopUp ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <dialog open className="m-auto p-4 bg-white rounded shadow-lg">
            <button
              /*               onClick={handleContinue} */
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Continue
            </button>
          </dialog>
        </div>
      ) : (
        <>
          <div className="flex-1 flex flex-col justify-center">
            {battleStarts && (
              <HealthBars
                playerHealth={player.health}
                opponentHealth={opponent.health}
                playerFighter={playerFighter}
                opponentFighter={opponentFighter}
                turn={battleLog[currentLogIndex].turn}
                playerEnergy={player.energy}
                opponentEnergy={opponent.energy}
              />
            )}
            <Arena
              playerFighter={playerFighter}
              opponentFighter={opponentFighter}
              playerAnimationState={player.animationState}
              opponentAnimationState={opponent.animationState}
              setLoader={setLoader}
              playerPosition={player.position}
              opponentPosition={opponent.position}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Battlefield;
