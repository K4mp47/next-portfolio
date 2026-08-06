export const siteUrl = "https://k4mp47.netlify.app";
export const siteName = "Alberto Campagnolo Portfolio";
export const authorName = "Alberto Campagnolo";

export const defaultDescription =
  "Portfolio of Alberto Campagnolo, a web and software developer in Treviso, Italy, building React, Next.js, TypeScript, and AI-integrated web applications.";

export const socialImage = "/k.svg";

export const sameAsLinks = [
  "https://github.com/K4mp47",
  "https://www.linkedin.com/in/alberto-campagnolo-916b86265/",
];

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
