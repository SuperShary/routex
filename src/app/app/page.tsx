import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Route, Wand2, LayoutDashboard } from "lucide-react";

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-24 pb-16">
      <section className="mb-8">
        <h1 className="text-2xl font-semibold">Welcome to RouteX</h1>
        <p className="text-muted-foreground">Turn plain ideas into model-ready prompts.</p>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-5">
          <h3 className="mb-1 font-medium">Playground</h3>
          <p className="text-muted-foreground mb-4 text-sm">Compile → Route → Execute</p>
          <Button asChild size="sm"><Link href="/app/playground">Open Playground</Link></Button>
        </Card>
        <Card className="p-5">
          <h3 className="mb-1 font-medium">Wizard</h3>
          <p className="text-muted-foreground mb-4 text-sm">Intent to TaskSpec</p>
          <Button asChild size="sm" variant="secondary"><Link href="/app/wizard">Open Wizard</Link></Button>
        </Card>
        <Card className="p-5">
          <h3 className="mb-1 font-medium">Templates</h3>
          <p className="text-muted-foreground mb-4 text-sm">Save & reuse TaskSpecs</p>
          <Button asChild size="sm" variant="outline"><Link href="/app/templates">Browse</Link></Button>
        </Card>
      </div>
    </main>
  );
}