/* Unused

import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import useExitSession from "../../hooks/useExitSession";
import { Arena } from "./Arena";
import { useFn } from "../../hooks/useFn";
import HealthBars from "./HealthBars";
import {
  executeTurn,
  getTurnOrder,
  isFightReady,
  checkIfBattleEnds,
  updateFighterStats,
} from "../../utils/combatUtils";
import {
  AnimationState,
  combatLogInterface,
  FighterInterface,
  FighterState,
} from "../../types/types";

const Battlefield = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const exitSession = useExitSession();
  const stableExitSession = useFn(exitSession);

  const [playerFighter, setPlayerFighter] = useState(location.state?.player);
  const [opponentFighter, setOpponentFighter] = useState(
    location.state?.opponent
  );
  useEffect(() => {
    if (playerFighter && opponentFighter) {
      const updatedPlayerFighter = updateFighterStats(playerFighter);
      const updatedOpponentFighter = updateFighterStats(opponentFighter);

      setPlayerFighter(updatedPlayerFighter);
      setOpponentFighter(updatedOpponentFighter);
    }
  }, []);

  const [battleStarts, setBattleStarts] = useState<boolean>(false);
  const [battleEnds, setBattleEnds] = useState<boolean>(false);
  const [loader, setLoader] = useState<{
    playerIsReady: boolean;
    opponentIsReady: boolean;
  }>({ playerIsReady: false, opponentIsReady: false });
  const [playerHealth, setPlayerHealth] = useState<number>(
    playerFighter.stats.hp
  );

  const [playerPosition, setPlayerPosition] = useState<number>(-3);
  const playerPositionRef = useRef<number>(playerPosition);

  const [opponentPosition, setOpponentPosition] = useState<number>(3);
  const opponentPositionRef = useRef<number>(opponentPosition);

  useEffect(() => {
    playerPositionRef.current = playerPosition;
    opponentPositionRef.current = opponentPosition;
  }, [playerPosition, opponentPosition]);

  const [opponentHealth, setOpponentHealth] = useState<number>(
    opponentFighter.stats.hp
  );

  const playerHealthRef = useRef(playerHealth);
  const opponentHealthRef = useRef(opponentHealth);
  console.log(playerHealth);
  console.log(opponentHealth);
  const [playerEnergy, setPlayerEnergy] = useState<string[]>([]);
  const [opponentEnergy, setOpponentEnergy] = useState<string[]>([]);
  const [turn, setTurn] = useState(0);
  const [serverBattleResult, setServerBattleResult] =
    useState<combatLogInterface | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [playerAnimationState, setPlayerAnimationState] =
    useState<AnimationState>({
      prevAnimation: "none",
      currentAnimation: "idle",
      id: 0,
    });
  const [opponentAnimationState, setOpponentAnimationState] =
    useState<AnimationState>({
      prevAnimation: "none",
      currentAnimation: "idle",
      id: 0,
    });
  const [endingPopUp, setEndingPopUp] = useState(false);
  const stableExecuteTurn = useFn(executeTurn);
  const [randomSeed, setRandomSeed] = useState<string | null>(null);

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
        setServerBattleResult(response.data.combat);
        setRandomSeed(response.data.combat.seed);
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

  useEffect(() => {
    playerHealthRef.current = playerHealth;
    opponentHealthRef.current = opponentHealth;
  }, [playerHealth, opponentHealth]);

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
  useEffect(() => {
    const executeTurns = async () => {
      if (battleStarts && !isExecuting && !battleEnds) {
        const newSeed = `${randomSeed}-${turn}`;
        console.log("new seed", newSeed);
        const { first, second } = getTurnOrder(
          playerFighter,
          opponentFighter,
          newSeed
        );
        console.log("before pos", playerPosition);

        await executeTurnAction(first, newSeed);
        console.log("first");
        console.log("player pos", playerPosition);
        await executeTurnAction(second, newSeed);
        console.log("second");
        console.log("player pos", playerPosition);

        if (
          !checkIfBattleEnds(
            playerHealthRef.current,
            opponentHealthRef.current
          ) &&
          !isExecuting
        )
          setTurn((prevTurn) => prevTurn + 1);
      }
    };

    executeTurns();
  }, [turn, battleStarts, randomSeed]);

  useEffect(() => {
    playerPositionRef.current = playerPosition;
    console.log("REF !", playerPosition);
  }, [playerPosition]);
  //EXECUTE ACTION

  const executeTurnAction = async (
    fighterTurn: FighterInterface,
    seed: string
  ) => {
    if (
      !checkIfBattleEnds(playerHealthRef.current, opponentHealthRef.current) &&
      !isExecuting
    ) {
      setIsExecuting(true);

      const isPlayer = playerFighter === fighterTurn;
      const currentPosition = isPlayer
        ? playerPositionRef.current
        : opponentPosition;
      const setPosition = isPlayer ? setPlayerPosition : setOpponentPosition;
      const othersPosition = isPlayer
        ? opponentPosition
        : playerPositionRef.current;
      const setOthersPosition = isPlayer
        ? setOpponentPosition
        : setPlayerPosition;
      const othersFighter = isPlayer ? opponentFighter : playerFighter;
      const currentHealth = isPlayer ? playerHealth : opponentHealth;
      const setHealth = isPlayer ? setPlayerHealth : setOpponentHealth;
      const currentEnergy = isPlayer ? playerEnergy : opponentEnergy;
      const setEnergy = isPlayer ? setPlayerEnergy : setOpponentEnergy;
      const othersHealth = isPlayer ? opponentHealth : playerHealth;
      const setOthersHealth = isPlayer ? setOpponentHealth : setPlayerHealth;
      const othersEnergy = isPlayer ? opponentEnergy : playerEnergy;
      const setOthersEnergy = isPlayer ? setOpponentEnergy : setPlayerEnergy;
      const setAnimationState = isPlayer
        ? setPlayerAnimationState
        : setOpponentAnimationState;
      const setOthersAnimationState = isPlayer
        ? setOpponentAnimationState
        : setPlayerAnimationState;

      const currentFighterState: FighterState = {
        fighter: fighterTurn,
        health: currentHealth,
        energy: currentEnergy,
        position: currentPosition,
        setHealth: setHealth,
        setEnergy: setEnergy,
        setPosition: setPosition,
        setAnimationState: setAnimationState,
      };

      const otherFighterState: FighterState = {
        fighter: othersFighter,
        health: othersHealth,
        energy: othersEnergy,
        position: othersPosition,
        setHealth: setOthersHealth,
        setEnergy: setOthersEnergy,
        setPosition: setOthersPosition,
        setAnimationState: setOthersAnimationState,
      };

      await new Promise<void>((resolve) => {
        stableExecuteTurn(
          currentFighterState,
          otherFighterState,
          setBattleEnds,
          seed
        );

        setTimeout(() => {
          if (
            !checkIfBattleEnds(
              playerHealthRef.current,
              opponentHealthRef.current
            )
          ) {
            setPlayerAnimationState((prevAnim) => {
              return {
                prevAnimation: prevAnim.currentAnimation,
                currentAnimation: "idle",
                id: prevAnim.id + 1,
              };
            });

            setOpponentAnimationState((prevAnim) => {
              return {
                prevAnimation: prevAnim.currentAnimation,
                currentAnimation: "idle",
                id: prevAnim.id + 1,
              };
            });
            setIsExecuting(false);
            resolve();
          }
        }, 1000);
      });
    } else {
      setBattleEnds(true);
    }
  };

  ///END BATTLE
  useEffect(() => {
    if (battleEnds) {
      setTimeout(() => {
        setEndingPopUp(true);
      }, 5000);
    }
  }, [battleEnds]);

  // AFTER BATTLE
  const handleContinue = () => {
    navigate("/results", {
      state: {
        playerHealth,
        opponentHealth,
        serverBattleResult,
        playerFighter,
        opponentFighter,
      },
    });
  };
  return (
    <div className="flex-1 flex text-white text-2xl">
      {endingPopUp ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <dialog open className="m-auto p-4 bg-white rounded shadow-lg">
            <button
              onClick={handleContinue}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Continue
            </button>
          </dialog>
        </div>
      ) : (
        <>
          <div className="flex-1 flex flex-col justify-center">
            <HealthBars
              playerHealth={playerHealth}
              opponentHealth={opponentHealth}
              playerFighter={playerFighter}
              opponentFighter={opponentFighter}
              setTurn={setTurn}
              turn={turn}
              playerEnergy={playerEnergy}
              opponentEnergy={opponentEnergy}
            />
            <Arena
              playerFighter={playerFighter}
              opponentFighter={opponentFighter}
              playerAnimationState={playerAnimationState}
              opponentAnimationState={opponentAnimationState}
              setLoader={setLoader}
              playerPosition={playerPosition}
              opponentPosition={opponentPosition}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Battlefield;

*/
