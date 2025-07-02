import { useState } from "react";
import { CharacterCustomizationInterface } from "../../../types/types";

export default function CharacterCustomizationControls({
  loading,
  fighterName,
  skinColor,
  setSkinColor,
  hairType,
  setHairType,
  hairColor,
  setHairColor,
  eyesType,
  setEyesType,
  eyesColor,
  setEyesColor,
  mouthType,
  setMouthType,
  onSubmit,
}: CharacterCustomizationInterface) {
  const [nameError, setNameError] = useState<string | null>(null);
  const [localName, setLocalName] = useState(fighterName);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalName(value);
    if (value.length < 3 || value.length > 25) {
      setNameError("Name must be between 3 and 25 characters");
    } else {
      setNameError(null);
    }
  };

  const handleSubmit = () => {
    if (localName) {
      onSubmit!(localName);
    }
  };

  return (
    <div className="flex flex-col justify-center mb-2 md:w-1/2 w-full select-none cursor-default">
      <div className="flex flex-col justify-center bg-slate-800 rounded-lg m-2 p-4 box-content">
        <div className="flex flex-col items-center justify-between mb-2">
          <label className="text-white">Name:</label>
          <input
            id="name"
            type="text"
            value={localName}
            minLength={3}
            maxLength={25}
            onChange={handleNameChange}
            className={`p-2 rounded-md border-2 border-white ${
              nameError
                ? "border-red-500 bg-red-100"
                : "border-green-500 bg-green-100"
            } `}
          />

          <div className="w-full text-center my-2">
            <div
              className={`transition-opacity duration-300 ${
                nameError ? "opacity-100" : "opacity-0"
              } h-4`}
            >
              {nameError && <p className="text-red-600">{nameError}</p>}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between m-2">
          <label className="text-white">Skin:</label>
          <select
            value={skinColor}
            onChange={(e) => setSkinColor(e.target.value)}
            className="bg-gray-700 text-white border border-gray-500 rounded-md"
          >
            <option value="#e7d5b3">Pale</option>
            <option value="#d7b594">Vanilla</option>
            <option value="#c09473">Beige</option>
            <option value="#884b2b">Brown</option>
            <option value="#602c2c">Black</option>
          </select>
        </div>
        <div className="flex items-center justify-between m-2">
          <label className="text-white">Hair:</label>
          <select
            value={hairType}
            onChange={(e) => setHairType(e.target.value)}
            className="bg-gray-700 text-white border border-gray-500 rounded-md"
          >
            <option value="hair1">1</option>
            <option value="hair2">2</option>
            <option value="hair3">3</option>
            <option value="hair4">4</option>
            <option value="hair5">5</option>
            <option value="hair6">6</option>
            <option value="hair7">7</option>
            <option value="hair8">8</option>
          </select>
        </div>
        <div className="flex items-center justify-between m-2">
          <label className="text-white">Hair color:</label>
          <select
            value={hairColor}
            onChange={(e) => setHairColor(e.target.value)}
            className="bg-gray-700 text-white border border-gray-500 rounded-md"
          >
            <option value="#a53030">Red</option>
            <option value="#602c2c">Brown</option>
            <option value="#7a367b">Purple</option>
            <option value="#10141f">Black</option>
            <option value="#253a5e">Blue</option>
            <option value="#25562e">Green</option>
            <option value="#de9e41">Blond</option>
          </select>
        </div>
        <div className="flex items-center justify-between m-2">
          <label className="text-white">Eyes:</label>
          <select
            value={eyesType}
            onChange={(e) => setEyesType(e.target.value)}
            className="bg-gray-700 text-white border border-gray-500 rounded-md"
          >
            <option value="eyes1">1</option>
            <option value="eyes2">2</option>
            <option value="eyes3">3</option>
            <option value="eyes4">4</option>
            <option value="eyes5">5</option>
            <option value="eyes6">6</option>
            <option value="eyes7">7</option>
            <option value="eyes8">8</option>
            <option value="eyes9">9</option>
            <option value="eyes10">10</option>
          </select>
        </div>
        <div className="flex items-center justify-between m-2">
          <label className="text-white">Eyes color:</label>
          <select
            value={eyesColor}
            onChange={(e) => setEyesColor(e.target.value)}
            className="bg-gray-700 text-white border border-gray-500 rounded-md"
          >
            <option value="blue">Blue</option>
            <option value="black">Black</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="yellow">Yellow</option>
          </select>
        </div>
        <div className="flex items-center justify-between m-2">
          <label className="text-white">Mouth:</label>
          <select
            value={mouthType}
            onChange={(e) => setMouthType(e.target.value)}
            className="bg-gray-700 text-white border border-gray-500 rounded-md"
          >
            <option value="mouth1">1</option>
            <option value="mouth2">2</option>
            <option value="mouth3">3</option>
            <option value="mouth4">4</option>
            <option value="mouth5">5</option>
            <option value="mouth6">6</option>
            <option value="mouth7">7</option>
            <option value="mouth8">8</option>
            <option value="mouth9">9</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <p className="animate-pulse text-md text-green-500">
            Creating {localName}
          </p>
          <div className="loading-circle animate-spin"></div>
        </div>
      ) : (
        <button
          type="submit"
          onClick={() => handleSubmit()}
          disabled={loading}
          className={`px-4 py-2 w-1/2 self-center bg-blue-600 text-white rounded-lg hover:bg-blue-200 hover:text-black ${
            loading || nameError || !localName ? "opacity-0" : "opacity-100"
          }`}
        >
          Save this fighter
        </button>
      )}
    </div>
  );
}
