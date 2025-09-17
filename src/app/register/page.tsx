import RegisterForm from "@/components/auth/RegisterForm";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-6 pt-28 pb-16">
      <div className="grid place-items-center">
        <RegisterForm />
      </div>
    </main>
  );
}