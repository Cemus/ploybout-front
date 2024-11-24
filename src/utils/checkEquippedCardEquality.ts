import { CardInterface } from "../types/types";

const extractAttributes = (cards: CardInterface[]) => {
  return cards.map(({ slot, id }) => ({ slot, id }));
};

export const checkEquippedCardsEquality = (
  equippedCards: CardInterface[] | null,
  initialEquippedCards: CardInterface[] | null
): boolean => {
  if (!equippedCards || !initialEquippedCards) {
    return false;
  }

  const extractedCurrent = extractAttributes([...equippedCards]);
  const extractedInitial = extractAttributes([...initialEquippedCards]);

  const areEqual = (
    arr1: { slot: number | undefined; id: number }[],
    arr2: { slot: number | undefined; id: number }[]
  ) => {
    arr1.sort((a, b) => a.slot! - b.slot! || a.id - b.id);
    arr2.sort((a, b) => a.slot! - b.slot! || a.id - b.id);

    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.every(
      (item, index) =>
        item.slot === arr2[index].slot && item.id === arr2[index].id
    );
  };

  return areEqual(extractedCurrent, extractedInitial);
};
