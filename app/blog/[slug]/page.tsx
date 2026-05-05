import React from "react";
import { BLOG_POSTS } from "@/constants/blog";
import { NavBar } from "@/components/NavBar";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-black min-h-screen text-white selection:bg-white selection:text-black">
      <NavBar />
      
      <main className="pt-40 pb-24 px-6">
        <article className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-16">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest mb-12"
            >
              <ArrowLeft size={14} /> Back to Journal
            </Link>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
                {post.date}
              </span>
              <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                {post.readTime}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-sans font-light tracking-tight text-white mb-8 leading-tight">
              {post.title}
            </h1>
            
            {post.coverImage && (
              <div className="aspect-video w-full overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-700">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>

          {/* Content */}
          <div className="space-y-12">
            {post.content.map((block, index) => {
              switch (block.type) {
                case "paragraph":
                  return (
                    <p key={index} className="text-gray-300 text-lg leading-relaxed font-light">
                      {block.text}
                    </p>
                  );
                case "heading":
                  const Tag = `h${block.level}` as keyof React.JSX.IntrinsicElements;
                  const sizeClasses = {
                    1: "text-3xl",
                    2: "text-2xl",
                    3: "text-xl",
                  };
                  return (
                    <Tag 
                      key={index} 
                      className={`${sizeClasses[block.level]} font-sans font-light text-white pt-4`}
                    >
                      {block.text}
                    </Tag>
                  );
                case "image":
                  return (
                    <figure key={index} className="space-y-3">
                      <div className="overflow-hidden rounded-sm bg-gray-900">
                        <img 
                          src={block.url} 
                          alt={block.caption || ""} 
                          className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500"
                        />
                      </div>
                      {block.caption && (
                        <figcaption className="text-center text-sm text-gray-500 italic">
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                case "code":
                  return (
                    <div key={index} className="rounded-md overflow-hidden border border-gray-800 my-8">
                      <SyntaxHighlighter
                        language={block.language}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: "1.5rem",
                          fontSize: "0.875rem",
                          backgroundColor: "#0a0a0a",
                        }}
                      >
                        {block.code}
                      </SyntaxHighlighter>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </article>
      </main>
    </div>
  );
}
