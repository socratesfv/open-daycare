interface FeedHeaderProps {
  greeting: string;
  room: string;
  kidsCount: number;
  dateLabel: string;
}

export default function FeedHeader({ greeting, room, kidsCount, dateLabel }: FeedHeaderProps) {
  return (
    <div className="mb-6">
      <div className="mb-1 text-[12.5px] font-extrabold tracking-[0.8px] text-[#D9583C]">
        GUARDERÍA · {room.toUpperCase()}
      </div>
      <h1 className="m-0 font-display text-[30px] font-semibold text-[#3F362E]">{greeting}</h1>
      <p className="mt-1 text-[14.5px] text-[#94887B]">
        {kidsCount} niños · {dateLabel}
      </p>
    </div>
  );
}
