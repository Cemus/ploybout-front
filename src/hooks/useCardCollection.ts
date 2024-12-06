import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { useFighter } from "../hooks/useFighter";
import { useProfile } from "../hooks/useProfile";
import { useFn } from "../hooks/useFn";
import { CardInterface } from "../types/types";

export default function useCardCollection() {
  const { fetchProfile, profile } = useProfile();
  const stableFetchProfile = useFn(fetchProfile);
  const { selectedFighter } = useFighter();
  const [collection, setCollection] = useState<CardInterface[]>([]);
  const [initialEquippedCards, setInitialEquippedCards] = useState<
    CardInterface[] | null
  >(null);
  const [equippedCards, setEquippedCards] = useState<CardInterface[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedFighter || !profile) {
      stableFetchProfile();
      return;
    }
  }, [profile, selectedFighter, stableFetchProfile]);

  useEffect(() => {
    if (!selectedFighter || !profile) {
      return;
    }
    setCollection(profile.cardCollection);

    const equippedCardsCopy = JSON.parse(
      JSON.stringify(profile.fighters[0].deck)
    );
    setEquippedCards(equippedCardsCopy);

    if (initialEquippedCards === null) {
      setInitialEquippedCards(equippedCardsCopy);
    }
  }, [selectedFighter, profile]);

  /**
   * * DROP to COLLECTION
   */
  const handleDropToCollection = useCallback(
    (cardId: number, slot: number) => {
      setEquippedCards((prevEquippedCards) => {
        const updatedEquippedCards = (prevEquippedCards || []).filter(
          (c) => !(c.id === cardId && c.slot === slot)
        );
        return updatedEquippedCards;
      });

      setCollection((prevCards) => {
        const existingCardIndex = prevCards.findIndex(
          (card) => card.id === cardId
        );

        if (existingCardIndex !== -1) {
          const updatedCards = [...prevCards];
          updatedCards[existingCardIndex].quantity = Math.max(
            updatedCards[existingCardIndex].quantity + 1,
            0
          );
          return updatedCards;
        } else {
          const cardToMove = equippedCards?.find(
            (c) => c.id === cardId && c.slot === slot
          );
          if (cardToMove) {
            const newQuantity = cardToMove.quantity - 1;
            return [
              ...prevCards,
              { ...cardToMove, quantity: newQuantity, context: "collection" },
            ];
          }
        }
        return prevCards;
      });
    },
    [equippedCards]
  );

  /**
   * * DROP to DECK
   */
  const handleDropToEquipped = useCallback(
    (cardId: number, slot: number) => {
      setCollection((prevCards) => {
        const existingCardIndex = prevCards.findIndex(
          (card) => card.id === cardId
        );
        if (existingCardIndex !== -1) {
          const updatedCards = [...prevCards];
          if (updatedCards[existingCardIndex].quantity > 1) {
            updatedCards[existingCardIndex].quantity = Math.max(
              updatedCards[existingCardIndex].quantity - 1,
              0
            );
            return updatedCards;
          } else {
            updatedCards[existingCardIndex].quantity = 0;
          }
        }
        return prevCards;
      });

      setEquippedCards((prevEquippedCards) => {
        const cardToMove = collection.find((card) => card.id === cardId);
        if (cardToMove) {
          const newEquippedCard: CardInterface = {
            ...cardToMove,
            slot: slot,
            context: "deck",
          };
          return [...(prevEquippedCards || []), newEquippedCard];
        }
        return prevEquippedCards;
      });
    },
    [collection]
  );

  /**
   * * SWAP cards
   */
  const handleEquippedCardSwap = useCallback((slot1: number, slot2: number) => {
    setEquippedCards((prevEquippedCards) => {
      if (!prevEquippedCards) return [];

      const updatedCards = [...prevEquippedCards];
      const card1Index = updatedCards.findIndex((card) => card.slot === slot1);
      const card2Index = updatedCards.findIndex((card) => card.slot === slot2);

      if (card1Index !== -1 && card2Index !== -1) {
        const temp = updatedCards[card1Index].slot;
        updatedCards[card1Index].slot = updatedCards[card2Index].slot;
        updatedCards[card2Index].slot = temp;
      } else if (card1Index !== -1) {
        updatedCards[card1Index].slot = slot2;
      }

      return updatedCards;
    });
  }, []);

  /**
   * * POST cards
   * @param equippedCards
   * @returns
   */
  async function saveEquippedCards(equippedCards: CardInterface[]) {
    if (!selectedFighter || !profile) {
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const fighterId = selectedFighter.id;
      const postResponse = await axios.post(
        "/api/update-cards",
        {
          collection,
          equippedCards,
          fighter_id: fighterId,
          user_id: profile.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (postResponse.status === 200) {
        setInitialEquippedCards(JSON.parse(JSON.stringify(equippedCards)));
      }
    } catch (error) {
      const errorMessage = error as AxiosError;
      console.error("Error saving equipped cards :", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return {
    collection,
    equippedCards,
    initialEquippedCards,
    loading,
    handleDropToCollection,
    handleDropToEquipped,
    handleEquippedCardSwap,
    saveEquippedCards,
  };
}
