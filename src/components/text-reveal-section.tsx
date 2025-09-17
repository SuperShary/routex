import React from "react";

import { TextReveal } from "@/components/magicui/text-reveal";

const TextRevealSection = () => {
  return (
    <section className="dark bg-background my-0 ">
      <div className=" flex flex-col items-center justify-center">
        <TextReveal className="font-medium">
          RouteX is the intelligent prompt engineering platform that transforms
          your plain ideas into model‑ready specifications. Compile, route, and
          verify outputs across multiple AI providers with zero prompt expertise.
        </TextReveal>
      </div>
    </section>
  );
};

export { TextRevealSection };