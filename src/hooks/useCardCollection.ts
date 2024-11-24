import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import useExitSession from "../hooks/useExitSession";
import { useFighter } from "../hooks/useFighter";
import { useProfile } from "../hooks/useProfile";
import { useFn } from "../hooks/useFn";
import { CardInterface } from "../types/types";

export default function useCardCollection() {
  const exitSession = useExitSession();
  const { fetchProfile, profile } = useProfile();
  const stableFetchProfile = useFn(fetchProfile);
  const stableExitSession = useFn(exitSession);
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
    }
  }, [profile, selectedFighter, stableFetchProfile]);

  useEffect(() => {
    if (!selectedFighter || !profile) {
      return;
    }
    const fetchCardCollection = async () => {
      try {
        const collectionResponse = await axios.get("/api/owned-cards", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const collectionData = collectionResponse.data;
        console.log("cold", collectionData);
        setCollection(collectionData);

        const equippedCards = profile.fighters[0].deck;
        setEquippedCards(equippedCards);
        setInitialEquippedCards(equippedCards);
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

    fetchCardCollection();
  }, [selectedFighter, profile, stableFetchProfile, stableExitSession]);

  async function saveEquippedCards(equippedCards: CardInterface[]) {
    if (!selectedFighter || !profile) {
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const fighterId = selectedFighter.id;
      await axios.post(
        "/api/equipped-cards",
        { equippedCards, fighter_id: fighterId, user_id: profile.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInitialEquippedCards(JSON.parse(JSON.stringify(equippedCards)));
    } catch (error) {
      console.error("Error saving equipped cards", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDropToCollection = useCallback(
    (cardId: number, slot: number) => {
      console.log(cardId);
      console.log("eq", equippedCards);
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
            return [...prevCards, { ...cardToMove, quantity: newQuantity }];
          }
        }
        return prevCards;
      });
    },
    [equippedCards]
  );

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
          };
          return [...(prevEquippedCards || []), newEquippedCard];
        }
        return prevEquippedCards;
      });
    },
    [collection]
  );

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
