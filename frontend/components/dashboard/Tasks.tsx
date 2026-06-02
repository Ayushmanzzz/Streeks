export default function Tasks() {
    const tasks = [
      "Finish DSA Sheet",
      "Deploy Streeks",
      "Review Resume",
    ];
  
    return (
      <section className="mt-16">
        <div
          className="
            rounded-[32px]
            border
            border-white/10
            bg-gradient-to-b
            from-white/[0.05]
            to-white/[0.02]
            p-8
            backdrop-blur-xl
          "
        >
          <h2 className="text-3xl font-semibold">
            Tasks Today
          </h2>
  
          <div className="mt-8 space-y-5">
            {tasks.map((task) => (
              <div
                key={task}
                className="
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-white/5
                  px-5
                  py-4
                  transition-all
                  duration-300
                  hover:border-white/10
                  hover:bg-white/[0.02]
                "
              >
                <div
                  className="
                    h-3
                    w-3
                    rounded-full
                    border
                    border-zinc-500
                  "
                />
  
                <p className="text-lg">
                  {task}
                </p>
              </div>
            ))}
          </div>
  
          <div className="mt-8 border-t border-white/5 pt-6">
            <p className="text-sm text-zinc-500">
              {tasks.length} Remaining
            </p>
          </div>
        </div>
      </section>
    );
  }