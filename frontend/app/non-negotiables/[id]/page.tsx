"use client";

import { useEffect, useState } from "react";
import {
    getSummary,
    getHeatmap,
    getLogs,
  } from "@/services/nonNegotiableAnalytics";
import Link from "next/link";

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

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { id } = await params;

        const summaryData =
        await getSummary(
            Number(id)
        );

        const heatmapData =
            await getHeatmap(
                Number(id)
            );

            const logsData =
            await getLogs(
                Number(id)
            );

            setSummary(summaryData);
            setHeatmap(heatmapData);
            setLogs(logsData);
            
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params]);

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

      </div>

      <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.03] p-8">

        <p className="mb-8 text-zinc-500 uppercase tracking-[0.2em] text-xs">
          Heatmap
        </p>

        <div className="grid grid-cols-10 gap-3">

          {heatmap.map((day) => (
            <div
              key={day.date}
              className={`
                h-6
                w-6
                rounded-md
                ${
                  day.completed
                    ? "bg-[#00E676]"
                    : "bg-[#1A1A1A]"
                }
              `}
              title={day.date}
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