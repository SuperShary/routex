"use client";
import * as React from "react";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Copy, Play, Wand2, ShieldCheck, Route as RouteIcon, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const PlaygroundShell: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [output, setOutput] = React.useState<string>("");
  const [taskSpecId, setTaskSpecId] = React.useState<number | null>(null);
  const [taskSpecJson, setTaskSpecJson] = React.useState<string>(`{\n  "family": "write",\n  "goal": "Summarize text",\n  "tags": ["summary", "demo"]\n}`);
  const [system, setSystem] = React.useState("");
  const [instructions, setInstructions] = React.useState("");
  const [userMsg, setUserMsg] = React.useState("");
  const [selectedModel, setSelectedModel] = React.useState<string>("gpt-4o");

  // Fetch one TaskSpec id to attach runs to
  React.useEffect(() => {
    const fetchTaskSpec = async () => {
      try {
        const res = await fetch("/api/task-specs?limit=1");
        if (!res.ok) return; // Seeds may not exist yet
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && data[0]?.id) {
          setTaskSpecId(Number(data[0].id));
        }
      } catch {}
    };
    fetchTaskSpec();
  }, []);

  const requireAuth = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
    if (!token) {
      toast.error("Please sign in to run this action");
      router.push("/login?redirect=" + encodeURIComponent("/app/playground"));
      return null;
    }
    return token;
  };

  const estimateTokens = (text: string) => Math.max(1, Math.ceil(text.split(/\s+/).length * 1.3));
  const estimateCostUsd = (tokens: number) => Number(((tokens / 1000) * 0.01).toFixed(4));

  const copyTaskSpec = async () => {
    try {
      await navigator.clipboard.writeText(taskSpecJson);
      toast.success("TaskSpec copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleRun = async () => {
    const token = requireAuth();
    if (!token) return;
    if (!taskSpecId) {
      toast.error("No TaskSpec found. Create one in Templates first.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      // Build synthetic output from prompts
      const composed = [
        system && `System: ${system}`,
        instructions && `Instructions: ${instructions}`,
        userMsg && `User: ${userMsg}`,
      ].filter(Boolean).join("\n\n");
      const tokens = estimateTokens(taskSpecJson + "\n" + composed);
      const costUsd = estimateCostUsd(tokens);
      const latencyMs = Math.floor(400 + Math.random() * 800);

      // Simulate streaming feedback to UI
      const chunks = ["Compiling TaskSpec...", `Routing to ${selectedModel}...`, "Executing run...", "Verifying output...", "Done!"];
      for (const c of chunks) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 350));
        setOutput((prev) => (prev ? prev + "\n" : prev) + c);
      }

      const res = await fetch("/api/runs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskSpecId,
          model: selectedModel,
          tokens,
          costUsd,
          latencyMs,
          output: composed || "No content provided",
          status: "succeeded",
          verdict: { score: 1, notes: "Auto-verified demo" },
          learn: { hints: ["Prefer concise summaries", "Preserve key facts"] },
          orgId: 1,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || "Run failed");
        return;
      }
      const data = await res.json();
      setOutput((prev) => (prev ? prev + "\n\n" : "") + `Saved run #${data?.id ?? "?"} (${selectedModel}) — ${tokens} tok, $${costUsd}`);
      toast.success("Run saved");
    } catch (e: any) {
      toast.error("Run failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const token = requireAuth();
    if (!token || !taskSpecId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/runs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskSpecId,
          model: selectedModel,
          tokens: 1,
          costUsd: 0,
          latencyMs: 50,
          output: "Verification complete",
          status: "succeeded",
          verdict: { passed: true },
          orgId: 1,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || "Verify failed");
        return;
      }
      toast.success("Verified");
    } catch {
      toast.error("Verify failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRepair = async () => {
    const token = requireAuth();
    if (!token || !taskSpecId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/runs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskSpecId,
          model: selectedModel,
          tokens: 50,
          costUsd: 0.0005,
          latencyMs: 120,
          output: "Applied repairs to TaskSpec",
          status: "succeeded",
          learn: { repaired: true },
          orgId: 1,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || "Repair failed");
        return;
      }
      toast.success("Repaired");
    } catch {
      toast.error("Repair failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)]">
      {/* Playground banner */}
      <div className="mb-3 overflow-hidden rounded-2xl border bg-card/50">
        <img
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/5ab920c5-877f-4dfc-980f-3d02ee66e478/generated_images/high-fidelity-dark-ui-banner-for-an-ai-p-d64c9909-20250917104505.jpg"
          alt="RouteX Playground banner illustration"
          className="h-40 w-full object-cover sm:h-48 md:h-56"
          loading="lazy"
        />
      </div>

      <ResizablePanelGroup direction="horizontal" className="rounded-2xl border bg-card/50 p-2">
        <ResizablePanel defaultSize={32} minSize={24} className="p-2">
          <Card className="h-full p-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">TaskSpec</h3>
              <Button size="sm" variant="ghost" className="gap-1" onClick={copyTaskSpec}><Copy className="size-4" /> Copy</Button>
            </div>
            <Tabs defaultValue="json" className="h-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="json">JSON</TabsTrigger>
                <TabsTrigger value="form">Form</TabsTrigger>
              </TabsList>
              <TabsContent value="json" className="mt-3 h-[calc(100%-3rem)]">
                <Textarea className="h-full font-mono" value={taskSpecJson} onChange={(e) => setTaskSpecJson(e.target.value)} />
              </TabsContent>
              <TabsContent value="form" className="mt-3 space-y-3">
                <Input placeholder="Goal" onChange={(e) => setInstructions(e.target.value)} />
                <Textarea placeholder="Context" onChange={(e) => setSystem(e.target.value)} />
                <Input placeholder="Tags (comma separated)" />
              </TabsContent>
            </Tabs>
          </Card>
        </ResizablePanel>
        <ResizableHandle className="w-2" />
        <ResizablePanel defaultSize={36} minSize={28} className="p-2">
          <Card className="h-full p-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Prompt Bundle</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">System</Badge>
                <Badge variant="secondary">Instructions</Badge>
                <Badge variant="secondary">User</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <Textarea placeholder="System prompt" className="min-h-24" value={system} onChange={(e) => setSystem(e.target.value)} />
              <Textarea placeholder="Instructions" className="min-h-24" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
              <Textarea placeholder="User message" className="min-h-24" value={userMsg} onChange={(e) => setUserMsg(e.target.value)} />
            </div>
          </Card>
        </ResizablePanel>
        <ResizableHandle className="w-2" />
        <ResizablePanel defaultSize={32} minSize={24} className="p-2">
          <Card className="h-full p-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Model Selector</h3>
              <Button size="sm" variant="outline" className="gap-1" onClick={() => { setSelectedModel("gpt-4o"); toast.info("Recommended: gpt-4o"); }}><RouteIcon className="size-4" /> Recommend</Button>
            </div>
            <div className="space-y-3">
              {["gpt-4o", "claude-3.5-sonnet", "gemini-1.5-pro"].map((m) => (
                <div key={m} className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <div className="font-medium">{m}</div>
                    <div className="text-muted-foreground text-xs">cost • latency • quality</div>
                  </div>
                  <Button size="sm" variant={selectedModel === m ? "default" : "secondary"} className="gap-1" onClick={() => setSelectedModel(m)}>
                    {selectedModel === m ? "In use" : "Use"} <ChevronRight className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>

      <div className="mt-3 rounded-2xl border bg-card/50 p-3">
        <div className="mb-2 flex items-center gap-2">
          <Button size="sm" onClick={handleRun} disabled={loading} className="gap-1">
            <Play className="size-4" /> {loading ? "Running..." : "Run"}
          </Button>
          <Button size="sm" variant="secondary" className="gap-1" onClick={handleVerify} disabled={loading}><ShieldCheck className="size-4" /> Verify</Button>
          <Button size="sm" variant="secondary" className="gap-1" onClick={handleRepair} disabled={loading}><Wand2 className="size-4" /> Repair</Button>
        </div>
        <Card className="min-h-36 p-3">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          ) : (
            <pre className="whitespace-pre-wrap text-sm">{output || "Output stream will appear here..."}</pre>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PlaygroundShell;