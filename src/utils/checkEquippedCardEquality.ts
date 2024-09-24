interface EquippedCardProps {
  slot: number;
  card_id: number;
}

const extractAttributes = (cards: EquippedCardProps[]) => {
  return cards.map(({ slot, card_id }) => ({ slot, card_id }));
};

export const checkEquippedCardsEquality = (
  equippedCards: EquippedCardProps[] | null,
  initialEquippedCards: EquippedCardProps[] | null
): boolean => {
  if (!equippedCards || !initialEquippedCards) {
    return false;
  }

  const extractedCurrent = extractAttributes([...equippedCards]);
  const extractedInitial = extractAttributes([...initialEquippedCards]);

  const areEqual = (
    arr1: { slot: number; card_id: number }[],
    arr2: { slot: number; card_id: number }[]
  ) => {
    arr1.sort((a, b) => a.slot - b.slot || a.card_id - b.card_id);
    arr2.sort((a, b) => a.slot - b.slot || a.card_id - b.card_id);

    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.every(
      (item, index) =>
        item.slot === arr2[index].slot && item.card_id === arr2[index].card_id
    );
  };

  return areEqual(extractedCurrent, extractedInitial);
};
