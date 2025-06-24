import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import useExitSession from "../../hooks/useExitSession";
import { useFn } from "../../hooks/useFn";

interface LastFightsProps {
  id: number;
  fighter1_id: number;
  fighter2_id: number;
  fighter1_name: string;
  fighter2_name: string;
  winner_id: number;
  loser_id: number;
  updated_at: Date;
  created_at: Date;
}

export default function LastFights({
  fighterId,
}: {
  fighterId: number | undefined;
}) {
  const exitSession = useExitSession();
  const stableExitSession = useFn(exitSession);
  const [lastFights, setLastFights] = useState<LastFightsProps[] | null>(null);

  useEffect(() => {
    const fetchLastFights = async () => {
      try {
        const response = await axios.get<LastFightsProps[]>(
          `/api/combat-history/${fighterId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setLastFights(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des précedents combats",
          error
        );
        const e = error as AxiosError;
        const errorMessage = (e.response?.data as { error?: string })?.error;
        console.error(errorMessage);
        if (e.response?.status === 401) {
          stableExitSession();
        }
      }
    };

    fetchLastFights();
  }, [fighterId, stableExitSession]);

  const renderLastFights = () => {
    if (!lastFights || lastFights.length === 0) {
      return <p className="text-white">No recent fights found.</p>;
    }

    return lastFights.map((fight: LastFightsProps, index: number) => {
      const draw = fight.winner_id === null;
      const isPlayerWinner = fight.winner_id === fighterId;
      const opponentUsername =
        fighterId === fight.fighter1_id
          ? fight.fighter2_name
          : fight.fighter1_name;

      return (
        <div
          key={index}
          className={`p-2 w-full text-lg px-4 text-center ${
            isPlayerWinner ? "bg-green-500" : "bg-red-500"
          } rounded-lg cursor-pointer transition-transform duration-200 ease-in-out
    hover:scale-110 hover:shadow-lg hover:z-10`}
        >
          {draw ? (
            <p>
              Draw against
              <span className="text-xl font-bold">{opponentUsername}</span>
            </p>
          ) : isPlayerWinner ? (
            <p>
              You smashed{" "}
              <span className="text-xl font-bold">{opponentUsername}</span>
            </p>
          ) : (
            <p>
              You were outsmarted by{" "}
              <span className="text-xl font-bold">{opponentUsername}</span>
            </p>
          )}

          <p>{new Date(fight.created_at).toLocaleDateString()}</p>
        </div>
      );
    });
  };

  return (
    <aside className="flex flex-col p-4 items-center">
      <h3 className="text-white text-xl p-4">Fights history</h3>
      <div className="flex flex-col items-center justify-center gap-3 ">
        {renderLastFights()}
      </div>
    </aside>
  );
}
