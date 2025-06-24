/* import seedrandom from "seedrandom";
 */
import {
  /*   AnimationState,
  CardInterface,
  ConditionInterface, */
  /*   EffectsInterface, */
  FighterInterface,
  /*   FighterState, */
} from "../types/types";

/* export const areConditionsMet = (
  condition: ConditionInterface,
  currentFighterState: FighterState,
  otherFighterState: FighterState
): boolean => {
  switch (condition.type) {
    case "weapon_reach":
      return isAtWeaponReach(
        currentFighterState.fighter,
        currentFighterState.position,
        otherFighterState.position
      );
    case "health_above":
      return currentFighterState.health > condition.value;
    case "health_below":
      return currentFighterState.health < condition.value;
    case "energy_above":
      return (
        currentFighterState.energy.filter((e) => {
          return e === "energy";
        }).length > condition.value
      );
    case "opponent_energy":
      return (
        otherFighterState.energy.filter((e) => {
          return e === "energy";
        }).length > condition.value
      );
    case "energy_cost":
      return (
        currentFighterState.energy.filter((e) => e === "energy").length >=
        condition.value
      );
    case "can_move":
      return canFighterMove(
        currentFighterState,
        otherFighterState,
        condition.value
      );
    default:
      return true;
  }
};

const canFighterMove = (
  currentFighterState: FighterState,
  otherFighterState: FighterState,
  distance: number
) => {
  const fighterPosition = currentFighterState.position;
  const opponentPosition = otherFighterState.position;
  const newPosition = fighterPosition + distance * 3;
  const respectAreaLimit = newPosition >= -9 && newPosition <= 9;

  if (!respectAreaLimit) {
    return false;
  }

  const fighterPositionIsSuperiorToOther = fighterPosition > opponentPosition;

  return fighterPositionIsSuperiorToOther
    ? !(newPosition <= opponentPosition)
    : !(newPosition >= opponentPosition);
};

export const getValidCard = (
  currentFighterState: FighterState,
  otherFighterState: FighterState
): CardInterface | null => {
  const sortedDeck = currentFighterState.fighter.deck.sort(
    (a, b) => a.slot - b.slot
  );

  return (
    sortedDeck.find((cardData) =>
      cardData.card.conditions.every((condition: ConditionInterface) =>
        areConditionsMet(condition, currentFighterState, otherFighterState)
      )
    )?.card ?? null
  );
};

const handleDamages = (
  effect: EffectsInterface,
  currentFighterState: FighterState,
  otherFighterState: FighterState,
  setBattleEnds: React.Dispatch<React.SetStateAction<boolean>>,
  seed: string
) => {
  currentFighterState.setAnimationState((prevAnim: AnimationState) => {
    return {
      prevAnimation: prevAnim.currentAnimation,
      currentAnimation: "attack",
      id: prevAnim.id + 1,
    };
  });
  const damages = calculateDamage(
    effect.value,
    currentFighterState.fighter,
    seed
  );
  const opponentHealthAfterAttack = otherFighterState.health - damages;
  if (opponentHealthAfterAttack <= 0) {
    setBattleEnds(true);
  }
  setTimeout(() => {
    otherFighterState.setHealth((prevHealth) => {
      return prevHealth - damages;
    });
    opponentHealthAfterAttack > 0
      ? otherFighterState.setAnimationState((prevAnim: AnimationState) => {
          return {
            prevAnimation: prevAnim.currentAnimation,
            currentAnimation: "hurt",
            id: prevAnim.id + 1,
          };
        })
      : otherFighterState.setAnimationState((prevAnim: AnimationState) => {
          return {
            prevAnimation: prevAnim.currentAnimation,
            currentAnimation: "defeat",
            id: prevAnim.id + 1,
          };
        });
  }, 500);
};

const isAtWeaponReach = (
  currentFighter: FighterInterface,
  currentFighterPosition: number,
  otherFighterPosition: number
): boolean => {
  let isCloseEnough = false;

  const distanceBetweenFighters = Math.abs(
    currentFighterPosition - otherFighterPosition
  );

  currentFighter.equipment.forEach((equip) => {
    if (equip.item.slot === "weapon") {
      if (distanceBetweenFighters <= equip.item.range * 3) {
        isCloseEnough = true;
      }
    }
  });

  return isCloseEnough;
};

export const applyCardEffects = (
  effect: EffectsInterface,
  currentFighterState: FighterState,
  otherFighterState: FighterState,
  setBattleEnds: React.Dispatch<React.SetStateAction<boolean>>,
  seed: string
) => {
  switch (effect.type) {
    case "damage":
      handleDamages(
        effect,
        currentFighterState,
        otherFighterState,
        setBattleEnds,
        seed
      );
      break;
    case "gain_energy":
      {
        const tempEnergy = [...currentFighterState.energy];
        const maxEnergy = 5;

        for (let i = 0; i < effect.value; i++) {
          if (tempEnergy.length <= maxEnergy) {
            tempEnergy.push("energy");
          } else {
            tempEnergy.shift();
            tempEnergy.push("energy");
          }
        }

        currentFighterState.setEnergy(tempEnergy);
        currentFighterState.setAnimationState((prevAnim: AnimationState) => {
          return {
            prevAnimation: prevAnim.currentAnimation,
            currentAnimation: "cast",
            id: prevAnim.id + 1,
          };
        });
      }
      break;
    case "energy_cost":
      {
        const tempEnergy = [...currentFighterState.energy];
        let remainingCost = effect.value;
        for (let i = 0; i < tempEnergy.length; i++) {
          if (remainingCost === 0) {
            break;
          } else {
            if (tempEnergy[i] === "energy") {
              remainingCost -= 1;
              tempEnergy.splice(i, 1);
              i--;
            }
          }
        }
        currentFighterState.setEnergy(tempEnergy);
      }
      break;
    case "movement":
      {
        const numberOfMovement = Math.abs(effect.value);
        let fighterPosition = currentFighterState.position;
        for (let i = 0; i < numberOfMovement; i++) {
          if (
            canFighterMove(
              currentFighterState,
              otherFighterState,
              Math.sign(effect.value)
            )
          ) {
            fighterPosition += effect.value * 3;
          }
        }
        currentFighterState.setPosition(fighterPosition);
      }
      break;
    case "health_cost":
      currentFighterState.setHealth((prev) => prev - effect.value);
      break;
    default:
      break;
  }
};

export const executeTurn = (
  currentFighterState: FighterState,
  otherFighterState: FighterState,
  setBattleEnds: React.Dispatch<React.SetStateAction<boolean>>,
  seed: string
) => {
  const fighterCard = getValidCard(currentFighterState, otherFighterState);
  fighterCard?.effects.forEach((effect: EffectsInterface) =>
    applyCardEffects(
      effect,
      currentFighterState,
      otherFighterState,
      setBattleEnds,
      seed
    )
  );
};

export const checkIfBattleEnds = (
  playerHealth: number,
  opponentHealth: number
) => {
  return playerHealth <= 0 || opponentHealth <= 0;
};

const calculateDamage = (
  cardDamage: number,
  fighter: FighterInterface,
  seed: string
) => {
  const rng = seedrandom(seed);
  const randomMultiplier = rng() * (1.125 - 0.875) + 0.875;
  const atk = fighter.stats.atk;
  const level = fighter.stats.level;

  return Math.floor(
    cardDamage * randomMultiplier * (1 + atk * ((level + atk) / 256))
  );
};

export const getTurnOrder = (
  playerFighter: FighterInterface,
  opponentFighter: FighterInterface,
  seed: string
) => {
  const calculateInitiative = (vit: number) => {
    const rng = seedrandom(seed);
    const randomMultiplier = rng() * (1.125 - 0.875) + 0.875;
    return Math.floor(vit * randomMultiplier);
  };

  const playerInitiative = calculateInitiative(playerFighter.stats.vit);
  const opponentInitiative = calculateInitiative(opponentFighter.stats.vit);

  return playerInitiative >= opponentInitiative
    ? { first: playerFighter, second: opponentFighter }
    : { first: opponentFighter, second: playerFighter };
}; */

export const isFightReady = (loader: {
  playerIsReady: boolean;
  opponentIsReady: boolean;
}) => {
  return loader.playerIsReady && loader.opponentIsReady;
};

export const updateFighterStats = (
  fighter: FighterInterface
): FighterInterface => {
  const updatedFighter = { ...fighter };
  updatedFighter.stats = { ...fighter.stats };

  for (const key in updatedFighter.equipment) {
    const element =
      updatedFighter.equipment[key as keyof typeof updatedFighter.equipment];
    if (element) {
      updatedFighter.stats.hp += element.hp;
      updatedFighter.stats.atk += element.atk;
      updatedFighter.stats.spd += element.spd;
      updatedFighter.stats.mag += element.mag;
      updatedFighter.stats.range += element.range - 1;
    }
  }
  return updatedFighter;
};
