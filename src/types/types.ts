interface Stats {
  hp: number;
  atk: number;
  spd: number;
  mag: number;
  level: number;
  experience: number;
  xpMax: number;
  attributePoints: number;
}

export interface CardInterface {
  id: number;
  name: string;
  description: string;
  type: string;
  conditions: ConditionInterface[];
  effects: EffectsInterface[];
  isEquipped: boolean;
  context: "deck" | "collection" | "profile";
  quantity: number;
  slot?: number;
  dropToSwapEquippedCards?: (index1: number, index2: number) => void;
}

export interface VisualsInterface {
  skinColor: string;
  hairType: string;
  hairColor: string;
  eyesType: string;
  eyesColor: string;
  mouthType: string;
}

export interface ItemInterface {
  id: number;
  name: string;
  description: string;
  atk: number;
  hp: number;
  mag: number;
  spd: number;
  range: number;
  type: WeaponTypeInterface;
  slot: EquipmentSlotInterface;
}

type WeaponTypeInterface = "dagger" | "spear" | "sword" | "axe" | "staff";

export type EquipmentSlotInterface = "weapon" | "hands" | "feet" | "body";

export interface FighterInterface {
  id: number;
  name: string;
  visuals: VisualsInterface;
  stats: Stats;
  deck: CardInterface[];
  equipment: ItemInterface[];
}

export interface ProfileInterface {
  id: number;
  username: string;
  fighters: FighterInterface[];
  cardCollection: CardInterface[];
  equipmentCollection: ItemInterface[];
  currency: number;
}

export interface combatLogInterface {
  id: number;
  loserId: number;
  player1Id: number;
  player2Id: number;
  updatedAt: Date;
  winnerId: number;
  createdAt: Date;
  combatLog: JSON;
}

export interface AnimationState {
  prevAnimation: string;
  currentAnimation: string;
  id: number;
}

export interface EffectsInterface {
  value: number;
  type: string;
}

export interface ConditionInterface {
  value: number;
  type: string;
}

export interface CharacterCustomizationInterface {
  loading?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  fighterName?: string;
  onSubmit?: (fighterName: string) => void;
  setFighterName?: React.Dispatch<React.SetStateAction<string>>;
  skinColor: string;
  setSkinColor: React.Dispatch<React.SetStateAction<string>>;
  hairType: string;
  setHairType: React.Dispatch<React.SetStateAction<string>>;
  hairColor: string;
  setHairColor: React.Dispatch<React.SetStateAction<string>>;
  eyesType: string;
  setEyesType: React.Dispatch<React.SetStateAction<string>>;
  eyesColor: string;
  setEyesColor: React.Dispatch<React.SetStateAction<string>>;
  mouthType: string;
  setMouthType: React.Dispatch<React.SetStateAction<string>>;
}

export interface FighterState {
  fighter: FighterInterface;
  health: number;
  energy: string[];
  position: number;

  setHealth: React.Dispatch<React.SetStateAction<number>>;
  setEnergy: React.Dispatch<React.SetStateAction<string[]>>;
  setPosition: React.Dispatch<React.SetStateAction<number>>;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationState>>;
}
