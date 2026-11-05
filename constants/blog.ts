import { BlogPost } from "@/types";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "icon-wave-css-scroll-animation",
    title: "Icon Wave: Creating Rhythm with CSS and Scroll",
    excerpt:
      "How staggered CSS keyframes and scroll-driven parallax turn a row of tool icons into a continuous wave, with visibility-aware playback and reduced-motion support.",
    date: "November 5, 2026",
    readTime: "5 min read",
    coverImage: "/icon-wave.png",
    coverAnimation: "icon-wave",
    content: [
      {
        type: "paragraph",
        text: "Icon Wave turns a familiar row of developer tools into a moving composition. Circular badges rise and fall at different points in the same repeating cycle, creating a wave across the row. Scrolling adds a second movement: the whole track shifts horizontally as the section passes through the viewport. The vertical rhythm continues when scrolling stops, while the horizontal position settles into place.",
      },
      {
        type: "paragraph",
        text: "This article follows the IconWave.tsx and IconWave.css source published with the playground at https://k4mp47-dev-blog-animation.netlify.app/. The component uses React, Lucide icons, CSS keyframes, and native browser APIs. Its motion comes from a small division of responsibilities: CSS animates each badge, and JavaScript positions their shared track.",
      },
      {
        type: "heading",
        level: 2,
        text: "One Animation, Different Phases",
      },
      {
        type: "paragraph",
        text: "Every badge follows the same vertical keyframes and duration. What makes the row look like a traveling wave is the animation delay assigned to each position. The delays are negative, so each badge starts partway through its cycle immediately. There is no initial wait for the wave to populate the row, and the icons never need separate timelines.",
      },
      {
        type: "code",
        language: "typescript",
        code: `// Per-badge phase offset from the demo.
const animationDelay = (-index * seconds * 0.58) / (Math.PI * 2);

// With the default duration of 5.28 seconds:
// index 0:  0.00s
// index 1: -0.49s
// index 2: -0.97s`,
      },
      {
        type: "paragraph",
        text: "Because the delay scales with duration, changing the cycle length preserves the phase relationship between neighboring badges. The factor 0.58 corresponds to their phase separation in radians. At the default settings, the wave repeats spatially about every eleven badges. Increasing duration slows the motion without changing that spacing.",
      },
      {
        type: "paragraph",
        text: "The keyframes approximate a sine wave using eight equally spaced segments. At an eighth of the cycle, displacement is roughly 0.707 times the amplitude; at a quarter, it reaches the positive extreme; at three quarters, the negative extreme. Linear interpolation connects these sampled positions. This is a practical approximation, so its velocity changes at the sample boundaries rather than following a mathematically continuous sine curve.",
      },
      {
        type: "code",
        language: "css",
        code: `@keyframes icon-wave-bob {
  0%, 50%, 100% { transform: translate3d(0, 0, 0); }
  12.5%, 37.5% {
    transform: translate3d(0, calc(var(--wave-amplitude) * .707), 0);
  }
  25% { transform: translate3d(0, var(--wave-amplitude), 0); }
  62.5%, 87.5% {
    transform: translate3d(0, calc(var(--wave-amplitude) * -.707), 0);
  }
  75% {
    transform: translate3d(0, calc(var(--wave-amplitude) * -1), 0);
  }
}`,
      },
      {
        type: "heading",
        level: 2,
        text: "Give Each Movement Its Own Element",
      },
      {
        type: "paragraph",
        text: "The horizontal transform belongs to the track, while the vertical transform belongs to each badge. This nesting lets both movements compose naturally. If scrolling and the CSS animation wrote transform on the same element, one could overwrite the other. Separate elements give each motion a clear owner without needing to combine every coordinate in JavaScript.",
      },
      {
        type: "paragraph",
        text: "The layout reinforces that separation. A clipped stage contains a max-content flex track centered with a 50 percent margin and a negative 50 percent translation. Each badge is 90 pixels wide with a 14-pixel gap, and the stage height reserves space for both extremes of the wave. The result is a long strip moving behind a stable window rather than a layout that changes height on every frame.",
      },
      {
        type: "heading",
        level: 2,
        text: "Map the Viewport Crossing to Horizontal Travel",
      },
      {
        type: "paragraph",
        text: "Scroll progress measures the section's complete journey through the viewport. It starts at zero when the section's top reaches the bottom of the screen and reaches one when its bottom leaves the top. Subtracting progress from 0.5 produces a signed offset: positive on entry, zero halfway through, and negative on departure. Scrolling backward reverses that horizontal movement while the CSS wave continues running in its original direction.",
      },
      {
        type: "code",
        language: "typescript",
        code: `const rect = section.getBoundingClientRect();
const distance = Math.max(1, window.innerHeight + rect.height);
const progress = Math.min(
  1,
  Math.max(0, (window.innerHeight - rect.top) / distance),
);
const horizontalShift =
  Math.min(travel, window.innerWidth * 0.38) * (0.5 - progress);`,
      },
      {
        type: "paragraph",
        text: "The default scrollTravel is 520 pixels, but the actual end-to-end distance is capped at 38 percent of the viewport width. That value is then split across the positive and negative halves of the crossing. On a narrow screen, the cap keeps the horizontal movement proportional to the available space instead of dragging the strip by a desktop-sized distance.",
      },
      {
        type: "paragraph",
        text: "Position approaches its target through exponential smoothing with a 100-millisecond time constant. The interpolation uses elapsed frame time, which helps preserve a similar response across different refresh rates. Once the remaining gap is below 0.1 pixels, the position snaps to its destination and the frame loop stops. A passive scroll listener requests another update only when needed.",
      },
      {
        type: "heading",
        level: 2,
        text: "Pause Work Outside the Scene",
      },
      {
        type: "paragraph",
        text: "An IntersectionObserver controls playback with a 160-pixel margin above and below the viewport. The margin lets animation resume shortly before the section becomes visible. Outside that extended area, CSS animations pause and pending position frames are canceled. The will-change hints are also tied to active playback, limiting their lifetime rather than leaving them enabled across the entire page.",
      },
      {
        type: "paragraph",
        text: "React renders the icon list and configuration; refs and a CSS custom property handle frame-by-frame track updates. A seeded shuffle keeps the 21 Lucide icons in a consistent order across renders. On unmount, the component disconnects its observer, removes scroll, resize, and motion-preference listeners, and cancels any pending animation frame.",
      },
      {
        type: "heading",
        level: 2,
        text: "Motion Should Remain Optional",
      },
      {
        type: "paragraph",
        text: "The component respects prefers-reduced-motion in both layers. CSS removes the vertical animation and centers the track, while JavaScript stops scheduling horizontal updates and clears the scroll offset. A paused prop also stops the wave and further horizontal updates. If this repeating decoration appears beside content people are reading, expose that prop through a visible pause control; reduced-motion support alone does not give every reader a way to stop it.",
      },
      {
        type: "paragraph",
        text: "The badges are decorative: their wrappers and SVGs are hidden from assistive technology, and they do not accept pointer interaction. That suits an atmospheric illustration of tools. If the same icons communicate actual skills or supported integrations, provide those names in readable text nearby. If they become links, they need meaningful accessible names and visible keyboard focus rather than inheriting the decorative treatment.",
      },
      {
        type: "heading",
        level: 2,
        text: "A Small Motion System with a Clear Role",
      },
      {
        type: "paragraph",
        text: "The defaults use a 5.28-second cycle and a 26-pixel amplitude. Duration controls tempo, amplitude controls vertical energy, and scroll travel controls the connection to navigation. The component bounds these numeric inputs and falls back when values are not finite, keeping invalid settings out of the generated styles. Light and dark themes change the badge surfaces through CSS variables without changing the motion.",
      },
      {
        type: "paragraph",
        text: "Icon Wave fits a tools section, a quiet divider, or the introduction to a developer portfolio. Its useful lesson is structural: one shared animation with phase offsets creates rhythm, while a parent transform connects that rhythm to scrolling. The surrounding content should remain the reason to stay on the page, with the wave providing a little movement around it.",
      },
    ],
  },
  {
    slug: "tile-reveal-scroll-driven-animation",
    title: "Tile Reveal: Choreographing Images with Scroll",
    excerpt:
      "Inside a scroll-driven tile reveal: alternating image columns, a sticky stage, smooth progress, and an accessible transition from imagery to a final call to action.",
    date: "October 18, 2026",
    readTime: "6 min read",
    coverImage: "/tile-reveal.svg",
    content: [
      {
        type: "paragraph",
        text: "A grid of photographs can do more than display a collection. In the Tile Reveal experiment, it becomes a transition between visual exploration and a clear message. Image columns enter from opposite vertical directions, gather around a headline, then enlarge and move toward the edges. Once the images have cleared, the heading lifts and a description and action button appear. Scrolling backward reverses the sequence, so the reader controls the pace of the composition.",
      },
      {
        type: "paragraph",
        text: "This breakdown follows the React and TypeScript component source published with the Tile Reveal playground at https://k4mp47-dev-blog-animation.netlify.app/. The implementation uses native scrolling, CSS transforms, and requestAnimationFrame. The playground adds Lenis for smooth scrolling inside its preview container, but the reusable component does not require an animation library.",
      },
      {
        type: "heading",
        level: 2,
        text: "A Sticky Stage Gives the Sequence Room",
      },
      {
        type: "paragraph",
        text: "The component separates the distance you scroll from the scene you see. A tall outer section provides the timeline, while a viewport-height inner scene stays sticky at the top. By default, the section is five viewport heights tall. The scene clips the moving images at its boundaries, creating a fixed frame while the document continues to move. The headline sits above the decorative grid in the stacking order, keeping the message readable throughout the sequence.",
      },
      {
        type: "paragraph",
        text: "Progress comes from the section's position relative to the chosen scroll container. Dividing the distance traveled by section height minus viewport height produces a value between zero and one. That subtraction matters: the sequence finishes when the bottom of the tall section reaches the bottom of the viewport, which is also where the sticky scene runs out of room.",
      },
      {
        type: "code",
        language: "typescript",
        code: `// Progress calculation from the demo's component.
export function tileRevealProgress(
  top: number,
  sectionHeight: number,
  viewportHeight: number,
) {
  return Math.max(
    0,
    Math.min(1, -top / Math.max(1, sectionHeight - viewportHeight)),
  );
}`,
      },
      {
        type: "heading",
        level: 2,
        text: "Three Phases, One Continuous Gesture",
      },
      {
        type: "paragraph",
        text: "The entry phase brings columns into the frame, alternating their vertical direction by index. Images are distributed across columns using their index modulo the column count, and each column moves as a single group. Stagger offsets the columns' progress windows; overlap reduces the distance between those windows. Together, these controls create a coordinated assembly without giving every image an independent animation.",
      },
      {
        type: "paragraph",
        text: "The departure begins around 38 percent of the timeline. The grid scales from 0.78 toward the default zoom of 2.05, while columns move vertically away and spread horizontally toward their respective sides. The component divides translation distances by the current scale to compensate for the parent transform. Without that compensation, scaling the grid would also magnify its children's translations, making the departure harder to control.",
      },
      {
        type: "paragraph",
        text: "Near the end, the heading moves upward between 76 and 94 percent progress. The description and action follow between 80 and 94 percent, fading in while moving upward by 24 pixels. These overlapping windows connect the image departure to the final message. They also leave a short stretch of settled content before the sticky section releases.",
      },
      {
        type: "code",
        language: "typescript",
        code: `// Each phase maps a slice of the scroll timeline to smooth progress.
function phase(progress: number, start: number, end: number) {
  const value = Math.max(0, Math.min(1, (progress - start) / (end - start)));
  return value * value * (3 - 2 * value);
}

const departure = phase(progress, 0.38, 0.78);
const scale = 0.78 + (Math.max(1, zoom) - 0.78) * departure;
const lift = phase(progress, 0.76, 0.94);
const reveal = phase(progress, 0.80, 0.94);`,
      },
      {
        type: "heading",
        level: 2,
        text: "Smooth Scrolling and Smooth Animation Are Separate",
      },
      {
        type: "paragraph",
        text: "The component's scrub setting smooths the animation's response to a new scroll position. A scroll event updates the destination progress and requests a frame. On each frame, the current value approaches that destination using an exponential interpolation based on elapsed time. This makes the response less dependent on display refresh rate than a fixed interpolation amount per frame. A scrub value of zero applies the destination immediately.",
      },
      {
        type: "paragraph",
        text: "Lenis serves a different role in the playground: it smooths the scrolling of the preview container itself. Keeping these responsibilities separate lets the same TileReveal component follow either native page scrolling or a nested element passed as scrollRoot. It also means the amount of visual catch-up can be tuned independently from the scrolling experience.",
      },
      {
        type: "heading",
        level: 2,
        text: "Keep the Message Accessible Throughout",
      },
      {
        type: "paragraph",
        text: "The headline remains real HTML text. The image grid is decorative, with aria-hidden on its container and empty image alt attributes. That is appropriate for this composition because the images support a message already expressed in text. A product gallery or editorial photo sequence would need a different treatment if the images carried information unavailable elsewhere.",
      },
      {
        type: "paragraph",
        text: "The description and action begin hidden. As the final reveal progresses, their visibility and opacity change, but the footer stays inert and aria-hidden until the reveal reaches its completed state. This prevents keyboard users from landing on an action that has not fully appeared. With prefers-reduced-motion enabled, the component hides the decorative columns, removes the transforms, and immediately presents the final text and action. The outer section still keeps its configured height, so shortening that empty scroll distance is a useful refinement to consider when adapting the component.",
      },
      {
        type: "heading",
        level: 2,
        text: "Where the Cost Lives",
      },
      {
        type: "paragraph",
        text: "React builds the structure, while refs let the animation update styles without setting React state on every frame. Passive scroll listeners schedule work through requestAnimationFrame, and the frame loop stops when current progress reaches its destination. Cleanup removes listeners, disconnects the ResizeObserver, and cancels any pending frame. These choices keep the animation's lifecycle contained.",
      },
      {
        type: "paragraph",
        text: "Transforms and opacity are useful animation properties, but they do not make performance automatic. The paint function also reads column dimensions, image decoding can be expensive, and several large photographs can consume substantial memory. Before shipping this effect, size images for their rendered use, check layout work in browser performance tools, and test the full sequence on a phone. Apply will-change to the small number of moving groups rather than promoting every image separately.",
      },
      {
        type: "heading",
        level: 2,
        text: "Tune the Composition Around the Content",
      },
      {
        type: "paragraph",
        text: "The demo starts with four columns, a 28-pixel gap, square tiles, and a 720-pixel grid width. Those values establish the composition before motion begins. Zoom and spread determine how decisively the images leave; stagger and overlap shape their relationship; scroll length sets how much effort the sequence asks from the reader. A short headline and a single clear action give that movement a useful destination.",
      },
      {
        type: "paragraph",
        text: "Tile Reveal works well as a transition from selected work to a project invitation, or from a visual collection to a product statement. Its strength is the handoff: imagery gathers attention, movement creates space, and the final text tells the reader where to go next. The best version earns its scroll distance by making that destination worth reaching.",
      },
    ],
  },
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
