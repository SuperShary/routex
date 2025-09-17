export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-24 pb-16 space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">RouteX API Docs</h1>
        <p className="text-muted-foreground max-w-2xl">
          Use these endpoints to integrate RouteX features in your app. All requests must include a bearer token.
        </p>
        <div className="overflow-hidden rounded-xl border bg-card">
          <img
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/5ab920c5-877f-4dfc-980f-3d02ee66e478/generated_images/high-fidelity-dark-ui-banner-for-an-ai-p-d64c9909-20250917104505.jpg"
            alt="RouteX API overview"
            className="h-40 w-full object-cover"
          />
        </div>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border p-6 bg-card">
          <h2 className="text-lg font-medium">Base URL</h2>
          <p className="text-sm text-muted-foreground mt-2">All endpoints are relative to:</p>
          <pre className="mt-3 rounded-md bg-muted p-3 text-sm overflow-x-auto">
{`/api`}
          </pre>
        </div>
        <div className="rounded-lg border p-6 bg-card">
          <h2 className="text-lg font-medium">Authentication</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Include your bearer token in the Authorization header for every request.
          </p>
          <pre className="mt-3 rounded-md bg-muted p-3 text-sm overflow-x-auto">
{`Authorization: Bearer <token>`}
          </pre>
          <p className="text-xs text-muted-foreground mt-3">
            In the browser, tokens are stored at localStorage.getItem("bearer_token").
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Endpoints</h2>

        <div className="rounded-lg border p-6 bg-card space-y-4">
          <h3 className="text-base font-medium">Task Specs</h3>
          <p className="text-sm text-muted-foreground">Define tasks and constraints.</p>
          <div className="grid gap-3">
            <Endpoint method="GET" path="/api/task-specs" desc="List task specs" />
            <Snippet code={`curl -s \\
  -H "Authorization: Bearer $TOKEN" \\
  "/api/task-specs?limit=10&offset=0"`} />

            <Endpoint method="POST" path="/api/task-specs" desc="Create a task spec" />
            <Snippet code={`curl -s -X POST \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Crawl Blog","description":"Fetch latest posts"}' \\
  "/api/task-specs"`} />
          </div>
        </div>

        <div className="rounded-lg border p-6 bg-card space-y-4">
          <h3 className="text-base font-medium">Templates</h3>
          <p className="text-sm text-muted-foreground">Prompt and workflow templates.</p>
          <div className="grid gap-3">
            <Endpoint method="GET" path="/api/templates" desc="List templates" />
            <Snippet code={`curl -s -H "Authorization: Bearer $TOKEN" "/api/templates"`} />

            <Endpoint method="POST" path="/api/templates" desc="Create a template" />
            <Snippet code={`curl -s -X POST \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Summarize URL","body":"Summarize: {{url}}"}' \\
  "/api/templates"`} />
          </div>
        </div>

        <div className="rounded-lg border p-6 bg-card space-y-4">
          <h3 className="text-base font-medium">Runs</h3>
          <p className="text-sm text-muted-foreground">Execute templates/specs.</p>
          <div className="grid gap-3">
            <Endpoint method="GET" path="/api/runs" desc="List runs" />
            <Snippet code={`curl -s -H "Authorization: Bearer $TOKEN" "/api/runs?status=completed"`} />

            <Endpoint method="POST" path="/api/runs" desc="Start a run" />
            <Snippet code={`curl -s -X POST \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"templateId":1, "inputs": {"url":"https://example.com"}}' \\
  "/api/runs"`} />
          </div>
        </div>

        <div className="rounded-lg border p-6 bg-card space-y-4">
          <h3 className="text-base font-medium">Lessons</h3>
          <p className="text-sm text-muted-foreground">Learning content.</p>
          <div className="grid gap-3">
            <Endpoint method="GET" path="/api/lessons" desc="List lessons" />
            <Snippet code={`curl -s -H "Authorization: Bearer $TOKEN" "/api/lessons"`} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border p-6 bg-card space-y-4">
        <h2 className="text-lg font-semibold">Errors</h2>
        <p className="text-sm text-muted-foreground">Standard JSON error shape:</p>
        <Snippet code={`{
  "error": true,
  "message": "Unauthorized",
  "code": 401
}`} />
      </section>
    </main>
  );
}

function Endpoint({ method, path, desc }: { method: string; path: string; desc: string }) {
  const color = method === "GET" ? "bg-emerald-600" : method === "POST" ? "bg-blue-600" : method === "PUT" ? "bg-amber-600" : "bg-rose-600";
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className={`inline-flex h-5 shrink-0 items-center justify-center rounded px-2 text-[11px] font-medium text-white ${color}`}>{method}</span>
      <code className="text-foreground/90">{path}</code>
      <span className="text-muted-foreground">— {desc}</span>
    </div>
  );
}

function Snippet({ code }: { code: string }) {
  return (
    <pre className="mt-1 rounded-md bg-muted p-3 text-xs leading-relaxed overflow-x-auto">
      <code>{code}</code>
    </pre>
  );
}