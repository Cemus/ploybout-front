import {
  FighterInterface,
  DeckSlotInterface,
  EquipmentInterface,
} from "../types/types";

export default function fighterDataOptimized(fighters: FighterInterface[]) {
  return fighters.map((fighter: FighterInterface) => {
    const visuals =
      Array.isArray(fighter.visuals) && fighter.visuals.length > 0
        ? fighter.visuals[0]
        : null;

    const stats =
      Array.isArray(fighter.stats) && fighter.stats.length > 0
        ? fighter.stats[0]
        : null;

    const decks = Array.isArray(fighter.decks)
      ? fighter.decks
      : Object.values(fighter.decks);

    const equipments = Array.isArray(fighter.equipments)
      ? fighter.equipments
      : Object.values(fighter.equipments);

    return {
      ...fighter,
      visuals: {
        skinColor: visuals?.skin_color ?? "",
        hairType: visuals?.hair_type ?? "",
        hairColor: visuals?.hair_color ?? "",
        eyesType: visuals?.eyes_type ?? "",
        eyesColor: visuals?.eyes_color ?? "",
        mouthType: visuals?.mouth_type ?? "",
      },
      stats: {
        hp: stats?.hp ?? 0,
        atk: stats?.atk ?? 0,
        vit: stats?.vit ?? 0,
        mag: stats?.mag ?? 0,
        level: stats?.level ?? 0,
        experience: stats?.experience ?? 0,
        xpMax: stats?.xp_max ?? 0,
        attributePoints: stats?.attribute_points ?? 0,
      },
      equipments: equipments as EquipmentInterface[],
      decks: decks as DeckSlotInterface[],
    };
  });
}
