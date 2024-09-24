import { useEffect } from "react";
import { useFighter } from "../hooks/useFighter";
import { useProfile } from "../hooks/useProfile";
import EquippedCards from "../components/cards/EquippedCards";
import CharacterCanvas from "../components/character/CharacterCanvas";
import { useFn } from "../hooks/useFn";
import LastFights from "./LastFights";

export default function Profile() {
  const { profile, fetchProfile } = useProfile();
  const { selectedFighter } = useFighter();
  const stableFetchProfile = useFn(fetchProfile);
  useEffect(() => {
    if (!profile || !selectedFighter) {
      stableFetchProfile();
      return;
    }
  }, [profile, stableFetchProfile, selectedFighter]);

  return (
    <div className="flex-1 flex flex-col items-center ">
      {profile ? (
        <>
          <h2 className="text-white text-xl p-4">
            Welcome{" "}
            <span className="underline underline-offset-2">
              {profile?.username}
            </span>
          </h2>
          <div className="flex-1 flex-col justify-around items-center">
            <div className="flex flex-col  p-4 items-center">
              {selectedFighter ? (
                <div className="h-48 w-48 lg:h-72 lg:w-72 ">
                  <CharacterCanvas fighter={selectedFighter} shot="full" />
                </div>
              ) : (
                <p>No fighter selected</p>
              )}
            </div>
            <div className="lg:flex lg:flex-row-reverse">
              <LastFights fighterId={selectedFighter?.id} />
              <div className="flex flex-col p-4 items-center">
                {selectedFighter?.decks && (
                  <EquippedCards equippedCards={selectedFighter?.decks} />
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <p className="animate-pulse text-2xl text-white">Loading profile</p>
          <div className="loading-circle animate-spin"></div>
        </div>
      )}
    </div>
  );
}
