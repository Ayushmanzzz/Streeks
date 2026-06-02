export default function Momentum() {
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
                17 of the last 21 days won
              </h2>
  
              <p className="mt-4 text-xl text-zinc-400">
                Consistency compounds. Keep the streak alive.
              </p>
            </div>
  
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-zinc-500 text-sm">
                  Win Rate
                </p>
  
                <h3 className="mt-2 text-7xl font-bold text-[#00E676]">
                  81%
                </h3>
              </div>
            </div>
          </div>
  
          <div className="mt-12">
            <p className="mb-6 text-xs uppercase tracking-[0.2em] text-zinc-600">
              Last 90 Days
            </p>
  
            <div
                className="grid gap-2"
                style={{
                    gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
                }}
                >
              {[
                1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,0,1,1,
                1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,
                1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,
                1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,
                1,1,0,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,
              ].map((day, index) => (
                <div
                  key={index}
                  className={`
                    h-4
                    w-4
                    rounded-[4px]
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
      </section>
    );
  }