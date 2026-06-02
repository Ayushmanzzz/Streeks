export default function NonNegotiables() {
    const habits = [
      {
        title: "DSA",
        streak: 9,
        today: "2 / 3 Problems",
        progress: "67%",
      },
      {
        title: "Gym",
        streak: 15,
        today: "Completed",
        progress: "100%",
      },
      {
        title: "Reading",
        streak: 21,
        today: "8 / 10 Pages",
        progress: "80%",
      },
    ];
  
    const heatmap = [
      1, 1, 0, 1, 1, 1, 1,
      1, 1, 1, 0, 1, 1, 1,
      1, 0, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 0, 1, 1,
    ];
  
    return (
      <section className="mt-16 pt-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-semibold">
            Non-Negotiables
          </h2>
  
          <button className="text-zinc-500 transition hover:text-white">
            View All →
          </button>
        </div>
  
        <div className="flex gap-6 overflow-x-auto overflow-y-visible pt-2 pb-4 px-1">
          {habits.map((habit) => (
            <div
              key={habit.title}
              className="
                w-[85vw]
                max-w-[420px]
                flex-shrink-0
                box-border
                h-[500px]
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
              {/* Title */}
              <h3 className="text-4xl font-bold tracking-tight">
                {habit.title}
              </h3>
  
              {/* Current Streak */}
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                  Current Streak
                </p>
  
                <p className="mt-2 text-2xl font-medium">
                  {habit.streak} Days
                </p>
              </div>
  
              {/* Today */}
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                  Today
                </p>
  
                <p className="mt-2 text-lg">
                  {habit.today}
                </p>
              </div>
  
              {/* Progress */}
              <div className="mt-8">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-zinc-600">
                    Progress
                  </span>
  
                  <span className="text-sm text-zinc-400">
                    {habit.progress}
                  </span>
                </div>
  
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-[#00E676]"
                    style={{
                      width: habit.progress,
                    }}
                  />
                </div>
              </div>
  
              {/* Heatmap */}
              <div className="mt-12">
                <p className="mb-6 text-xs uppercase tracking-[0.2em] text-zinc-600">
                  Last 28 Days
                </p>
  
                <div className="grid grid-cols-7 gap-2">
                  {heatmap.map((day, index) => (
                    <div
                      key={index}
                      className={`
                        h-3
                        w-3
                        rounded-sm
                        ${
                          day
                            ? "bg-[#00E676]"
                            : "bg-[#1A1A1A]"
                        }
                      `}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }