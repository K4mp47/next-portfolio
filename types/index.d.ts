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
