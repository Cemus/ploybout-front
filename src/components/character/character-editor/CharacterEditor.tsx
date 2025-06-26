import { useState } from "react";
import * as THREE from "three";
import CharacterView from "./CharacterView";
import CharacterCustomizationControls from "./CharacterCustomizationControls";
import axios from "axios";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import useExitSession from "../../../hooks/useExitSession";

export default function CharacterEditor() {
  const navigate = useNavigate();
  const exitSession = useExitSession();

  const [loading, setLoading] = useState<boolean>(false);
  const [skinColor, setSkinColor] = useState("#d7b594");
  const [hairType, setHairType] = useState("hair3");
  const [hairColor, setHairColor] = useState("#a53030");
  const [eyesType, setEyesType] = useState("eyes1");
  const [eyesColor, setEyesColor] = useState("blue");
  const [mouthType, setMouthType] = useState("mouth1");

  const [controlsPosition, setControlsPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 2.5, 0)
  );

  const handleControlsTargetChange = (position: THREE.Vector3) => {
    setControlsPosition(position);
  };

  const handleSubmit = async (fighterName: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/create-fighter`,
        {
          fighterName,
          skinColor,
          hairType,
          hairColor,
          eyesType,
          eyesColor,
          mouthType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 201) {
        navigate("/profile");
      } else {
        console.error("Failed to save character");
      }
    } catch (error) {
      console.error("Error during the fighter's creation...", error);
      const e = error as AxiosError;
      const errorMessage = (e.response?.data as { error?: string }).error;
      console.error(errorMessage);
      if (e.response?.status === 401) {
        exitSession();
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-1 flex-col items-center">
      <CharacterView
        skinColor={skinColor}
        setSkinColor={setSkinColor}
        hairType={hairType}
        setHairType={setHairType}
        hairColor={hairColor}
        setHairColor={setHairColor}
        eyesType={eyesType}
        setEyesType={setEyesType}
        eyesColor={eyesColor}
        setEyesColor={setEyesColor}
        mouthType={mouthType}
        setMouthType={setMouthType}
        controlsPosition={controlsPosition}
        onControlsTargetChange={handleControlsTargetChange}
      />
      <CharacterCustomizationControls
        skinColor={skinColor}
        setSkinColor={setSkinColor}
        hairType={hairType}
        setHairType={setHairType}
        hairColor={hairColor}
        setHairColor={setHairColor}
        eyesType={eyesType}
        setEyesType={setEyesType}
        eyesColor={eyesColor}
        setEyesColor={setEyesColor}
        mouthType={mouthType}
        setMouthType={setMouthType}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
