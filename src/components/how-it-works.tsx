"use client";
import { MoveUpRight, Star, Sliders, Route, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

const HowItWorks = () => {
  return (
    <section className="" id="how-it-works">
      <div className="mx-auto max-w-7xl px-0 sm:px-8">
        <div className="container max-w-6xl px-4">
          <div className="mx-auto flex  max-w-4xl flex-col  gap-6 ">
            <div className="mb-2 max-w-4xl">
              <motion.h2
                initial={{ opacity: 0, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-foreground text-balance text-3xl font-semibold md:text-5xl"
              >
                <span className="text-muted-foreground">
                  Turn Ideas Into Model‑Ready
                </span>{" "}
                Prompts Instantly
              </motion.h2>
            </div>
            <p className="text-muted-foreground max-w-[30rem] text-balance text-left text-base leading-snug tracking-wide sm:text-lg">
              RouteX compiles your intent, routes to the best model, and
              verifies outputs—no prompt engineering skills required.
            </p>
          </div>
        </div>

        {/* Three key feature cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur border rounded-2xl p-6 hover:bg-card/80 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#1E3A8A] rounded-lg flex items-center justify-center">
                <Sliders className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Compile</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Describe what you want in plain language. RouteX transforms your intent into structured, optimized prompts.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur border rounded-2xl p-6 hover:bg-card/80 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#A855F7] rounded-lg flex items-center justify-center">
                <Route className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Route</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Automatically select the best model for your task, balancing cost, speed, and quality for optimal results.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur border rounded-2xl p-6 hover:bg-card/80 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#16A34A] rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Verify</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Validate outputs against your criteria with intelligent verification and automatic repair suggestions.
            </p>
          </motion.div>
        </div>

        <div className="relative mt-16 aspect-[1.2/1] overflow-hidden sm:-right-[10%] sm:right-auto sm:mt-16 sm:aspect-[2.788990826/1]">
          <div
            aria-hidden
            className="bg-linear-to-b to-background absolute inset-0 z-40 from-transparent from-35% "
          />
          <div className="absolute left-[8%] top-[11%] z-10 aspect-[0.7/1] w-[80%] sm:left-[4%] sm:w-[45%]">
            <div className="size-full [transform:rotateY(-30deg)_rotateX(-18deg)_rotate(-4deg)]">
              <img
                src="https://cdn.dribbble.com/userupload/18075737/file/original-d22337d78029b934b35c781ac7e36d06.png?resize=1504x1128&vertical=center"
                alt=""
                className="block size-full object-cover object-left"
              />
            </div>
          </div>
          <div className="absolute left-[70%] top-0 z-20 aspect-[0.7/1] w-[73%] -translate-x-1/2 sm:left-1/2 sm:w-[38%]">
            <div className="size-full shadow-[-25px_0px_20px_0px_rgba(0,0,0,.04)] [transform:rotateY(-30deg)_rotateX(-18deg)_rotate(-4deg)]">
              <img
                src="/app-ui.png"
                alt=""
                className="block size-full object-cover  object-left"
              />
            </div>
          </div>
          <div className="absolute -right-[45%] top-[3%] z-30 aspect-[0.7/1] w-[85%] sm:-right-[2%] sm:w-[50%]">
            <div className="size-full shadow-[-25px_0px_20px_0px_rgba(0,0,0,.04)] [transform:rotateY(-30deg)_rotateX(-18deg)_rotate(-4deg)]">
              <img
                src="https://cdn.dribbble.com/userupload/18075737/file/original-d22337d78029b934b35c781ac7e36d06.png?resize=1504x1128&vertical=center"
                alt=""
                className="block size-full object-cover object-left"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { HowItWorks };