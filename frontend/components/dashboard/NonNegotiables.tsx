import Link from "next/link";

type NonNegotiable = {
  id: number;
  title: string;
  current_streak: number;
  longest_streak: number;
  completion_rate: number;
  today_completed: boolean;
  today_progress: number | null;
  target_value: number;
  unit: string;
  heatmap: boolean[];
};

type Props = {
  habits: NonNegotiable[];
};

export default function NonNegotiables({
  habits,
}: Props) {
  return (
    <section className="mt-16 pt-6">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-semibold">
          Non-Negotiables
        </h2>

        <Link
          href="/non-negotiables"
          className="text-zinc-500 transition hover:text-white"
        >
          View All →
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto overflow-y-visible pt-2 pb-4 px-1">

        {habits.map((habit) => (
          <Link
            href={`/non-negotiables/${habit.id}`}
            key={habit.id}
          >
            <div
              className="
                w-[85vw]
                max-w-[420px]
                flex-shrink-0
                box-border
                h-auto
                rounded-[32px]
                border
                border-white/10
                bg-gradient-to-b
                from-white/[0.05]
                to-white/[0.02]
                p-8
                backdrop-blur-xl
                transition-all
                duration-300
                hover:scale-[1.015]
                hover:border-[#00E676]/30
              "
            >
              <h3 className="text-4xl font-bold tracking-tight">
                {habit.title || "Untitled"}
              </h3>

              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                  Current Streak
                </p>

                <p className="mt-2 text-2xl font-medium">
                  {habit.current_streak} Days
                </p>
              </div>

              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                  Today
                </p>

                <p
                  className={`mt-2 text-lg ${
                    habit.today_completed
                      ? "text-[#00E676]"
                      : "text-white"
                  }`}
                >
                  {habit.today_completed
                    ? "Completed ✓"
                    : `${habit.today_progress ?? 0} / ${habit.target_value} ${habit.unit}`}
                </p>
              </div>

              <div className="mt-8">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-zinc-600">
                    Completion Rate
                  </span>

                  <span className="text-sm text-zinc-400">
                    {habit.completion_rate}%
                  </span>
                </div>

                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-[#00E676]"
                    style={{
                      width: `${habit.completion_rate}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-10">
                <div className="grid grid-cols-2 gap-6">

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                      Longest
                    </p>

                    <p className="mt-2 text-xl">
                      {habit.longest_streak} Days
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                      Target
                    </p>

                    <p className="mt-2 text-xl">
                      {habit.target_value}{" "}
                      {habit.unit}
                    </p>
                  </div>

                </div>
              </div>

              <div className="mt-6">
                <p className="mb-4 text-xs uppercase tracking-[0.2em] text-zinc-600">
                  Last 28 Days
                </p>

                <div
                  className="
                    grid
                    grid-cols-7
                    gap-2
                  "
                >
                  {habit.heatmap.map(
                    (day, index) => (
                      <div
                        key={index}
                        className={`
                          h-4
                          w-4
                          rounded-[2px]
                          transition-all
                          ${
                            day
                              ? "bg-[#00E676]"
                              : "bg-[#1A1A1A]"
                          }
                        `}
                      />
                    )
                  )}
                </div>
              </div>

            </div>
          </Link>
        ))}

      </div>
    </section>
  );
}