import React from "react";
import Link from "next/link";
import { BLOG_POSTS } from "@/constants/blog";
import { BlogCard } from "@/components/BlogCard";
import { NavBar } from "@/components/NavBar";

const POSTS_PER_PAGE = 3;

export default async function BlogListing({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const totalPages = Math.ceil(BLOG_POSTS.length / POSTS_PER_PAGE);
  
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = BLOG_POSTS.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    if (totalPages <= 8) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    pages.push(1);

    if (currentPage <= 4) {
      for (let i = 2; i <= 6; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push("...");
      for (let i = totalPages - 5; i < totalPages; i++) pages.push(i);
      pages.push(totalPages);
    } else {
      pages.push("...");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="bg-black min-h-screen text-white selection:bg-white selection:text-black">
      <NavBar />
      <main className="max-w-7xl mx-auto px-6 pt-40 pb-24">
        <div className="mb-16 border-l-2 border-white pl-6">
          <h1 className="text-4xl font-sans font-light tracking-tight text-white mb-2">
            Journal
          </h1>
          <p className="text-gray-400 text-sm max-w-lg">
            Thoughts on design, code, and everything in between.
          </p>
        </div>

        <div className="flex flex-col mb-12">
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))
          ) : (
            <div className="py-24 text-center border-t border-white/10">
              <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">
                No more articles to show.
              </p>
              <Link
                href="/blog"
                className="inline-block mt-8 px-6 py-2 border border-white/20 hover:border-white transition-colors text-xs font-mono uppercase tracking-widest"
              >
                Back to first page
              </Link>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 gap-6">
            <div className="text-sm font-mono text-gray-400 uppercase tracking-widest order-2 md:order-1">
              Showing {startIndex + 1}-{Math.min(endIndex, BLOG_POSTS.length)} of {BLOG_POSTS.length} Articles
            </div>
            
            <div className="flex items-center gap-2 order-1 md:order-2">
              {/* Previous Button */}
              {currentPage > 1 ? (
                <Link
                  href={`/blog?page=${currentPage - 1}`}
                  className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white transition-colors text-xs font-mono"
                  aria-label="Previous page"
                >
                  &larr;
                </Link>
              ) : (
                <span className="w-10 h-10 flex items-center justify-center border border-white/5 text-gray-700 text-xs font-mono cursor-not-allowed">
                  &larr;
                </span>
              )}

              {/* Mobile Page Indicator */}
              <div className="md:hidden flex items-center px-4 text-xs font-mono text-gray-400 uppercase tracking-widest border border-white/10 h-10 bg-white/5">
                {currentPage.toString().padStart(2, "0")} / {totalPages.toString().padStart(2, "0")}
              </div>

              {/* Desktop Page Numbers */}
              <div className="hidden md:flex items-center gap-2 px-2">
                {pageNumbers.map((pageNum, idx) => {
                  if (pageNum === "...") {
                    return (
                      <span key={`ellipsis-${idx}`} className="w-8 h-10 flex items-center justify-center text-gray-600 font-mono text-xs">
                        ...
                      </span>
                    );
                  }
                  
                  const isActive = pageNum === currentPage;
                  return (
                    <Link
                      key={pageNum}
                      href={`/blog?page=${pageNum}`}
                      className={`w-10 h-10 flex items-center justify-center border transition-all text-xs font-mono ${
                        isActive
                          ? "bg-white text-black border-white"
                          : "border-white/20 text-gray-400 hover:border-white hover:text-white"
                      }`}
                    >
                      {pageNum.toString().padStart(2, "0")}
                    </Link>
                  );
                })}
              </div>

              {/* Next Button */}
              {currentPage < totalPages ? (
                <Link
                  href={`/blog?page=${currentPage + 1}`}
                  className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white transition-colors text-xs font-mono"
                  aria-label="Next page"
                >
                  &rarr;
                </Link>
              ) : (
                <span className="w-10 h-10 flex items-center justify-center border border-white/5 text-gray-700 text-xs font-mono cursor-not-allowed">
                  &rarr;
                </span>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
