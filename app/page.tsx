"use client";

import { useState } from "react";
import MobileMenu from "@/app/components/MobileMenu";
import FeedHeader from "@/app/components/FeedHeader";
import CreatePostCard from "@/app/components/CreatePostCard";
import CreatePostModal from "@/app/components/CreatePostModal";
import FeedPost from "@/app/components/FeedPost";
import { currentUser, posts } from "@/data/mock/posts";

export default function Home() {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  return (
    <MobileMenu user={currentUser}>
      <main className="h-screen min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[760px] px-10 py-[34px] pb-20 md:pt-[34px] pt-[84px]">
          <FeedHeader greeting="Buenas, Caro" room="Sala Soles" kidsCount={12} dateLabel="martes 17 jun" />
          <CreatePostCard user={currentUser} onClick={() => setIsCreatePostModalOpen(true)} />

          <div className="mb-3.5 flex items-center gap-3.5">
            <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-[#8A7C6D]">PUBLICADO HOY</span>
            <span className="h-px flex-1 bg-[#E7DAC8]" />
          </div>

          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <FeedPost key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>

      <CreatePostModal isOpen={isCreatePostModalOpen} onClose={() => setIsCreatePostModalOpen(false)} />
    </MobileMenu>
  );
}
