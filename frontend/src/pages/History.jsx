import React from "react";
import {
  Clock3Icon,
  MonitorIcon,
  ShieldCheckIcon,
  WifiIcon,
  CalendarIcon,
  MoreVerticalIcon,
  ArrowUpIcon,
} from "lucide-react";
import useSessions from "../hooks/session.js";
import { motion } from "framer-motion";
import { useThemeStore } from "../store/useThemeStore";

const History = () => {
  const { sessions, isLoading } = useSessions();
  const { theme } = useThemeStore();

  console.log("Sessions:", sessions);

  /* ── Stats derived from sessions ── */
  const totalSessions = sessions?.length ?? 0;
  const activeSessions = sessions?.filter((s) => s.isValid).length ?? 0;
  const expiredSessions = sessions?.filter((s) => !s.isValid).length ?? 0;

  const statCardsData = [
    {
      label: "Total Sessions",
      value: totalSessions,
      icon: Clock3Icon,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
      trend: "neutral",
      trendLabel: "All logins",
    },
    {
      label: "Active Sessions",
      value: activeSessions,
      icon: ShieldCheckIcon,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      trend: "up",
      trendValue: activeSessions > 0 ? "Active" : "None",
      trendLabel: "currently valid",
    },
    {
      label: "Expired Sessions",
      value: expiredSessions,
      icon: Clock3Icon,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-500/10",
      trend: "neutral",
      trendLabel: "logged out",
    },
  ];

  return (
    <div className="h-full bg-base-200 p-4 md:p-6 font-sans">
      {/* ── PAGE HEADER ── */}
      <div className="relative mb-6 overflow-hidden flex items-center justify-between rounded-2xl border border-base-300/70 bg-base-200 px-6 py-6 shadow-sm sm:px-8">
        {/* Decorative illustration */}
        <div className="pointer-events-none absolute inset-y-0 right-16 hidden w-64 items-center justify-center sm:flex">
          <svg
            viewBox="0 0 260 140"
            className="h-full w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* soft dot grid */}
            {[0, 1, 2].map((row) =>
              [0, 1, 2, 3].map((col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={12 + col * 10}
                  cy={20 + row * 10}
                  r="2"
                  fill={theme === "MeetFlow-pro" ? "#C7D2FE" : "#4338CA"}
                  opacity="0.6"
                />
              )),
            )}

            {/* left leaf */}
            <path
              d="M40 110 C10 100 5 60 25 30 C45 55 50 90 40 110Z"
              fill={theme === "MeetFlow-pro" ? "#C7D2FE" : "#312E81"}
              opacity={theme === "MeetFlow-pro" ? 0.5 : 0.2}
            />
            <path
              d="M40 110 C25 95 20 65 30 40"
              stroke={theme === "MeetFlow-pro" ? "#A5B4FC" : "#4338CA"}
              strokeWidth="1.5"
              opacity="0.6"
            />

            {/* right leaf */}
            <path
              d="M230 105 C260 95 262 58 244 28 C222 52 218 86 230 105Z"
              fill={theme === "MeetFlow-pro" ? "#C7D2FE" : "#312E81"}
              opacity={theme === "MeetFlow-pro" ? 0.5 : 0.2}
            />
            <path
              d="M230 105 C244 90 248 62 240 38"
              stroke={theme === "MeetFlow-pro" ? "#A5B4FC" : "#4338CA"}
              strokeWidth="1.5"
              opacity="0.6"
            />

            {/* device card */}
            <rect
              x="85"
              y="55"
              width="75"
              height="60"
              rx="10"
              fill={theme === "MeetFlow-pro" ? "white" : "#1E293B"}
              stroke={theme === "MeetFlow-pro" ? "#E0E7FF" : "#374151"}
              strokeWidth="2"
            />
            <circle cx="98" cy="68" r="3.5" fill={theme === "MeetFlow-pro" ? "#C7D2FE" : "#4338CA"} />
            <rect
              x="107"
              y="65.5"
              width="30"
              height="5"
              rx="2.5"
              fill={theme === "MeetFlow-pro" ? "#E0E7FF" : "#374151"}
            />
            <rect x="93" y="80" width="55" height="4" rx="2" fill={theme === "MeetFlow-pro" ? "#EEF2FF" : "#0F172A"} />
            <rect x="93" y="89" width="42" height="4" rx="2" fill={theme === "MeetFlow-pro" ? "#EEF2FF" : "#0F172A"} />
            <rect x="93" y="98" width="48" height="4" rx="2" fill={theme === "MeetFlow-pro" ? "#EEF2FF" : "#0F172A"} />

            {/* shield badge */}
            <g transform="translate(128, 20)">
              <path
                d="M0 6 L28 -4 L56 6 V30 C56 52 38 66 28 72 C18 66 0 52 0 30 Z"
                fill={theme === "MeetFlow-pro" ? "#4F6EF7" : "#4F46E5"}
              />
              <path
                d="M4 8 L28 0 L52 8 V30 C52 49 37 61 28 66 C19 61 4 49 4 30 Z"
                fill={theme === "MeetFlow-pro" ? "#6D87FA" : "#6366F1"}
              />
              <circle cx="28" cy="32" r="13" fill={theme === "MeetFlow-pro" ? "white" : "#1E293B"} opacity="0.95" />
              <path
                d="M28 24 V32 L34 36"
                stroke={theme === "MeetFlow-pro" ? "#4F6EF7" : "#6366F1"}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
          </svg>
        </div>

        {/* Left content */}
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-base-content tracking-tight">
            Session History
          </h1>
          <p className="mt-1 text-sm text-base-content/60">
            Monitor and manage all user sessions
          </p>
        </div>

        {/* Right menu button */}
        <button className="absolute right-6 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl bg-base-100 border border-base-300 text-base-content/40 shadow-sm transition-all hover:text-base-content hover:bg-base-300 sm:right-8">
          <MoreVerticalIcon className="size-5" />
        </button>
      </div>
      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
        {statCardsData.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
            className="
              w-full
              min-h-[120px]
              lg:min-h-[150px]
              bg-base-200
              border border-base-300/70 rounded-xl
              p-5
              flex items-center
              shadow-sm
              hover:shadow-lg
              transition-all duration-300
            "
          >
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 border-xs rounded-[16px] ${card.bg} flex items-center justify-center flex-shrink-0 mr-4`}
            >
              <card.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${card.color}`} />
            </div>

            <div className="flex flex-col min-w-0">
              <p className="text-[13px] sm:text-sm font-bold text-base-content/60 mb-0.5 truncate">
                {card.label}
              </p>
              <h2 className="text-[25px] font-bold text-base-content leading-none mb-1.5 sm:mb-2">
                {card.value}
              </h2>

              <div className="flex items-center text-[11px] sm:text-[12px] font-bold flex-wrap mt-1">
                {card.trend === "up" && (
                  <span className="text-emerald-500 flex items-center gap-1">
                    <ArrowUpIcon className="w-3 h-3" strokeWidth={3} />
                    {card.trendValue}{" "}
                    <span className="hidden sm:inline">{card.trendLabel}</span>
                  </span>
                )}
                {card.trend === "down" && (
                  <span className="text-rose-500 flex items-center gap-1">
                    <ArrowUpIcon
                      className="w-3 h-3 rotate-180"
                      strokeWidth={3}
                    />
                    {card.trendValue}{" "}
                    <span className="hidden sm:inline">{card.trendLabel}</span>
                  </span>
                )}
                {card.trend === "neutral" && (
                  <span className="text-base-content/40 flex items-center gap-1">
                    {card.trendLabel}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── TABLE CARD ── */}
      <div className="bg-base-200 border border-base-300/70 rounded-xl overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-base-300/70">
          <div className="flex items-center gap-2">
            <Clock3Icon className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-base-content">
              All Login Sessions
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border border-base-300/70 bg-base-200">
                <th className="text-left px-6 py-4 text-xs font-bold text-base-content/60 uppercase tracking-wider border-b border-base-300/70 w-[20%]">
                  Device
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-base-content/60 uppercase tracking-wider border-b border-base-300/70 w-[15%]">
                  IP Address
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-base-content/60 uppercase tracking-wider border-b border-base-300/70 w-[10%]">
                  Status
                </th>
                <th className="text-left px-10 py-4 text-xs font-bold text-base-content/60 uppercase tracking-wider border-b border-base-300/70 w-[18%]">
                  Created
                </th>
                <th className="text-left px-10 py-4 text-xs font-bold text-base-content/60 uppercase tracking-wider border-b border-base-300/70 w-[17%]">
                  Expires
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300/50 bg-base-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-base-content/50">
                        Loading sessions...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : !sessions?.length ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Clock3Icon className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-base font-semibold text-base-content">
                        No Sessions Found
                      </p>
                      <p className="text-sm text-base-content/40">
                        No active login sessions available
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sessions.map((session) => (
                  <tr
                    key={session._id}
                    className="border-b border-base-300/30 hover:bg-base-300/40 transition-colors duration-150 bg-base-200"
                  >
                    {/* Device */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MonitorIcon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-semibold text-primary truncate max-w-[180px]">
                          {session.deviceInfo}
                        </span>
                      </div>
                    </td>

                    {/* IP Address */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <WifiIcon className="w-3.5 h-3.5 text-base-content/40 flex-shrink-0" />
                        <span className="text-sm text-base-content/60 font-mono">
                          {session.ipAddress}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          session.isValid
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-error/10 text-error border-error/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${session.isValid ? "bg-success" : "bg-error"}`}
                        />
                        {session.isValid ? "Active" : "Expired"}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-10 py-4">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-base-content/40 flex-shrink-0" />
                        <span className="text-sm text-base-content/60">
                          {new Date(session.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </td>

                    {/* Expires */}
                    <td className="px-10 py-4">
                      <div className="flex items-center gap-1.5">
                        <Clock3Icon className="w-3.5 h-3.5 text-base-content/40 flex-shrink-0" />
                        <span
                          className={`text-sm ${session.isValid ? "text-base-content/60" : "text-error"}`}
                        >
                          {new Date(session.expiresAt).toLocaleString()}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        {!isLoading && sessions?.length > 0 && (
          <div className="px-6 py-4 border-t border-base-300/50 bg-base-200">
            <p className="text-xs text-base-content/40">
              Showing {sessions.length} session
              {sessions.length !== 1 ? "s" : ""} · {activeSessions} active ·{" "}
              {expiredSessions} expired
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
