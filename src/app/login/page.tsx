import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-6 pt-28 pb-16">
      <div className="grid place-items-center">
        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}