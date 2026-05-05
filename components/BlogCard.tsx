import React from "react";
import Link from "next/link";
import { BlogPost } from "@/types";
import { ArrowRight } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block border-b border-gray-800 py-12 transition-all"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
              {post.date}
            </span>
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
              {post.readTime}
            </span>
          </div>
          <h3 className="text-2xl font-sans font-light text-white group-hover:text-gray-300 transition-colors mb-4 leading-tight">
            {post.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-2 text-white font-mono text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Read Article <ArrowRight size={14} />
          </div>
        </div>
        {post.coverImage && (
          <div className="w-full md:w-48 h-32 relative overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-500">
            <img
              src={post.coverImage}
              alt={post.title}
              className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
      </div>
    </Link>
  );
};
