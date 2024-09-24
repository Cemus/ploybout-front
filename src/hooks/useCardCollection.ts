import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import useExitSession from "../hooks/useExitSession";
import { useFighter } from "../hooks/useFighter";
import { useProfile } from "../hooks/useProfile";
import { useFn } from "../hooks/useFn";
import { CardInterface, DeckSlotInterface } from "../types/types";

interface Data {
  card: CardInterface;
  card_id: number;
  equipped: 0 | 1;
}

export default function useCardCollection() {
  const exitSession = useExitSession();
  const { fetchProfile, profile } = useProfile();
  const stableFetchProfile = useFn(fetchProfile);
  const stableExitSession = useFn(exitSession);
  const { selectedFighter } = useFighter();
  const [cards, setCards] = useState<CardInterface[]>([]);
  const [initialEquippedCards, setInitialEquippedCards] = useState<
    DeckSlotInterface[] | null
  >(null);
  const [equippedCards, setEquippedCards] = useState<
    DeckSlotInterface[] | null
  >(null);
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
        const ownedCardsResponse = await axios.get("/api/owned-cards", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const cardsData = processCardData(ownedCardsResponse.data);
        const uniqueCardsData = Object.values(cardsData) as CardInterface[];

        const equippedCardsResponse = await axios.get(
          `/api/equipped-cards/${selectedFighter?.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const formattedEquippedCards = formatEquippedCards(
          equippedCardsResponse.data,
          uniqueCardsData
        );

        setCards(uniqueCardsData);
        setEquippedCards(formattedEquippedCards);
        setInitialEquippedCards(
          JSON.parse(JSON.stringify(formattedEquippedCards))
        );
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

  async function saveEquippedCards(equippedCards: DeckSlotInterface[]) {
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
      setEquippedCards((prevEquippedCards) => {
        const updatedEquippedCards = (prevEquippedCards || []).filter(
          (c) => !(c.card.id === cardId && c.slot === slot)
        );
        return updatedEquippedCards;
      });

      setCards((prevCards) => {
        const existingCardIndex = prevCards.findIndex(
          (card) => card.id === cardId
        );

        if (existingCardIndex !== -1) {
          const updatedCards = [...prevCards];
          updatedCards[existingCardIndex].quantity = Math.max(
            updatedCards[existingCardIndex].quantity! + 1,
            0
          );
          return updatedCards;
        } else {
          const cardToMove = equippedCards?.find(
            (c) => c.card.id === cardId && c.slot === slot
          )?.card;
          if (cardToMove) {
            return [
              ...prevCards,
              { ...cardToMove, isEquipped: false, quantity: 1 },
            ];
          }
        }
        return prevCards;
      });
    },
    [equippedCards]
  );

  const handleDropToEquipped = useCallback(
    (cardId: number, slot: number) => {
      setCards((prevCards) => {
        const existingCardIndex = prevCards.findIndex(
          (card) => card.id === cardId
        );
        if (existingCardIndex !== -1) {
          const updatedCards = [...prevCards];
          if (updatedCards[existingCardIndex].quantity! > 1) {
            updatedCards[existingCardIndex].quantity = Math.max(
              updatedCards[existingCardIndex].quantity! - 1,
              0
            );
            return updatedCards;
          } else {
            updatedCards[existingCardIndex].quantity! = 0;
          }
        }
        return prevCards;
      });

      setEquippedCards((prevEquippedCards) => {
        const cardToMove = cards.find((card) => card.id === cardId);
        if (cardToMove) {
          const newEquippedCard: DeckSlotInterface = {
            slot: slot,
            card_id: cardToMove.id,
            card: { ...cardToMove, isEquipped: true },
          };
          return [...(prevEquippedCards || []), newEquippedCard];
        }
        return prevEquippedCards;
      });
    },
    [cards]
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
    cards,
    equippedCards,
    initialEquippedCards,
    loading,
    handleDropToCollection,
    handleDropToEquipped,
    handleEquippedCardSwap,
    saveEquippedCards,
  };
}

const processCardData = (cardsData: Data[]) => {
  return cardsData
    .filter((item: Data) => item.card)
    .reduce((acc: { [key: string]: CardInterface }, item: Data) => {
      const card: CardInterface = {
        id: item.card.id,
        name: item.card.name,
        description: item.card.description,
        type: item.card.type,
        conditions: item.card.conditions,
        effects: item.card.effects,
        isEquipped: item.equipped === 0 ? false : true,
        quantity: item.equipped === 0 ? 1 : 0,
        context: "collection",
      };

      if (acc[card.id]) {
        acc[card.id].quantity += 1;
      } else {
        acc[card.id] = card;
      }

      return acc;
    }, {});
};

const formatEquippedCards = (
  equippedCardsData: { slot: number; card_id: number }[],
  uniqueCardsData: CardInterface[]
): DeckSlotInterface[] => {
  const formattedEquippedCards: DeckSlotInterface[] = equippedCardsData.map(
    (cardData) => {
      const card = uniqueCardsData.find((c) => c.id === cardData.card_id);
      if (card) {
        return {
          slot: cardData.slot,
          card_id: cardData.card_id,
          card: {
            ...card,
            isEquipped: true,
          },
        };
      } else {
        return {
          slot: cardData.slot,
          card_id: cardData.card_id,
          card: {
            id: cardData.card_id,
            name: "",
            description: "",
            type: "",
            conditions: [],
            effects: [],
            isEquipped: true,
            quantity: 0,
            context: "equipped",
          },
        };
      }
    }
  );

  return formattedEquippedCards;
};
