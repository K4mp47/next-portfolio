import React from "react";
import { Project } from "@/types";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group relative rounded-md border border-palantir-gray bg-palantir-dark hover:border-white/40 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

      {/* Image / Preview Area (Abstract) */}
      <div className="h-48 w-full bg-palantir-gray/20 relative overflow-hidden">
        {project.imageUrl ? (
          <Image
            width={800}
            height={600}
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover filter grayscale contrast-125 opacity-60 group-hover:opacity-80 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-palantir-gray to-black">
            <span className="font-mono text-4xl font-bold text-white/5 opacity-20">
              {project.title.substring(0, 2)}
            </span>
          </div>
        )}
        <div className="absolute rounded-sm top-4 right-4 bg-black border border-white/20 px-2 py-1 uppercase text-white font-mono text-[10px]">
          {/* <span className="text-[10px] font-mono uppercase tracking-widest text-white"> */}
          {project.category}
          {/* </span> */}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 flex flex-col flex-grow z-10">
        <div className="mb-6">
          <h3 className="text-xl font-sans font-semibold text-white mb-2 tracking-tight group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Metrics Grid (Mock Palantir Data feel) */}
        {project.metrics && (
          <div className="grid grid-cols-2 gap-4 border-t border-b border-palantir-gray/50 py-4 mb-6">
            {project.metrics.map((m, i) => (
              <div key={i}>
                <div className="text-[10px] uppercase text-gray-500 tracking-widest mb-1">
                  {m.label}
                </div>
                <div className="text-white font-mono text-sm">{m.value}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto">
          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-[10px] rounded-sm font-mono text-gray-500 border border-gray-800 px-1.5 py-0.5"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action */}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white hover:text-blue-400 transition-colors"
            >
              {project.link.includes("github.com") ? (
                <>View on GitHub</>
              ) : (
                <>View Deployment</>
              )}
              <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
