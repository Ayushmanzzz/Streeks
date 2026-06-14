"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getSummary,
  getHeatmap,
  getLogs,
} from "@/services/nonNegotiableAnalytics";

import { logProgress } from "@/services/nonNegotiables";

type Summary = {
  title: string;
  current_streak: number;
  longest_streak: number;
  completion_rate: number;
  target_value: number;
  unit: string;
  today_completed: boolean;
  today_progress: number;
};

type HeatmapDay = {
  date: string;
  completed: boolean;
};

type Log = {
  completed: boolean;
  id: number;
  created_at: string;
  date: string;
  completed_value: number;
  non_negotiable_id: number;
};

export default function NonNegotiableDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [summary, setSummary] =
    useState<Summary | null>(null);

  const [heatmap, setHeatmap] =
    useState<HeatmapDay[]>([]);

  const [logs, setLogs] =
    useState<Log[]>([]);

  const [progress, setProgress] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  async function loadData() {
    try {
      const { id } = await params;

      const [
        summaryData,
        heatmapData,
        logsData,
      ] = await Promise.all([
        getSummary(Number(id)),
        getHeatmap(Number(id)),
        getLogs(Number(id)),
      ]);

      setSummary(summaryData);
      setHeatmap(heatmapData);
      setLogs(logsData);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProgress() {
    try {
      const { id } = await params;

      await logProgress(
        Number(id),
        Number(progress)
      );

      setProgress("");

      await loadData();

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  if (!summary) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        No Data
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white p-10">

      <Link
        href="/non-negotiables"
        className="
          mb-8
          inline-flex
          items-center
          text-zinc-500
          transition
          hover:text-white
        "
      >
        ← Back to Non-Negotiables
      </Link>

      <h1 className="text-6xl font-bold">
        {summary.title}
      </h1>

      <div className="mt-12 grid gap-6 md:grid-cols-3">

        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <p className="text-zinc-500">
            Current Streak
          </p>

          <h2 className="mt-3 text-5xl font-bold text-[#00E676]">
            {summary.current_streak}
          </h2>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <p className="text-zinc-500">
            Longest Streak
          </p>

          <h2 className="mt-3 text-5xl font-bold">
            {summary.longest_streak}
          </h2>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <p className="text-zinc-500">
            Completion Rate
          </p>

          <h2 className="mt-3 text-5xl font-bold">
            {summary.completion_rate}%
          </h2>
        </div>

      </div>

      <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.03] p-8">

        <p className="text-zinc-500 uppercase tracking-[0.2em] text-xs">
          Today's Progress
        </p>

        <h3 className="mt-4 text-4xl font-bold">
          {summary.today_progress}
          /
          {summary.target_value}
          {" "}
          {summary.unit}
        </h3>

        <p
          className={`mt-4 text-xl ${
            summary.today_completed
              ? "text-[#00E676]"
              : "text-red-400"
          }`}
        >
          {summary.today_completed
            ? "Completed ✓"
            : "Not Completed"}
        </p>

        {!summary.today_completed && (

          <div className="mt-8 flex gap-4">

            <input
              type="number"
              value={progress}
              onChange={(e) =>
                setProgress(e.target.value)
              }
              placeholder={`Add ${summary.unit}`}
              className="
                rounded-xl
                border
                border-white/10
                bg-black
                px-4
                py-3
                text-white
              "
            />

            <button
              onClick={handleUpdateProgress}
              className="
                rounded-xl
                bg-[#00E676]
                px-6
                py-3
                font-medium
                text-black
              "
            >
              Update Progress
            </button>

          </div>

        )}

      </div>

      <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.03] p-8">

        <p className="mb-8 text-zinc-500 uppercase tracking-[0.2em] text-xs">
          Heatmap
        </p>

        <div
          className="
            grid
            grid-flow-col
            grid-rows-7
            gap-2
            w-fit
          "
        >
          {heatmap.map((day) => (
            <div
              key={day.date}
              title={day.date}
              className={`
                h-4
                w-4
                rounded-sm
                ${
                  day.completed
                    ? "bg-[#00E676]"
                    : "bg-[#1A1A1A]"
                }
              `}
            />
          ))}
        </div>

      </div>

      <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.03] p-8">

        <p className="mb-8 text-zinc-500 uppercase tracking-[0.2em] text-xs">
          Activity
        </p>

        <div className="space-y-4">

          {logs.map((log) => (

            <div
              key={log.id}
              className="
                flex
                items-center
                justify-between
                rounded-xl
                border
                border-white/5
                p-4
              "
            >
              <div>

                <p className="font-medium">
                  {log.date}
                </p>

                <p className="text-sm text-zinc-500">
                  Progress: {log.completed_value}
                </p>

              </div>

              <div
                className={
                  log.completed
                    ? "text-[#00E676]"
                    : "text-red-400"
                }
              >
                {log.completed
                  ? "Completed ✓"
                  : "Missed ✗"}
              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}