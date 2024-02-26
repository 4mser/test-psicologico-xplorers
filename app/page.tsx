import Test from "@/components/test-psicologico";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex max-h-[100dvh] flex-col items-center justify-between p-4">
      <Test />
    </main>
  );
}
