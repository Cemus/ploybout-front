import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile";
import useExitSession from "../../hooks/useExitSession";
import { useFighter } from "../../hooks/useFighter";
import { FighterInterface } from "../../types/types";
import { useFn } from "../../hooks/useFn";
import OpponentDetail from "./OpponentDetails";

export default function CombatPage() {
  const { fetchProfile } = useProfile();
  const exitSession = useExitSession();
  const { selectedFighter } = useFighter();

  const navigate = useNavigate();
  const [opponents, setOpponents] = useState<FighterInterface[]>([]);

  const stableFetchProfile = useFn(fetchProfile);
  const stableExitSession = useFn(exitSession);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpponents = async () => {
      if (!selectedFighter) {
        stableFetchProfile();
        return;
      }
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Pas de token :)");
        return;
      }

      try {
        const fightersResponse = await axios.post(
          "/api/seek-fighters",
          {
            fighter_id: selectedFighter!.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const opponents = fightersResponse.data;

        setOpponents(opponents);
      } catch (error) {
        console.error("Error during opponents research:", error);
        const e = error as AxiosError;
        let errorMessage;
        if (e.response) {
          errorMessage = (e.response.data as { error?: string }).error;
        }
        if (errorMessage) {
          console.error(errorMessage);
          setError(errorMessage);
        }

        if (e.response?.status === 401) {
          stableExitSession();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOpponents();
  }, [stableExitSession, selectedFighter, stableFetchProfile]);

  const handleFightOpponent = (fighter: FighterInterface) => {
    navigate("/battlefield", {
      state: { opponent: fighter, player: selectedFighter },
    });
  };

  if (loading)
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 ">
        <p className="animate-pulse text-2xl text-white">Loading players</p>
        <div className="loading-circle animate-spin"></div>
      </div>
    );
  if (error) return <p>Error loading players: {error}</p>;

  return (
    <div className="flex-1 flex flex-col pb-24 md:pb-0">
      <h2 className="text-white text-xl p-4 text-center">Arena</h2>
      <div className="flex flex-1 items-center justify-center">
        <ul className="flex flex-wrap items-center justify-center w-full ">
          {opponents &&
            opponents.map((fighter: FighterInterface, index: number) => (
              <OpponentDetail
                key={index}
                fighter={fighter}
                handleFightOpponent={() => handleFightOpponent(fighter)}
              />
            ))}
        </ul>
      </div>
    </div>
  );
}
