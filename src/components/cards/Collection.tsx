import { CardInterface } from "../../types/types";
import Card from "./Card";
import EmptySlot from "./EmptySlot";

interface CollectionProps {
  cards: CardInterface[];
  handleDropToCollection: (cardId: number, slot: number) => void;
}

export default function Collection({
  cards,
  handleDropToCollection,
}: CollectionProps) {
  return (
    <div className="flex flex-col items-center max-w-[100vw]">
      <h3 className="text-white text-xl pb-4">Your card collection</h3>
      {cards ? (
        <div className="flex gap-2 items-center overflow-x-auto max-w-full min-h-52">
          {cards.map((card: CardInterface, index: number) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center"
            >
              <Card {...card} />
            </div>
          ))}
          <EmptySlot
            dropToCollection={handleDropToCollection}
            slot={0}
            context="collection"
          />{" "}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <p className="animate-pulse text-2xl text-white">
            Loading collection
          </p>
          <div className="loading-circle animate-spin"></div>
        </div>
      )}
    </div>
  );
}
