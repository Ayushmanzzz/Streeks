type Props = {
  streak: number;
};

export default function Hero({
  streak,
}: Props) {
  return (
    <section className="pt-12">
      <p className="text-zinc-500 text-xl">
        Good Evening, Ayushman
      </p>

      <h1 className="mt-6 text-7xl font-bold tracking-tight">
        {streak} Days Won
      </h1>

      <p className="mt-4 text-xl text-zinc-400">
        Keep the momentum alive.
      </p>
    </section>
  );
}