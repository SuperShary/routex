"use client";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  ArrowUp,
  Globe,
  Play,
  Plus,
  Signature,
  Sparkles,
  GitFork,
  Eye,
  Star,
  Brain,
  Workflow,
  Zap,
  Database,
  Shield,
  Plug,
  Sliders,
  Route,
  ShieldCheck,
} from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="features">
      <div className="py-24">
        <div className="mx-auto w-full max-w-3xl px-6">
          <motion.h2
            initial={{ opacity: 0, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-foreground text-balance text-3xl font-semibold md:text-4xl"
          >
            <span className="text-muted-foreground">
              Turn plain ideas into model‑ready prompts.
            </span>{" "}
            No prompt skills required.
          </motion.h2>
          <div className="mt-12 grid gap-12 sm:grid-cols-2">
            {/* Feature 1 */}
            <div className="col-span-full space-y-4">
              <Card className="overflow-hidden px-6 sm:col-span-2">
                <motion.div
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mask-b-from-75% mx-auto -mt-2 max-w-sm px-2 pt-8"
                >
                  <CompileIllustration />
                </motion.div>
              </Card>
              <div className="max-w-md sm:col-span-3">
                <motion.h3 className="text-foreground text-lg font-semibold">
                  Compile Your Intent Into Prompts.
                </motion.h3>
                <motion.p className="text-muted-foreground mt-3 text-balance">
                  Describe what you want in plain language. RouteX transforms 
                  your goals into optimized, structured prompts.
                </motion.p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="grid grid-rows-[1fr_auto] space-y-4">
              <Card className="p-6">
                <motion.div
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <RouteIllustration />
                </motion.div>
              </Card>
              <div>
                <h3 className="text-foreground text-lg font-semibold">
                  Smart Model Routing & Selection.
                </h3>
                <p className="text-muted-foreground mt-3 text-balance">
                  Automatically choose the best model based on your cost, 
                  latency, and quality requirements.
                </p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="grid grid-rows-[1fr_auto] space-y-4">
              <Card className="overflow-hidden p-6">
                <motion.div
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <VerifyIllustration />
                </motion.div>
              </Card>
              <div>
                <h3 className="text-foreground text-lg font-semibold">
                  Verify & Repair Outputs.
                </h3>
                <p className="text-muted-foreground mt-3 text-balance">
                  Validate results against your criteria and automatically 
                  repair outputs that don't meet standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const CompileIllustration = () => {
  return (
    <Card
      aria-hidden
      className="p-4 transition-transform duration-200 group-hover:translate-y-0"
    >
      {/* Intent Input */}
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-foreground/5 flex size-8 items-center justify-center rounded-lg border">
          <Sliders className="size-4 text-foreground/60" />
        </div>
        <div>
          <div className="text-sm font-medium">Intent Compiler</div>
          <div className="text-muted-foreground text-xs">Transform ideas to prompts</div>
        </div>
      </div>

      {/* Input Text */}
      <div className="mb-4 bg-foreground/5 rounded-lg p-3 border">
        <div className="text-muted-foreground text-xs font-medium mb-2">
          Your Input
        </div>
        <div className="text-xs text-foreground/80">
          "Write a technical blog post about..."
        </div>
      </div>

      {/* Compilation Process */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs">
          <div className="bg-foreground/40 size-1.5 rounded-full"></div>
          <span className="text-muted-foreground">Analyzing intent...</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="bg-foreground/40 size-1.5 rounded-full"></div>
          <span className="text-muted-foreground">Building TaskSpec...</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="bg-foreground/40 size-1.5 rounded-full"></div>
          <span className="text-muted-foreground">Optimizing prompts...</span>
        </div>
      </div>

      {/* Output */}
      <div className="bg-foreground/10 rounded-lg p-3 border">
        <div className="text-xs font-medium text-foreground/80 mb-1">
          Compiled TaskSpec
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          &#123;"family": "write", "goal": "..."&#125;
        </div>
      </div>
    </Card>
  );
};

const RouteIllustration = () => {
  return (
    <Card aria-hidden className="p-4">
      {/* Router Hub */}
      <div className="mb-4 flex justify-center">
        <div className="bg-foreground/10 flex size-10 items-center justify-center rounded-full border">
          <Route className="size-5 text-foreground/60" />
        </div>
      </div>

      {/* Router Status */}
      <div className="mb-4 text-center">
        <div className="text-sm font-medium">Smart Router</div>
        <div className="text-muted-foreground text-xs flex items-center justify-center gap-1 mt-1">
          <div className="bg-foreground/40 size-1.5 rounded-full"></div>
          Analyzing options
        </div>
      </div>

      {/* Model Options */}
      <div className="space-y-2">
        <div className="flex items-center justify-between bg-foreground/5 rounded-lg p-2 border">
          <div className="text-xs">
            <div className="font-medium text-foreground/80">GPT-4</div>
            <div className="text-muted-foreground">High quality</div>
          </div>
          <div className="text-xs text-muted-foreground">$0.03</div>
        </div>

        <div className="flex items-center justify-between bg-foreground/10 rounded-lg p-2 border-2 border-foreground/20">
          <div className="text-xs">
            <div className="font-medium text-foreground">Claude-3</div>
            <div className="text-foreground/80">Recommended</div>
          </div>
          <div className="text-xs text-foreground">$0.02</div>
        </div>

        <div className="flex items-center justify-between bg-foreground/5 rounded-lg p-2 border">
          <div className="text-xs">
            <div className="font-medium text-foreground/80">Gemini</div>
            <div className="text-muted-foreground">Fast & cheap</div>
          </div>
          <div className="text-xs text-muted-foreground">$0.01</div>
        </div>
      </div>

      {/* Decision Indicator */}
      <div className="mt-4 text-center">
        <div className="text-muted-foreground text-xs">
          Best match for your constraints
        </div>
      </div>
    </Card>
  );
};

const VerifyIllustration = () => {
  return (
    <div aria-hidden className="relative">
      {/* Main Verification Hub */}
      <Card className="p-4">
        <div className="mb-3 flex items-center justify-center">
          <div className="bg-foreground/10 flex size-8 items-center justify-center rounded-full border">
            <ShieldCheck className="size-4 text-foreground/60" />
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="text-sm font-medium">Output Verifier</div>
          <div className="text-muted-foreground text-xs">Quality assurance</div>
        </div>

        {/* Verification Checks */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="bg-green-500 size-2 rounded-full"></div>
            <span className="text-foreground/80">Length requirements</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="bg-green-500 size-2 rounded-full"></div>
            <span className="text-foreground/80">Style guidelines</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="bg-yellow-500 size-2 rounded-full"></div>
            <span className="text-foreground/80">Technical accuracy</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="bg-green-500 size-2 rounded-full"></div>
            <span className="text-foreground/80">Format compliance</span>
          </div>
        </div>

        {/* Verdict */}
        <div className="mt-4 bg-foreground/5 rounded-lg p-2 border text-center">
          <div className="text-xs font-medium text-foreground/80">
            Verdict: Pass with suggestions
          </div>
        </div>
      </Card>
    </div>
  );
};