import { BlogPost } from "@/types";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "building-nexa-ecommerce-interface-supabase-part-1",
    title: "Building Nexa: Interface Architecture and Supabase — Part 1",
    excerpt:
      "A technical look at the interface libraries and Supabase architecture behind Nexa, a modern e-commerce storefront built with Next.js, React, and TypeScript.",
    date: "August 6, 2026",
    readTime: "9 min read",
    coverImage: "https://picsum.photos/seed/nexa-commerce/1200/600",

    content: [
      {
        type: "paragraph",
        text: "Nexa began as an attempt to build an e-commerce interface that feels complete before every backend workflow is complete. The repository already contains the major surfaces of a modern shop: product discovery, filtering, product details, reviews, cart controls, checkout, and account access. Part 1 focuses on the foundation underneath those screens—the libraries that shape the interface and the Supabase layer that turns a static catalog into a server-rendered application.",
      },
      {
        type: "heading",
        level: 2,
        text: "The Interface Stack",
      },
      {
        type: "paragraph",
        text: "The application is built on the Next.js 16 App Router with React 19 and TypeScript. This combination makes server rendering the default for data-heavy pages while still allowing focused client components for interactions such as carousel controls, cart quantity changes, responsive navigation, and form feedback. Instead of making the entire storefront client-side, Nexa keeps the page structure and product retrieval on the server and introduces client state only where the interface needs it.",
      },
      {
        type: "paragraph",
        text: "Tailwind CSS 4 provides the visual language. Theme values are expressed as CSS variables using OKLCH colors, while reusable utilities handle spacing, typography, responsive behavior, dark mode, and interaction states. The result is a neutral storefront system that can be changed globally without rewriting individual product, checkout, or account components.",
      },
      {
        type: "code",
        language: "css",
        code: `:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --border: oklch(0.922 0 0);
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --border: oklch(1 0 0 / 10%);
}`,
      },
      {
        type: "heading",
        level: 2,
        text: "shadcn and Base UI as a Component Foundation",
      },
      {
        type: "paragraph",
        text: "Nexa uses shadcn as a component workflow rather than a closed component package. Its buttons, cards, inputs, selectors, checkboxes, menus, badges, and navigation elements live inside the repository, which means their markup and styling remain fully editable. Base UI supplies accessible, unstyled primitives beneath many of these components, including the button, menu, select, radio group, checkbox, avatar, and progress interfaces.",
      },
      {
        type: "paragraph",
        text: "Class Variance Authority defines predictable variants for shared components, while clsx and tailwind-merge are combined in a small cn utility. This matters in a storefront because the same primitive may appear as a primary checkout action, a compact carousel control, an outline filter, or an icon-only navigation button. Variants keep those differences explicit without duplicating the component.",
      },
      {
        type: "code",
        language: "typescript",
        code: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`,
      },
      {
        type: "heading",
        level: 2,
        text: "Motion, Carousels, and Visual Feedback",
      },
      {
        type: "paragraph",
        text: "The supporting libraries are deliberately specialized. Embla Carousel powers reusable, keyboard-aware carousel behavior for product and review content. Lenis provides smooth scrolling and anchor offsets around the fixed navigation. Lucide React supplies a consistent icon set, while tw-animate-css and custom CSS keyframes handle effects such as the animated aurora used around authentication screens. Each library owns a narrow responsibility instead of becoming a second application framework.",
      },
      {
        type: "paragraph",
        text: "This layered approach gives the storefront a useful balance: Tailwind controls the design system, Base UI handles interaction semantics, shadcn provides editable composition patterns, and smaller libraries add motion or navigation where native CSS and React state would become repetitive.",
      },
      {
        type: "heading",
        level: 2,
        text: "Why Supabase Fits the Storefront",
      },
      {
        type: "paragraph",
        text: "Supabase is responsible for two different concerns in Nexa: relational commerce data and customer identity. The project uses both @supabase/supabase-js and @supabase/ssr. The first provides the typed JavaScript API, while the SSR package connects Supabase Auth to the cookie-based rendering model used by the Next.js App Router.",
      },
      {
        type: "paragraph",
        text: "A generated-style Database type describes the public categories, products, and reviews tables. Passing this type into every Supabase client means queries return the same product model consumed by the interface. Fields such as price, quantity, colors, sizes, category_id, image arrays, and timestamps remain consistent from Postgres to the product card.",
      },
      {
        type: "code",
        language: "typescript",
        code: `export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(\`Unable to load products: \${error.message}\`);
  }

  return products;
}`,
      },
      {
        type: "heading",
        level: 2,
        text: "Separate Clients for Browser and Server",
      },
      {
        type: "paragraph",
        text: "The Supabase integration is divided into browser, server, and proxy utilities. Client Components can create a browser client when they need direct interaction. Server Components, Route Handlers, and Server Actions receive a server client connected to the Next.js cookie store. Both use the public Supabase URL and publishable key; no service-role credential is shipped to the browser.",
      },
      {
        type: "code",
        language: "typescript",
        code: `export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}`,
      },
      {
        type: "paragraph",
        text: "A Next.js proxy completes the session flow. It creates a server client from the incoming request cookies, calls getClaims to validate and refresh authentication state, and writes any updated cookies to both the forwarded request and the browser response. This prevents Server Components from working with an expired token and keeps authentication consistent across navigation and server rendering.",
      },
      {
        type: "heading",
        level: 2,
        text: "Authentication as Server-Owned Routes",
      },
      {
        type: "paragraph",
        text: "Signup and login are implemented as Route Handlers. Before calling Supabase, each handler verifies the request origin, parses FormData, validates the submitted fields, and sanitizes the destination path. Signup uses signUp with a confirmation redirect and stores the customer's display name as user metadata. Login uses signInWithPassword and returns controlled messages for unconfirmed accounts or invalid credentials rather than exposing raw provider errors.",
      },
      {
        type: "paragraph",
        text: "The confirmation route supports both a PKCE code exchange and token-hash verification. The same auth layer also includes local sign-out, password recovery email delivery, and authenticated password updates. Store layouts read verified claims on the server and pass only the display data required by the navigation, such as an email, name, and generated initials.",
      },
      {
        type: "heading",
        level: 2,
        text: "Database Access and Security Boundaries",
      },
      {
        type: "paragraph",
        text: "Product, category, and review reads are implemented as server actions. The catalog can load all products in newest-first order, retrieve a single product with maybeSingle, calculate average ratings, and rank suggested products by category match and recency. Keeping these operations in a small action layer prevents components from duplicating query logic and creates a clear place for caching, pagination, and observability later.",
      },
      {
        type: "paragraph",
        text: "The publishable key is intentionally public; security must come from Postgres grants and Row Level Security. Public catalog policies should allow only the intended product and category reads, while customer-owned reviews, addresses, carts, and future orders should be restricted using the authenticated user's ID. A service-role key must never appear in a NEXT_PUBLIC environment variable or in browser code.",
      },
      {
        type: "heading",
        level: 2,
        text: "What Is Real—and What Comes Next",
      },
      {
        type: "paragraph",
        text: "Nexa already has a real Supabase-backed catalog and a complete server-side authentication path. Some commerce features are intentionally still interface prototypes: cart persistence, order creation, payment processing, and parts of the review experience are not yet transactional backend workflows. Keeping that boundary visible is important, because a convincing checkout screen is not the same thing as a secure checkout system.",
      },
      {
        type: "paragraph",
        text: "Part 2 will move deeper into the commerce domain: persisting carts, validating inventory and prices on the server, modeling orders, and connecting checkout to a payment provider without allowing the browser to become the source of truth.",
      },
    ],
  },
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
