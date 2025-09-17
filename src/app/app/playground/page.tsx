import PlaygroundShell from "@/components/app/PlaygroundShell";

export default function Page() {
  return (
    <main className="mx-auto max-w-[1400px] px-6 pt-24 pb-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Playground</h1>
        <p className="text-muted-foreground">Experiment with TaskSpecs, prompts, and models.</p>
      </div>
      <PlaygroundShell />
    </main>
  );
}