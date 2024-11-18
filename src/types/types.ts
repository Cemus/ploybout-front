interface Stats {
  hp: number;
  atk: number;
  vit: number;
  mag: number;
  level: number;
  experience: number;
  xpMax: number;
  attributePoints: number;
}

export interface DeckSlotInterface {
  id: number;
  card: CardInterface;
  card_id: number;
  slot: number;
  name: string;
  effects: EffectsInterface[];
  conditions: ConditionInterface[];
  type: string;
  description: string;
}

export interface VisualsInterface {
  skin_color: string;
  hair_type: string;
  hair_color: string;
  eyes_type: string;
  eyes_color: string;
  mouth_type: string;
}

export interface ItemInterface {
  id: number;
  name: string;
  description: string;
  atk: number;
  hp: number;
  mag: number;
  vit: number;
  range: number;
  type: WeaponTypeInterface;
  slot: EquipmentSlotInterface;
}

type WeaponTypeInterface = "dagger" | "spear" | "sword" | "axe" | "staff";

export type EquipmentSlotInterface = "weapon" | "hands" | "feet" | "body";

export interface EquipmentInterface {
  id: number;
  fighter_id: number;
  item_id: number;
  slot: EquipmentSlotInterface;
  item: ItemInterface;
  equipped: number;
  item_name: string;
}
export interface FighterInterface {
  id: number;
  name: string;
  visuals: VisualsInterface;
  stats: Stats;
  deck: DeckSlotInterface[];
  equipment: EquipmentInterface[];
}

export interface ProfileInterface {
  id: number;
  username: string;
  fighters: FighterInterface[];
}

export interface combatLogInterface {
  id: number;
  loser_id: number;
  player1_id: number;
  player2_id: number;
  updated_at: Date;
  winner_id: number;
  created_at: Date;
  combat_log: JSON;
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

export interface CardInterface {
  id: number;
  name: string;
  description: string;
  type: string;
  conditions: ConditionInterface[];
  effects: EffectsInterface[];
  isEquipped: boolean;
  quantity: number;
  context: "equipped" | "collection" | "profile";
  slot?: number;
  dropToSwapEquippedCards?: (index1: number, index2: number) => void;
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
