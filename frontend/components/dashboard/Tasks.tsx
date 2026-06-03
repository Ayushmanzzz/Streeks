import Link from "next/link";

type Task = {
  title: string;
  priority: string;
  completed: boolean;
  due_date: string;
};

type Props = {
  tasks: Task[];
};

export default function Tasks({
  tasks,
}: Props) {
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
            <Link
              href="/tasks"
              key={task.title}
              className="block"
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
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
                <div className="flex items-center gap-4">
                  <div
                    className={`
                      h-3
                      w-3
                      rounded-full
                      border
                      ${
                        task.completed
                          ? "bg-[#00E676] border-[#00E676]"
                          : "border-zinc-500"
                      }
                    `}
                  />

                  <div>
                    <p className="text-lg">
                      {task.title}
                    </p>

                    <p className="text-sm text-zinc-500">
                      {task.priority}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-zinc-500">
                    Due
                  </p>

                  <p className="text-sm">
                    {task.due_date}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 border-t border-white/5 pt-6">
          <p className="text-sm text-zinc-500">
            {
              tasks.filter(
                (task) => !task.completed
              ).length
            }{" "}
            Remaining
          </p>
        </div>
      </div>
    </section>
  );
}