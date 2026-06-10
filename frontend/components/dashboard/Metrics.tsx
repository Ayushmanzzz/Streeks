type Props = {
  dailyWin: boolean;
  activeSystems: number;
  weeklyRate: number;
  activeTasks: number;
  overdueTasks: number;
};

export default function Metrics({
  dailyWin,
  activeSystems,
  weeklyRate,
  activeTasks,
  overdueTasks,
}: Props) {
  return (
    <section className="mt-10">

      <div className="grid gap-5 md:grid-cols-5">

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <p className="text-zinc-500 text-sm">
            Daily Win
          </p>

          <h3
            className={`mt-3 text-3xl font-semibold ${
              dailyWin
                ? "text-[#00E676]"
                : "text-red-400"
            }`}
          >
            {dailyWin
              ? "✓ Won"
              : "✗ Lost"}
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <p className="text-zinc-500 text-sm">
            Active Systems
          </p>

          <h3 className="mt-3 text-3xl font-semibold">
            {activeSystems}
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <p className="text-zinc-500 text-sm">
            Active Tasks
          </p>

          <h3 className="mt-3 text-3xl font-semibold">
            {activeTasks}
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <p className="text-zinc-500 text-sm">
            Overdue Tasks
          </p>

          <h3
            className={`mt-3 text-3xl font-semibold ${
              overdueTasks > 0
                ? "text-red-400"
                : "text-[#00E676]"
            }`}
          >
            {overdueTasks}
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <p className="text-zinc-500 text-sm">
            Weekly Rate
          </p>

          <h3 className="mt-3 text-3xl font-semibold">
            {weeklyRate.toFixed(0)}%
          </h3>
        </div>

      </div>

    </section>
  );
}