"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

const skillsData = [
  { subject: "Frontend", A: 95, fullMark: 100 },
  { subject: "Backend / API", A: 70, fullMark: 100 },
  { subject: "DevOps / CI/CD", A: 45, fullMark: 100 },
  { subject: "System Design", A: 75, fullMark: 100 },
  { subject: "GenAI", A: 85, fullMark: 100 },
  { subject: "UX / UI", A: 60, fullMark: 100 },
];

const compositionData = [
  { name: "TypeScript", value: 45, color: "#3B82F6" },
  { name: "React / Next", value: 30, color: "#60A5FA" },
  { name: "Node / Python", value: 20, color: "#93C5FD" },
  { name: "SQL / API", value: 5, color: "#1E40AF" },
];

const EXPERIENCE = [
  {
    role: "Bachelor Data Science",
    company: "Univerity Ca' Foscari Venice",
    period: "2023 - PRESENT",
    description:
      "Degree in data science from the Ca' Foscari University of Venice.",
  },
  {
    role: "Hackathon VarGroup Rimini",
    company: "VarGroup",
    period: "2023",
    description:
      "Attended Hackathon VarGroup in Rimini,Italy. Third place at the competition.",
  },
  {
    role: "Software Developer",
    company: "Elettronica S.p.a",
    period: "2022 - 2022",
    description:
      "Elettronica Veneta S.p.a. software developer: main focus on improve the company's website and scraping it.",
  },
  {
    role: "IT Specialist Degree",
    company: "ITIS Antonio Scarpa",
    period: "2018 - 2023",
    description: "High school diploma in IT specialization.",
  },
];

export const SkillMatrix: React.FC = () => {
  return (
    <div
      id="skills"
      className="w-full bg-palantir-black py-24 relative scroll-mt-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 border-l-2 border-white pl-6">
          <h2 className="text-3xl font-sans font-light tracking-tight text-white mb-2">
            Technical Arsenal
          </h2>
          <p className="text-gray-400 max-w-xl text-sm">
            Quantified proficiency and contribution metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          {/* Chart 1: Radar - Hollistic View */}
          <div className="border border-palantir-gray bg-palantir-dark/30 p-8 h-[400px] flex flex-col">
            <h3 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-6 flex justify-between shrink-0">
              <span>Core Competencies</span>
              <span>FIG 1.0</span>
            </h3>
            <div className="flex-1 min-h-0 w-full flex">
              <div className="flex-1 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    data={skillsData}
                  >
                    <PolarGrid stroke="#333" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#999", fontSize: 10 }}
                      className="font-mono"
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name="Proficiency"
                      dataKey="A"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fill="#3B82F6"
                      fillOpacity={0.2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Chart 2: Donut - Codebase Composition */}
          <div className="border border-palantir-gray bg-palantir-dark/30 p-8 h-[400px] flex flex-col">
            <h3 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-6 flex justify-between shrink-0">
              <span>Codebase Composition</span>
              <span>FIG 2.0</span>
            </h3>
            <div className="flex-1 min-h-0 w-full flex">
              <div className="flex-1 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={compositionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {compositionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider ml-1 mr-4">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="border-t border-palantir-gray pt-12">
          <div className="mb-12 border-l-2 border-white pl-6">
            <h3 className="text-2xl font-sans font-light tracking-tight text-white mb-2">
              Operational History
            </h3>
            <p className="text-gray-400 max-w-xl text-sm">
              Chronological record of deployments and roles.
            </p>
          </div>

          <div className="border-t border-palantir-gray">
            {EXPERIENCE.map((job, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8 border-b border-palantir-gray group hover:bg-white/5 transition-colors px-4 md:px-0"
              >
                <div className="md:col-span-3">
                  <div className="font-mono text-xs text-blue-400 mb-1 tracking-widest uppercase">
                    {job.period}
                  </div>
                  <div className="font-sans font-medium text-white">
                    {job.company}
                  </div>
                </div>
                <div className="md:col-span-9">
                  <h4 className="text-lg font-light text-gray-200 mb-2 group-hover:text-blue-200 transition-colors">
                    {job.role}
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-3xl">
                    {job.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
