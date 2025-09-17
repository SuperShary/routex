export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-6 pt-24 pb-16">
      {/* Banner */}
      <div className="mb-6 overflow-hidden rounded-2xl border bg-card/50">
        <img
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/5ab920c5-877f-4dfc-980f-3d02ee66e478/generated_images/high-fidelity-dark-ui-banner-for-an-ai-p-d64c9909-20250917104505.jpg?"
          alt="RouteX Templates banner"
          className="h-40 w-full object-cover sm:h-48 md:h-56"
          loading="lazy"
        />
      </div>

      <h1 className="text-2xl font-semibold">Templates</h1>
      <p className="text-muted-foreground">Template library coming soon.</p>
    </main>
  );
}