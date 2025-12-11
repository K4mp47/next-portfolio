"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { useForm } from "@formspree/react";

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [state, handleSubmit] = useForm("mdkqpknq");

  useEffect(() => {
    if (state.submitting) {
      setStatus("loading");
    }
    if (state.succeeded) {
      setStatus("success");
    }
  }, [state.succeeded, state.submitting]);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setStatus("loading");
  //
  //   setTimeout(() => {
  //     setStatus("success");
  //     setFormData({ name: "", email: "", message: "" });
  //
  //     // Reset status after a delay
  //     // setTimeout(() => setStatus("idle"), 5000);
  //   }, 1200);
  // };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse">
        </div>
        <h3 className="text-xl font-sans font-light text-white">
          Initiate Contact
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="text-[10px] uppercase tracking-widest text-gray-500 font-mono pl-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-palantir-dark/50 border border-gray-800 focus:border-blue-500 text-gray-200 text-sm p-3 outline-none transition-all placeholder-gray-700"
              placeholder="Jane Doe"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-[10px] uppercase tracking-widest text-gray-500 font-mono pl-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-palantir-dark/50 border border-gray-800 focus:border-blue-500 text-gray-200 text-sm p-3 outline-none transition-all placeholder-gray-700"
              placeholder="jane@corp.com"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="message"
            className="text-[10px] uppercase tracking-widest text-gray-500 font-mono pl-1"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full bg-palantir-dark/50 border border-gray-800 focus:border-blue-500 text-gray-200 text-sm p-3 outline-none transition-all resize-none placeholder-gray-700"
            placeholder="Project details, inquiries, or collaboration opportunities..."
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className={`w-full sm:w-auto min-w-40 flex items-center justify-center gap-3 py-3 px-6 font-mono text-xs uppercase tracking-widest transition-all duration-300 ${
            status === "success"
              ? "bg-emerald-900/20 text-emerald-400 border border-emerald-900/50"
              : "bg-white text-black hover:bg-gray-200 border border-white"
          }`}
        >
          {status === "loading"
            ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Transmitting...</span>
              </>
            )
            : status === "success"
            ? (
              <>
                <CheckCircle size={14} />
                <span>Sent</span>
              </>
            )
            : (
              <>
                <span>Send Message</span>
                <Send size={14} />
              </>
            )}
   
        </button>
      </form>
    </div>
  );
};
