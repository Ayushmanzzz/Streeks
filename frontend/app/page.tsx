import Navbar from "@/components/Navbar";
import Hero from "@/components/dashboard/Hero";
import Metrics from "@/components/dashboard/Metrics";
import NonNegotiables from "@/components/dashboard/NonNegotiables";
import Tasks from "@/components/dashboard/Tasks";
import Momentum from "@/components/dashboard/Momentum";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />

      <div className="mx-auto max-w-[1600px] px-10">
      <Hero />

      <Metrics />

      <NonNegotiables />

      <Tasks />

      <Momentum />
      </div>
    </main>
  );
}