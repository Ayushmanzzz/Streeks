type Props = {
  streak: number;
  weeklyRate: number;
};

export default function Momentum({
  streak,
  weeklyRate,
}: Props) {
  return (
    <section className="mt-16">

      <div
        className="
          rounded-[32px]
          border
          border-[#00E676]/20
          bg-gradient-to-b
          from-[#00E676]/[0.06]
          to-white/[0.02]
          p-10
          backdrop-blur-xl
        "
      >

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-zinc-500 uppercase tracking-[0.2em] text-xs">
              Momentum
            </p>

            <h2 className="mt-4 text-5xl font-bold tracking-tight">
              {streak} Days Won
            </h2>

            <p className="mt-4 text-xl text-zinc-400">
              Consistency compounds. Keep the streak alive.
            </p>

          </div>

          <div className="flex items-center justify-center">

            <div className="text-center">

              <p className="text-zinc-500 text-sm">
                Weekly Win Rate
              </p>

              <h3 className="mt-2 text-7xl font-bold text-[#00E676]">
                {weeklyRate.toFixed(0)}%
              </h3>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}