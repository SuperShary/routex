"use client";
import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "@/components/ui/resizable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Copy, Play, Wand2, ShieldCheck, Route as RouteIcon, ChevronRight } from "lucide-react";

export const PlaygroundShell: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [output, setOutput] = React.useState<string>("");

  const runDemo = async () => {
    setLoading(true);
    setOutput("");
    try {
      // Simulate streaming
      const chunks = ["Compiling TaskSpec...", "Routing to best model...", "Executing run...", "Verifying output...", "Done!"];
      for (const c of chunks) {
        await new Promise((r) => setTimeout(r, 600));
        setOutput((prev) => (prev ? prev + "\n" : prev) + c);
      }
      toast.success("Demo run completed");
    } catch {
      toast.error("Run failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)]">
      {/* Playground banner */}
      <div className="mb-3 overflow-hidden rounded-2xl border bg-card/50">
        <img
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/5ab920c5-877f-4dfc-980f-3d02ee66e478/generated_images/high-fidelity-dark-ui-banner-for-an-ai-p-d64c9909-20250917104505.jpg?"
          alt="RouteX Playground banner illustration"
          className="h-40 w-full object-cover sm:h-48 md:h-56"
          loading="lazy"
        />
      </div>

      <PanelGroup direction="horizontal" className="rounded-2xl border bg-card/50 p-2">
        <Panel defaultSize={32} minSize={24} className="p-2">
          <Card className="h-full p-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">TaskSpec</h3>
              <Button size="sm" variant="ghost" className="gap-1"><Copy className="size-4" /> Copy</Button>
            </div>
            <Tabs defaultValue="json" className="h-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="json">JSON</TabsTrigger>
                <TabsTrigger value="form">Form</TabsTrigger>
              </TabsList>
              <TabsContent value="json" className="mt-3 h-[calc(100%-3rem)]">
                <Textarea className="h-full font-mono" placeholder="{\n  \"family\": \"write\",\n  ...\n}" />
              </TabsContent>
              <TabsContent value="form" className="mt-3 space-y-3">
                <Input placeholder="Goal" />
                <Textarea placeholder="Context" />
                <Input placeholder="Tags (comma separated)" />
              </TabsContent>
            </Tabs>
          </Card>
        </Panel>
        <PanelResizeHandle className="w-2" />
        <Panel defaultSize={36} minSize={28} className="p-2">
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
              <Textarea placeholder="System prompt" className="min-h-24" />
              <Textarea placeholder="Instructions" className="min-h-24" />
              <Textarea placeholder="User message" className="min-h-24" />
            </div>
          </Card>
        </Panel>
        <PanelResizeHandle className="w-2" />
        <Panel defaultSize={32} minSize={24} className="p-2">
          <Card className="h-full p-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Model Selector</h3>
              <Button size="sm" variant="outline" className="gap-1"><RouteIcon className="size-4" /> Recommend</Button>
            </div>
            <div className="space-y-3">
              {["gpt-4o", "claude-3.5-sonnet", "gemini-1.5-pro"].map((m) => (
                <div key={m} className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <div className="font-medium">{m}</div>
                    <div className="text-muted-foreground text-xs">cost • latency • quality</div>
                  </div>
                  <Button size="sm" variant="secondary" className="gap-1">Use <ChevronRight className="size-4" /></Button>
                </div>
              ))}
            </div>
          </Card>
        </Panel>
      </PanelGroup>

      <div className="mt-3 rounded-2xl border bg-card/50 p-3">
        <div className="mb-2 flex items-center gap-2">
          <Button size="sm" onClick={runDemo} disabled={loading} className="gap-1">
            <Play className="size-4" /> Run
          </Button>
          <Button size="sm" variant="secondary" className="gap-1"><ShieldCheck className="size-4" /> Verify</Button>
          <Button size="sm" variant="secondary" className="gap-1"><Wand2 className="size-4" /> Repair</Button>
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