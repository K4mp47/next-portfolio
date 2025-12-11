import { Project } from "@/types";

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "3D Portfolio Website",
    category: "Web Development",
    description:
      "My 3D portfolio created using React Tailwindcss and Spline. It's a personal project.",
    techStack: ["Vite.js", "TypeScript", "Spline"],
    metrics: [
      { label: "FPS", value: "avg. 30" },
      { label: "3D Models", value: "Spline platform" },
    ],
    imageUrl: "https://picsum.photos/800/600",
    link: "https://k4mp47.github.io/kampa_project/",
  },
  {
    id: "2",
    title: "Quote Generator Website",
    category: "Web Development",
    description:
      "Quote generator created using NextJs React and Tailwindcss. It's a personal project.",
    techStack: ["Node.js", "FreeAPI", "TypeScript", "React"],
    metrics: [
      { label: "API", value: "javascript" },
      { label: "Request Latency", value: "<50ms" },
    ],
    imageUrl: "https://picsum.photos/800/601",
    link: "https://k4mp47.github.io/quote-generator/",
  },
  {
    id: "3",
    title: "Custom JSON Format Parser",
    category: "Scripted Tool",
    description:
      "A custom JSON format parser created using just C++. It's an university's project.",
    techStack: ["C++", "JSON", "DataStreams"],

    imageUrl: "https://picsum.photos/800/603",
    link: "https://github.com/K4mp47/PEL/blob/main/src/json.cpp",
  },
  {
    id: "4",
    title: "Ukibi Gin Website",
    category: "Web Development",
    description:
      "Website created using Vue React and Tailwindcss. It's a project commissioned by the Bussola Venice's Bar.",
    techStack: ["React", "Tailwind", "TypeScript", "Vue.js"],
    imageUrl: "https://picsum.photos/800/604",
    link: "https://www.ukibigin.com",
  },
  {
    id: "5",
    title: "Rune Website",
    category: "Web Development SaaS",
    description:
      "A webpage for a possible future client with the idea of selling software. It's a personal project.",
    techStack: ["React", "Tailwind", "TypeScript", "Next.js", "AcernityUI"],
    imageUrl: "https://picsum.photos/800/605",
    link: "https://rune-agency.netlify.app",
  },
  {
    id: "6",
    title: "GSAP-Copy Website",
    category: "Web Development Animation",
    description:
      "A winning awards webpage recreated to learn how to use basic GSAP animation. It's a personal project. Made with React and Tailwindcss, GSAP for animations.",
    techStack: ["React", "Tailwind", "TypeScript", "Next.js", "GSAP"],
    imageUrl: "https://picsum.photos/800/606",
    link: "https://gsap-copy.netlify.app",
  },
  {
    id: "7",
    title: "Microblog Flask Project",
    category: "Microblog Application",
    description: "Recreated microblog Flask full-based by Miguel Grinberg",
    techStack: ["Flask", "Python", "SQLite", "HTML", "CSS"],
    metrics: [
      { label: "APIs", value: "Flask" },
      { label: "Docker", value: "In progress" },
    ],
    imageUrl: "https://picsum.photos/800/607",
    link: "https://github.com/K4mp47/Flask-by-Miguel-Grinberg.git",
  },
  {
    id: "8",
    title: "Hirelens Project",
    category: "CV Review Application",
    description:
      "A Web application for CV reviews. It's a personal project. Based on Nextjs, use Puter.js for AI functionalities.",
    techStack: ["Next.js", "TypeScript", "Puter.js", "Tailwindcss", "AI"],
    metrics: [
      { label: "CVs Analyzed", value: "50+" },
      { label: "Avg. Review Time", value: "<2 mins" },
    ],
    imageUrl: "https://picsum.photos/800/608",
    link: "https://hire-lens.netlify.app/",
  },
  {
    id: "9",
    title: "Doculytics AI",
    category: "AI Document Analysis",
    description:
      "An AI-powered Vinted document analysis tool. It's a personal project.",
    techStack: ["Vite.js", "TypeScript", "AI", "Tailwindcss"],
    metrics: [
      { label: "Documents Analyzed", value: "100+" },
      { label: "Accuracy", value: "92%" },
    ],
    imageUrl: "https://picsum.photos/800/609",
    link: "https://doculytics-ai.netlify.app/",
  },
];

