export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "image"; url: string; caption?: string }
  | { type: "code"; code: string; language: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  coverImage: string;
  content: ContentBlock[];
};

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  metrics?: { label: string; value: string }[];
  link?: string;
  imageUrl?: string; // Placeholder usage
};

export type ChatMessage = {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
};

// export enum SectionType {
//   HERO = "HERO",
//   PROJECTS = "PROJECTS",
//   INTELLIGENCE = "INTELLIGENCE", // The AI Chat
//   CAPABILITIES = "CAPABILITIES", // Skills
// }
