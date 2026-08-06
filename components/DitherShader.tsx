"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

type DitherMode = "bayer" | "halftone" | "noise" | "crosshatch";
type ColorMode = "original" | "grayscale" | "duotone";

interface DitherShaderProps {
  src: string;
  alt: string;
  className?: string;
  gridSize?: number;
  ditherMode?: DitherMode;
  colorMode?: ColorMode;
  primaryColor?: string;
  secondaryColor?: string;
  threshold?: number;
  contrast?: number;
}

const BAYER_MATRIX = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const parseColor = (color: string) => {
  const hex = color.replace("#", "");
  const value = Number.parseInt(
    hex.length === 3
      ? hex
          .split("")
          .map((part) => part + part)
          .join("")
      : hex,
    16,
  );

  return [(value >> 16) & 255, (value >> 8) & 255, value & 255] as const;
};

export function DitherShader({
  src,
  alt,
  className = "",
  gridSize = 3,
  ditherMode = "bayer",
  colorMode = "duotone",
  primaryColor = "#050505",
  secondaryColor = "#dbeafe",
  threshold = 0.5,
  contrast = 1.15,
}: DitherShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendered, setIsRendered] = useState(false);

  const renderDither = useCallback(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    const canvas = canvasRef.current;

    if (!container || !image || !canvas || !image.complete || !image.naturalWidth) {
      return;
    }

    const { width: cssWidth, height: cssHeight } =
      container.getBoundingClientRect();
    if (!cssWidth || !cssHeight) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(cssWidth * dpr));
    const height = Math.max(1, Math.round(cssHeight * dpr));
    const cellSize = Math.max(1, Math.round(gridSize * dpr));
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    canvas.width = width;
    canvas.height = height;

    const imageRatio = image.naturalWidth / image.naturalHeight;
    const canvasRatio = width / height;
    const drawWidth = imageRatio > canvasRatio ? height * imageRatio : width;
    const drawHeight = imageRatio > canvasRatio ? height : width / imageRatio;
    const offsetX = (width - drawWidth) / 2;
    const offsetY = (height - drawHeight) / 2;

    context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

    try {
      const pixels = context.getImageData(0, 0, width, height).data;
      const primary = parseColor(primaryColor);
      const secondary = parseColor(secondaryColor);
      context.clearRect(0, 0, width, height);

      for (let y = 0; y < height; y += cellSize) {
        for (let x = 0; x < width; x += cellSize) {
          const sampleX = Math.min(width - 1, x + Math.floor(cellSize / 2));
          const sampleY = Math.min(height - 1, y + Math.floor(cellSize / 2));
          const index = (sampleY * width + sampleX) * 4;
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const luminance =
            ((0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255 - 0.5) *
              contrast +
            0.5;

          let patternThreshold = threshold;
          if (ditherMode === "bayer") {
            const matrixX = Math.floor(x / cellSize) % 4;
            const matrixY = Math.floor(y / cellSize) % 4;
            patternThreshold += (BAYER_MATRIX[matrixY][matrixX] / 16 - 0.5) * 0.72;
          } else if (ditherMode === "noise") {
            const noise = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
            patternThreshold += (noise - Math.floor(noise) - 0.5) * 0.65;
          } else if (ditherMode === "crosshatch") {
            patternThreshold += ((x + y) / cellSize) % 4 === 0 ? -0.22 : 0.12;
          }

          if (ditherMode === "halftone") {
            const radius = Math.max(0, Math.min(1, luminance)) * cellSize * 0.7;
            context.fillStyle = `rgb(${secondary.join(" ")})`;
            context.beginPath();
            context.arc(x + cellSize / 2, y + cellSize / 2, radius, 0, Math.PI * 2);
            context.fill();
            continue;
          }

          if (colorMode === "original") {
            const quantize = (channel: number) =>
              luminance > patternThreshold ? channel : channel * 0.28;
            context.fillStyle = `rgb(${quantize(red)} ${quantize(green)} ${quantize(blue)})`;
          } else if (colorMode === "grayscale") {
            const shade = luminance > patternThreshold ? 235 : 12;
            context.fillStyle = `rgb(${shade} ${shade} ${shade})`;
          } else {
            const color = luminance > patternThreshold ? secondary : primary;
            context.fillStyle = `rgb(${color.join(" ")})`;
          }

          context.fillRect(x, y, cellSize, cellSize);
        }
      }

      setIsRendered(true);
    } catch {
      // Keep the source image visible if a remote server disallows canvas access.
      setIsRendered(false);
    }
  }, [
    colorMode,
    contrast,
    ditherMode,
    gridSize,
    primaryColor,
    secondaryColor,
    threshold,
  ]);

  useEffect(() => {
    const observer = new ResizeObserver(renderDither);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [renderDither]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* The image remains as an accessible and CORS-safe fallback below the canvas. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        crossOrigin="anonymous"
        onLoad={renderDither}
        className="h-full w-full object-cover"
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full transition-[opacity,filter,transform] duration-500 group-hover:scale-[1.03] group-hover:contrast-125 ${
          isRendered ? "opacity-75 group-hover:opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
