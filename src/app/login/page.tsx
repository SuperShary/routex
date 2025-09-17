import LoginForm from "@/components/auth/LoginForm";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-6 pt-28 pb-16">
      <div className="grid place-items-center">
        <LoginForm />
      </div>
    </main>
  );
}