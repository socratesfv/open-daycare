import type { Post } from "@/data/mock/posts";

interface PostTypeStyle {
  badgeClass: string;
  dotClass: string;
  labelClass: string;
}

const typeStyles: Record<Post["type"], PostTypeStyle> = {
  logro: { badgeClass: "bg-[#CFEBD8]", dotClass: "bg-[#3E9B6C]", labelClass: "text-[#3E9B6C]" },
  actividad: { badgeClass: "bg-[#C7E7F1]", dotClass: "bg-[#2E89A6]", labelClass: "text-[#2E89A6]" },
  anuncio: { badgeClass: "bg-[#CCD8F4]", dotClass: "bg-[#4E72C8]", labelClass: "text-[#4E72C8]" },
};

const typeLabels: Record<Post["type"], string> = {
  logro: "LOGRO",
  actividad: "ACTIVIDAD",
  anuncio: "ANUNCIO",
};

function HeartIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="#E0654A" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

function PhotoIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
    </svg>
  );
}

interface FeedPostProps {
  post: Post;
}

export default function FeedPost({ post }: FeedPostProps) {
  const styles = typeStyles[post.type];
  const isAnnouncement = post.type === "anuncio";

  return (
    <article className="rounded-[20px] border border-[#ECE0D0] bg-[#FFFDF9] px-[22px] py-5 shadow-[0_4px_16px_-12px_rgba(120,90,60,.5)]">
      <div className="mb-3.5 flex items-center gap-3">
        {isAnnouncement ? (
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#CCD8F4] text-[#4E72C8]">
            <MegaphoneIcon />
          </div>
        ) : (
          <div
            className="flex h-11 w-11 flex-none items-center justify-center rounded-full font-display text-[17px] font-semibold"
            style={{ backgroundColor: post.author.color, color: post.author.textColor ?? "#fff" }}
          >
            {post.author.initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-[16.5px] font-semibold text-[#3F362E]">{post.author.name}</div>
          <div className="truncate text-[12.5px] text-[#A89A8B]">
            {post.timestamp} · publicado por {post.publishedBy}
          </div>
        </div>
        <div className={`flex flex-none items-center gap-[7px] rounded-[999px] px-3 py-1.5 ${styles.badgeClass}`}>
          <span className={`h-2 w-2 rounded-full ${styles.dotClass}`} />
          <span className={`text-xs font-extrabold tracking-[0.5px] ${styles.labelClass}`}>{typeLabels[post.type]}</span>
        </div>
      </div>

      <div className="mb-2.5 text-[12.5px] text-[#A89A8B]">Para: {post.target}</div>

      <p className="m-0 text-[15.5px] leading-[1.55] text-[#4A4038]">{post.content}</p>

      {post.imageCaption && (
        <a
          href="#"
          className="mt-3.5 flex h-[200px] flex-col items-center justify-center gap-2 rounded-[16px] border-[1.5px] border-dashed border-[#DBCDBA] bg-[#F4ECE1] text-[#B0A290]"
        >
          <PhotoIcon />
          <span className="text-[13.5px]">{post.imageCaption}</span>
        </a>
      )}

      <div className="mt-4 flex items-center gap-[18px] border-t border-[#F0E6D8] pt-3.5">
        <span className="flex items-center gap-[7px] text-sm font-bold text-[#E0654A]">
          <HeartIcon />
          {post.likes}
        </span>
        <a href="#" className="flex items-center gap-[7px] text-sm font-bold text-[#94887B]">
          <CommentIcon />
          {post.comments}
        </a>
        <span className="flex-1" />
        <a href="#" className="text-sm font-extrabold text-[#C5503A]">
          Editar
        </a>
      </div>
    </article>
  );
}
