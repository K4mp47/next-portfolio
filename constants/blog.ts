import { BlogPost } from "@/types";

export const BLOG_POSTS: BlogPost[] = [
{
  slug: "google-ai-studio-3d-animation",
  title: "How Google AI Studio Is Making 3D Animation Accessible to Everyone",
  excerpt:
    "From cinematic camera movements to interactive portfolio experiences, Google AI Studio is lowering the barrier to creating 3D web animations without advanced technical skills.",
  date: "May 28, 2026",
  readTime: "6 min read",
  coverImage: "https://picsum.photos/seed/3d-ai/1200/600",

  content: [
    {
      type: "paragraph",
      text: "For years, creating immersive 3D experiences required a deep understanding of tools like Blender, Three.js, shaders, animation timelines, and rendering pipelines. Designers and developers often spent months mastering technical workflows before producing anything visually compelling. Today, that barrier is rapidly disappearing thanks to AI-powered tools like Google AI Studio.",
    },

    {
      type: "heading",
      level: 2,
      text: "From Prompt to Animation",
    },

    {
      type: "paragraph",
      text: "Google AI Studio introduces a completely different workflow for creators. Instead of manually configuring every object, light source, or camera movement, users can describe scenes in natural language and let AI generate the foundation automatically.",
    },

    {
      type: "paragraph",
      text: "Imagine typing: 'Create a luxury fashion-inspired 3D portfolio with floating image cards, cinematic transitions, dark minimal aesthetics, and smooth scrolling interactions.' Traditionally, this would require knowledge of animation libraries, 3D coordinate systems, and frontend rendering optimizations.",
    },

    {
      type: "image",
      url: "https://picsum.photos/seed/fashion3d/1200/700",
      caption: "Modern AI tools can generate immersive 3D-inspired layouts from simple prompts.",
    },

    {
      type: "heading",
      level: 2,
      text: "AI-Generated Motion Systems",
    },

    {
      type: "paragraph",
      text: "One of the most impressive capabilities of modern AI-assisted development is generating dynamic motion systems automatically. Instead of calculating transforms manually, developers can rely on AI to scaffold smooth interpolation logic, depth layering, responsive spacing, and velocity-based animations.",
    },

    {
      type: "paragraph",
      text: "The following example demonstrates how an AI-generated card animation system can create cinematic floating layouts similar to modern interactive portfolios — all without requiring advanced 3D programming knowledge.",
    },

    {
      type: "code",
      language: "typescript",
      code: `function interpolate(val: number, input: number[], output: number[]): number {
  if (val <= input[0]) return output[0];
  if (val >= input[input.length - 1]) return output[output.length - 1];

  for (let i = 0; i < input.length - 1; i++) {
    if (val >= input[i] && val <= input[i + 1]) {
      const t = (val - input[i]) / (input[i + 1] - input[i]);
      return output[i] + t * (output[i + 1] - output[i]);
    }
  }

  return output[output.length - 1];
}

function getCardStyles(
  index: number,
  totalCards: number,
  y: number,
  vel: number,
  isMobile: boolean
) {
  const CYCLE_HEIGHT = 3600;

  const raw = y / CYCLE_HEIGHT;
  const wrapped = raw % 1;

  const p = ((index / totalCards - wrapped + 1.5) % 1) - 0.5;

  const pInput = [-0.5, -0.3, -0.1, 0.1, 0.3, 0.5];

  const xRange = isMobile
    ? [-450, -250, -50, 150, 350, 550]
    : [-1100, -650, -200, 450, 900, 1350];

  const yRange = isMobile
    ? [500, 270, 60, -150, -360, -580]
    : [1100, 650, 200, -400, -900, -1450];

  const zRange = isMobile
    ? [1200, 750, 300, -300, -850, -1400]
    : [2700, 1800, 900, -600, -1500, -2700];

  const baseX = interpolate(p, pInput, xRange);
  const baseY = interpolate(p, pInput, yRange);
  const baseZ = interpolate(p, pInput, zRange);

  const rx = 0;
  const ry = -40;
  const baseRz = 0;

  const sc = isMobile
    ? interpolate(p, pInput, [1.35, 1.15, 0.95, 0.75, 0.55, 0.35])
    : interpolate(p, pInput, [1.5, 1.25, 1.05, 0.85, 0.65, 0.45]);

  const opInput = [-0.5, -0.3, 0.3, 0.5];
  const opOutput = [0, 1, 1, 0];

  const op = interpolate(p, opInput, opOutput);

  const waveInfluence = Math.max(0, 1 - Math.abs(p) * 2);

  const x =
    baseX + vel * (isMobile ? 0.06 : 0.15) * waveInfluence;

  const yCoord =
    baseY + vel * (isMobile ? 0.03 : 0.08) * waveInfluence;

  const z =
    baseZ + Math.abs(vel) * (isMobile ? 0.08 : 0.2) * waveInfluence;

  const rz = baseRz - vel * 0.008 * waveInfluence;

  return {
    x,
    y: yCoord,
    z,
    rx,
    ry,
    rz,
    sc,
    op,
  };
}`,
    },

    {
      type: "heading",
      level: 2,
      text: "No Advanced 3D Knowledge Required",
    },

    {
      type: "paragraph",
      text: "The most important shift is accessibility. Creators who have never worked with WebGL, Three.js, shaders, or animation mathematics can now prototype immersive interfaces by collaborating with AI tools conversationally.",
    },

    {
      type: "paragraph",
      text: "Need smoother motion? Ask the AI. Want cinematic depth layering? Describe the effect. Looking for floating cards inspired by luxury fashion websites? Generate it with prompts. AI transforms the development process into something closer to creative direction than traditional programming.",
    },

    {
      type: "image",
      url: "https://picsum.photos/seed/portfolio3d/1000/600",
      caption: "AI-generated layouts can emulate high-end interactive portfolio experiences.",
    },

    {
      type: "heading",
      level: 2,
      text: "The Future of Interactive Design",
    },

    {
      type: "paragraph",
      text: "As AI-generated interfaces continue evolving, the line between designer and developer becomes increasingly blurred. What once required specialized frontend engineers and 3D artists can now be explored by individual creators with strong ideas and creative vision.",
    },

    {
      type: "paragraph",
      text: "Google AI Studio represents a major step toward democratizing interactive design. The future of web experiences is no longer limited by technical complexity — it is driven by imagination, iteration, and the ability to communicate ideas effectively through AI.",
    },
  ],
  } 
];
