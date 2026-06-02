export default function Metrics() {
    return (
      <section className="mt-10">
        <div className="grid gap-5 md:grid-cols-3">
          <div
            className="
              rounded-[28px]
              border
              border-white/10
              bg-white/[0.03]
              p-6
              backdrop-blur-xl
            "
          >
            <p className="text-zinc-500 text-sm">
              Daily Win
            </p>
  
            <h3 className="mt-3 text-3xl font-semibold text-[#00E676]">
              ✓ Won
            </h3>
          </div>
  
          <div
            className="
              rounded-[28px]
              border
              border-white/10
              bg-white/[0.03]
              p-6
              backdrop-blur-xl
            "
          >
            <p className="text-zinc-500 text-sm">
              Active Systems
            </p>
  
            <h3 className="mt-3 text-3xl font-semibold">
              3
            </h3>
          </div>
  
          <div
            className="
              rounded-[28px]
              border
              border-white/10
              bg-white/[0.03]
              p-6
              backdrop-blur-xl
            "
          >
            <p className="text-zinc-500 text-sm">
              Weekly Rate
            </p>
  
            <h3 className="mt-3 text-3xl font-semibold">
              84%
            </h3>
          </div>
        </div>
      </section>
    );
  }