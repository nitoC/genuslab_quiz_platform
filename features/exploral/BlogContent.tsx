import GlassCard from "@/components/ui/cards/GlassCard";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { formatDistanceToNowStrict, subHours } from "date-fns";
import Link from "next/link";
import React, { memo } from "react";
import {
  MdCalendarToday,
  MdFlashOn,
  MdPublic,
  MdSmartToy,
} from "react-icons/md";

const BlogContent = ({ posts }: { posts: any }) => {
  let postsDup = posts;
  const post = posts?.[0];
  const blogUrl = "https://genuslabtech.online";
  postsDup.length > 1
    ? (postsDup = posts.filter((a: any) => a.title !== post.title))
    : (postsDup = []);
  const postIcons = [<MdCalendarToday />, <MdFlashOn />, <MdSmartToy />];
  console.log(postsDup, "dup");
  console.log(subHours("2026-05-05T15:56:00.000Z", 2), "sub hours");
  return (
    <GlassCard className="lg:col-span-4 p-6 md:p-8 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6 md:mb-8 shrink-0">
        <div>
          <p className="text-blue-500 text-[14px] uppercase tracking-widest font-bold">
            Latest Trends
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 mt-1">
            <MdPublic className="text-blue-500" /> Tech News
          </h2>
        </div>
        <Link
          href={blogUrl}
          target="__blank"
          className="text-slate-400 text-[14px] hover:bg-blue-400 duration-200 hover:text-white font-bold bg-white/5 px-4 md:px-6 py-2 rounded-lg border border-white/10 hidden sm:block"
        >
          Discover Full Feed
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch mt-auto">
        <Link
          href={`${blogUrl}/post/${post.slug.current}`}
          target="__blank"
          className="relative group cursor-pointer rounded-3xl overflow-hidden min-h-[280px] md:min-h-[320px] flex flex-col"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
          <ImageWithFallback
            src={post.mainImageUrl}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 p-6 z-20 mt-auto">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
              {post.title}
            </h3>
            <p className="text-slate-300 text-[14px] font-bold uppercase tracking-wider">
              5 Min Read •{" "}
              {formatDistanceToNowStrict(new Date(post.publishedAt))} ago
            </p>
          </div>
        </Link>

        <div className="flex flex-col gap-4 h-full">
          {postsDup.map((item: any, i: number) => (
            <Link
              href={`${blogUrl}/post/${item.slug.current}`}
              target="__blank"
              key={i}
              className="flex hover:text-blue-300 text-white gap-4 group cursor-pointer border-b border-white/5 pb-4 last:border-0 flex-1 min-h-[80px]"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                {postIcons[i]}
              </div>
              <div className="flex-1">
                <h4 className="text-sm md:text-sm font-bold leading-snug line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-slate-500 text-[14px] mt-1 font-bold uppercase">
                  {formatDistanceToNowStrict(new Date(item.publishedAt))} ago
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

export default memo(BlogContent);
