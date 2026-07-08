import React, { useState, useMemo } from "react";
import { MoreVertical as MoreVerticalIcon } from "lucide-react";
import {
  Clock3Icon,
  ShieldCheckIcon,
  BanIcon,
  CalendarIcon,
  SearchIcon,
  DownloadIcon,
  PlusIcon,
  VideoIcon,
  Trash2Icon,
  PencilIcon,
  ActivityIcon,
  XIcon,
  ArrowUpIcon,
  EyeIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  getScheduleMeetings,
  createScheduleMeeting,
  updateScheduleMeeting,
  deleteScheduleMeeting,
  getMyGroups,
} from "../lib/api";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

const resolveImageSrc = (img) => {
  if (!img) return "/group.png";
  if (/^https?:\/\//i.test(img)) return img;
  const base = (import.meta?.env?.VITE_API_BASE_URL || "")
    .replace(/\/api\/v1$/, "")
    .replace(/\/$/, "");
  const path = img.startsWith("/") ? img : `/${img}`;
  return `${base}${path}`;
};

const ScheduleMeetingPage = () => {
  const queryClient = useQueryClient();

  // ─────────────────────────────────────────────
  // STATES
  // ─────────────────────────────────────────────
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [openModal, setOpenModal] = useState(false);

  const [editingMeeting, setEditingMeeting] = useState(null);

  const [menuOpenId, setMenuOpenId] = useState(null);

  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailMeeting, setDetailMeeting] = useState(null);

  const [page, setPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [meetingData, setMeetingData] = useState({
    title: "",
    date: "",
    time: "",
    groupId: "",
    status: "upcoming",
  });

  const selectedDate = useMemo(() => {
    if (meetingData.date && meetingData.time) {
      const [year, month, day] = meetingData.date.split("-").map(Number);
      const [hours, minutes] = meetingData.time.split(":").map(Number);
      return new Date(year, month - 1, day, hours, minutes);
    }
    return null;
  }, [meetingData.date, meetingData.time]);

  const handleDateChange = (date) => {
    if (!date) {
      setMeetingData((prev) => ({
        ...prev,
        date: "",
        time: "",
      }));
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const timeStr = `${hours}:${minutes}`;

    setMeetingData((prev) => ({
      ...prev,
      date: dateStr,
      time: timeStr,
    }));
  };

  // ─────────────────────────────────────────────
  // FETCH
  // ─────────────────────────────────────────────
  const { data: scheduleMeeting = [], isLoading } = useQuery({
    queryKey: ["scheduleMeeting"],
    queryFn: getScheduleMeetings,
  });

  const { data: myGroups = [] } = useQuery({
    queryKey: ["myGroups"],
    queryFn: getMyGroups,
  });

  // ─────────────────────────────────────────────
  // COUNTS
  // ─────────────────────────────────────────────
  const totalMeetings = scheduleMeeting.length;

  const pending = scheduleMeeting.filter((m) => m.status === "pending").length;

  const completed = scheduleMeeting.filter(
    (m) => m.status === "completed",
  ).length;

  const cancelled = scheduleMeeting.filter(
    (m) => m.status === "cancelled",
  ).length;

  const upcoming = scheduleMeeting.filter(
    (m) => m.status === "upcoming",
  ).length;

  const expired = scheduleMeeting.filter((m) => m.status === "expired").length;

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: createScheduleMeeting,

    onSuccess: () => {
      toast.success("Meeting created successfully");

      queryClient.invalidateQueries({
        queryKey: ["scheduleMeeting"],
      });

      closeModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create meeting");
    },
  });

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateScheduleMeeting(id, data),

    onSuccess: () => {
      toast.success("Meeting updated");

      queryClient.invalidateQueries({
        queryKey: ["scheduleMeeting"],
      });

      closeModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update meeting");
    },
  });

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: deleteScheduleMeeting,

    onSuccess: () => {
      toast.success("Meeting deleted");

      queryClient.invalidateQueries({
        queryKey: ["scheduleMeeting"],
      });
    },
  });

  // ─────────────────────────────────────────────
  // FILTER
  // ─────────────────────────────────────────────
  const filteredMeetings = useMemo(() => {
    return scheduleMeeting.filter((meeting) => {
      const q = search.toLowerCase();

      const matchQ = !q || meeting.title?.toLowerCase().includes(q);

      const matchS = statusFilter === "all" || meeting.status === statusFilter;

      return matchQ && matchS;
    });
  }, [scheduleMeeting, search, statusFilter]);

  // ─────────────────────────────────────────────
  // PAGINATION
  // ─────────────────────────────────────────────
  const totalPages = Math.max(
    1,
    Math.ceil(filteredMeetings.length / rowsPerPage),
  );

  const safePage = Math.min(page, totalPages);

  const pagedMeetings = filteredMeetings.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage,
  );

  // ─────────────────────────────────────────────
  // OPEN CREATE MODAL
  // ─────────────────────────────────────────────
  const openCreateModal = () => {
    setEditingMeeting(null);

    setMeetingData({
      title: "",
      date: "",
      time: "",
      groupId: "",
      status: "upcoming",
    });

    setOpenModal(true);
  };

  // ─────────────────────────────────────────────
  // OPEN EDIT MODAL
  // ─────────────────────────────────────────────
  const openEditModal = (meeting) => {
    setEditingMeeting(meeting);

    setMeetingData({
      title: meeting.title,
      date: meeting.date,
      time: meeting.time,
      groupId: meeting.groupId?._id || meeting.groupId || "",
      status: meeting.status,
    });

    setOpenModal(true);
  };

  // ─────────────────────────────────────────────
  // CLOSE MODAL
  // ─────────────────────────────────────────────
  const closeModal = () => {
    setOpenModal(false);

    setEditingMeeting(null);

    setMeetingData({
      title: "",
      date: "",
      time: "",
      groupId: "",
      status: "upcoming",
    });
  };

  // ─────────────────────────────────────────────
  // SUBMIT
  // ─────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!meetingData.title.trim()) {
      return;
    }

    if (!meetingData.groupId) {
      toast.error("Please select a group");
      return;
    }

    if (editingMeeting) {
      updateMutation.mutate({
        id: editingMeeting._id,
        data: meetingData,
      });
    } else {
      let scheduledAt = "";
      if (meetingData.date && meetingData.time) {
        scheduledAt = new Date(
          `${meetingData.date}T${meetingData.time}:00`,
        ).toISOString();
      } else {
        toast.error("Please provide both date and time");
        return;
      }

      createMutation.mutate({
        title: meetingData.title,
        groupId: meetingData.groupId,
        scheduledAt: scheduledAt,
        date: meetingData.date,
        time: meetingData.time,
      });
    }
  };

  // ─────────────────────────────────────────────
  // EXPORT CSV
  // ─────────────────────────────────────────────
  const handleExport = () => {
    const csv = [
      "Title,Date,Time,Status",
      ...scheduleMeeting.map(
        (m) => `"${m.title}",${m.date},${m.time},${m.status}`,
      ),
    ].join("\n");

    const a = document.createElement("a");

    a.href = URL.createObjectURL(
      new Blob([csv], {
        type: "text/csv",
      }),
    );

    a.download = "schedule-meetings.csv";

    a.click();
  };

  return (
    <div className="h-full bg-base-200 p-4 font-sans">
      {/* HEADER */}
      {/* ───────────────────────────────────── */}
      <div
        className="
       relative overflow-hidden flex items-center justify-between rounded-2xl border border-base-300/70 bg-base-200 px-6 py-6 shadow-sm
      "
      >
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-base-content">
            Schedule Meetings
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Manage and monitor all your scheduled meetings
          </p>
        </div>

        <button
          className="
          absolute top-4 right-4 z-10
          w-10 h-10
          rounded-xl
          flex items-center justify-center
          text-base-content/40
          hover:text-base-content
          hover:bg-base-200
          transition-all
        "
        >
          <MoreVerticalIcon className="w-5 h-5" />
        </button>

        {/* Decorative illustration */}
        <div className="hidden sm:block absolute right-6 top-1/2 -translate-y-1/2 w-40 h-24 pointer-events-none select-none">
          <svg viewBox="0 0 220 130" className="w-full h-full overflow-visible">
            {/* soft background blobs */}
            <circle cx="205" cy="40" r="50" fill="#eef2fd" opacity="0.8" />
            <circle cx="185" cy="105" r="35" fill="#eef2fd" opacity="0.6" />

            {/* left leaf sprig */}
            <g opacity="0.5">
              <path
                d="M40 110 Q20 90 30 60"
                stroke="#c3cdf5"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <ellipse
                cx="26"
                cy="70"
                rx="7"
                ry="4"
                fill="#dbe3fb"
                transform="rotate(-30 26 70)"
              />
              <ellipse
                cx="34"
                cy="85"
                rx="7"
                ry="4"
                fill="#dbe3fb"
                transform="rotate(-10 34 85)"
              />
              <ellipse
                cx="38"
                cy="100"
                rx="7"
                ry="4"
                fill="#dbe3fb"
                transform="rotate(10 38 100)"
              />
            </g>

            {/* small rounded rectangle badges */}
            <rect x="196" y="15" width="8" height="20" rx="4" fill="#c9d3f7" />
            <rect x="208" y="9" width="8" height="26" rx="4" fill="#c9d3f7" />

            {/* scattered dots */}
            <circle cx="18" cy="45" r="2.5" fill="#c9d3f7" />
            <rect
              x="10"
              y="20"
              width="5"
              height="5"
              fill="#c9d3f7"
              transform="rotate(45 12 22)"
            />

            {/* calendar body */}
            <rect
              x="70"
              y="25"
              width="70"
              height="65"
              rx="8"
              fill="#ffffff"
              stroke="#e2e6f7"
              strokeWidth="1"
            />
            <rect x="70" y="25" width="70" height="18" rx="8" fill="#3d5afe" />
            <rect x="70" y="35" width="70" height="8" fill="#3d5afe" />
            <rect x="84" y="18" width="6" height="14" rx="3" fill="#3d5afe" />
            <rect x="120" y="18" width="6" height="14" rx="3" fill="#3d5afe" />

            {/* grid dots */}
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3].map((col) => (
                <rect
                  key={`${row}-${col}`}
                  x={80 + col * 14}
                  y={50 + row * 10}
                  width="8"
                  height="7"
                  rx="1.5"
                  fill={row === 0 && col === 0 ? "#3d5afe" : "#e8ebfa"}
                />
              )),
            )}

            {/* clock badge */}
            <circle
              cx="142"
              cy="95"
              r="20"
              fill="#ffffff"
              stroke="#3d5afe"
              strokeWidth="4"
            />
            <path
              d="M142 84v11l8 6"
              stroke="#3d5afe"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="128"
              y1="113"
              x2="118"
              y2="123"
              stroke="#3d5afe"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* ───────────────────────────────────── */}
      {/* STAT CARDS */}
      {/* ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-8 mt-4">
        {[
          {
            label: "Total Meetings",
            value: totalMeetings,
            trend: "up",
            trendValue: "12%",
            trendLabel: "this month",
            icon: Clock3Icon,
            color: "text-indigo-600 dark:text-indigo-400",
            bg: "bg-indigo-50 dark:bg-indigo-500/10",
          },
          {
            label: "Completed",
            value: completed,
            trend: "up",
            trendValue: "",
            trendLabel: "meetings done",
            icon: ShieldCheckIcon,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
          },
          {
            label: "Pending",
            value: pending,
            trend: "neutral",
            trendValue: "",
            trendLabel: "awaiting action",
            icon: ActivityIcon,
            color: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-50 dark:bg-orange-500/10",
          },
          {
            label: "Upcoming",
            value: upcoming,
            trend: "up",
            trendValue: "",
            trendLabel: "scheduled ahead",
            icon: CalendarIcon,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-500/10",
          },
          {
            label: "Cancelled",
            value: cancelled,
            trend: "down",
            trendValue: "",
            trendLabel: "cancelled",
            icon: BanIcon,
            color: "text-rose-600 dark:text-rose-400",
            bg: "bg-rose-50 dark:bg-rose-500/10",
          },
        ].map((card, idx) => (
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
                  <span className="text-orange-500">{card.trendLabel}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ───────────────────────────────────── */}
      {/* TABLE CARD */}
      {/* ───────────────────────────────────── */}
      <div className="bg-base-200 border border-base-300/70 rounded-xl overflow-hidden shadow-sm">
        {/* TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-base-200">
          {/* SEARCH */}
          <div className="flex items-center gap-2 flex-1 max-w-md bg-base-200 border border-base-300 rounded-lg px-3 h-10 shadow-sm transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
            <SearchIcon className="w-4 h-4 text-base-content/40 flex-shrink-0" />

            <input
              type="text"
              placeholder="Search meetings..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                setPage(1);
              }}
              className="w-full bg-transparent outline-none text-sm text-base-content/80 placeholder:text-base-content/40"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* FILTER */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);

                setPage(1);
              }}
              className="h-10 px-4 rounded-lg border border-base-300 text-sm font-medium text-base-content/80 bg-base-200 outline-none cursor-pointer shadow-sm hover:bg-base-300 transition-colors"
            >
              <option value="all">All Status</option>

              <option value="upcoming">Upcoming</option>

              <option value="pending">Pending</option>

              <option value="completed">Completed</option>

              <option value="cancelled">Cancelled</option>

              <option value="expired">Expired</option>
            </select>

            {/* ADD */}
            <button
              onClick={openCreateModal}
              className="h-10 px-4 rounded-lg bg-primary hover:bg-primary-focus text-white text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Add New
            </button>

            {/* EXPORT */}
            <button
              onClick={handleExport}
              className="h-10 px-4 rounded-lg border border-base-300 bg-base-200 hover:bg-base-300 text-base-content/80 text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <DownloadIcon className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left ">
            <thead>
              <tr className="border-b border border-base-300/70 rounded-xl bg-base-200">
                <th className="px-6 py-4 text-xs font-bold text-base-content/60 uppercase tracking-wider">
                  Title
                </th>

                <th className="px-6 py-4 text-xs font-bold text-base-content/60 uppercase tracking-wider">
                  Group
                </th>

                <th className="px-6 py-4 text-xs font-bold text-base-content/60 uppercase tracking-wider">
                  Members
                </th>

                <th className="px-6 py-4 text-xs font-bold text-base-content/60 uppercase tracking-wider">
                  Date
                </th>

                <th className="px-6 py-4 text-xs font-bold text-base-content/60 uppercase tracking-wider">
                  Time
                </th>

                <th className="px-6 py-4 text-xs font-bold text-base-content/60 uppercase tracking-wider">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-bold text-base-content/60 uppercase tracking-wider">
                  Created
                </th>

                <th className="px-6 py-4 text-xs font-bold text-base-content/60 uppercase tracking-wider text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-base-200 bg-base-200">
              {!pagedMeetings.length ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-10 text-center text-base-content/60"
                  >
                    No meetings found.
                  </td>
                </tr>
              ) : (
                pagedMeetings.map((meeting) => (
                  <tr
                    key={meeting._id}
                    className="hover:bg-base-200/50 transition-colors"
                  >
                    {/* TITLE */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <VideoIcon className="w-5 h-5 text-primary" />
                        </div> */}

                        <div>
                          <p
                            className="font-semibold text-base-content truncate max-w-[150px]"
                            title={meeting.title}
                          >
                            {meeting.title}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* GROUP */}
                    <td className="px-6 py-4">
                      {meeting.groupId ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={resolveImageSrc(meeting.groupId.groupImage)}
                            alt={meeting.groupId.groupName}
                            className="w-10 h-10 rounded-xl object-cover border border-base-300 shrink-0 bg-base-200"
                            onError={(e) => {
                              e.currentTarget.src = "/group.png";
                            }}
                          />
                          <p
                            className="font-semibold text-base-content truncate max-w-[120px]"
                            title={meeting.groupId.groupName}
                          >
                            {meeting.groupId.groupName}
                          </p>
                        </div>
                      ) : (
                        <span className="text-base-content/50 italic">
                          No group
                        </span>
                      )}
                    </td>

                    {/* MEMBERS */}
                    <td className="px-6 py-4">
                      {meeting.invitees && meeting.invitees.length > 0 ? (
                        <div className="flex items-center -space-x-2">
                          {meeting.invitees.slice(0, 3).map((member, idx) => (
                            <img
                              key={member._id || idx}
                              className="inline-block h-6 w-6 rounded-full ring-2 ring-base-100 object-cover bg-base-200"
                              src={resolveImageSrc(member.profilePic)}
                              alt={member.fullName || "member"}
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullName || 'User')}&background=random`;
                              }}
                              title={member.fullName}
                            />
                          ))}
                          {meeting.invitees.length > 3 && (
                            <div className="flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-base-100 bg-base-300 text-[9px] font-medium text-base-content z-10">
                              +{meeting.invitees.length - 3}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-base-content/50 italic text-sm">
                          No members
                        </span>
                      )}
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-4 text-sm">{meeting.date}</td>

                    {/* TIME */}
                    <td className="px-6 py-4 text-sm">{meeting.time}</td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <span
                        className={`
                            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            
                            ${
                              meeting.status === "completed"
                                ? "bg-success/10 text-success"
                                : ""
                            }

                            ${
                              meeting.status === "cancelled"
                                ? "bg-error/10 text-error"
                                : ""
                            }

                            ${
                              meeting.status === "pending"
                                ? "bg-warning/10 text-warning"
                                : ""
                            }

                            ${
                              meeting.status === "upcoming"
                                ? "bg-info/10 text-info"
                                : ""
                            }
                          `}
                      >
                        {meeting.status}
                      </span>
                    </td>

                    {/* CREATED */}
                    <td className="px-6 py-4 text-sm text-base-content/60">
                      {new Date(meeting.createdAt).toLocaleDateString()}
                    </td>

                    {/* ACTION */}
                    <td
                      className="px-6 py-4 gap-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailMeeting(meeting);
                            setDetailModalOpen(true);
                          }}
                          className="w-10 h-10 rounded-lg border border-base-300 text-base-content/40 hover:text-primary hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-colors"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(meeting);
                            setMenuOpenId(null);
                          }}
                          className="w-10 h-10 rounded-lg border border-base-300 text-base-content/40 hover:text-warning hover:border-warning hover:bg-warning/10 flex items-center justify-center transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <div className="relative inline-block">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect =
                                e.currentTarget.getBoundingClientRect();
                              setMenuPosition({
                                top: rect.bottom + 8,
                                left: rect.right - 180,
                              });
                              setMenuOpenId(
                                menuOpenId === meeting._id ? null : meeting._id,
                              );
                            }}
                            className="w-10 h-10 rounded-lg border border-base-300 text-base-content/40 hover:text-base-content hover:border-base-content/20 hover:bg-base-200 flex items-center justify-center transition-colors"
                          >
                            <MoreVerticalIcon className="w-5 h-5" />
                          </button>
                          {menuOpenId === meeting._id && (
                            <div
                              className="fixed z-[99999] right-0 mt-2 w-44 bg-base-200 border border-base-200 rounded-xl shadow-xl overflow-hidden"
                              style={{
                                top: `${menuPosition.top}px`,
                                left: `${menuPosition.left}px`,
                              }}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm("Delete this meeting?")) {
                                    deleteMutation.mutate(meeting._id);
                                  }
                                  setMenuOpenId(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm font-medium text-error hover:bg-error/10 flex items-center gap-2 transition-colors"
                              >
                                <Trash2Icon className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-base-200">
          {/* ROWS */}
          <div className="flex items-center gap-2">
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));

                setPage(1);
              }}
              className="h-8 px-2 rounded-lg border border-base-300 text-sm text-base-content bg-base-100 outline-none cursor-pointer"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <span className="text-sm text-base-content/50">Items per page</span>
          </div>

          {/* PAGE */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-8 h-8 rounded-lg border border-base-300"
            >
              ‹
            </button>

            <span className="text-sm font-medium">
              Page {safePage} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="w-8 h-8 rounded-lg border border-base-300"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────── */}
      {/* MODAL */}
      {/* ───────────────────────────────────── */}
      {openModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-base-200 text-base-content rounded-3xl shadow-2xl w-full max-w-md p-6 relative border border-base-300/70">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-base-200 hover:bg-base-300 flex items-center justify-center transition-colors"
            >
              <XIcon className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-bold mb-6">
              {editingMeeting ? "Edit Meeting" : "Add Meeting"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Meeting Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Meeting Title
                </label>

                <input
                  required
                  type="text"
                  placeholder="Title of meeting"
                  value={meetingData.title}
                  onChange={(e) =>
                    setMeetingData({
                      ...meetingData,
                      title: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-base-300 bg-base-100 text-base-content px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Group */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Group
                </label>

                <select
                  required
                  value={meetingData.groupId}
                  onChange={(e) =>
                    setMeetingData({
                      ...meetingData,
                      groupId: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-base-300 bg-base-100 text-base-content px-4 py-3 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="" disabled>
                    Select a group
                  </option>

                  {myGroups.map((group) => (
                    <option key={group.groupId} value={group.groupId}>
                      {group.groupName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Date & Time
                </label>

                <div className="relative">
                  <CalendarIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-base-content/40 w-4 h-4 z-10 pointer-events-none" />
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Select date and time"
                    className="w-full rounded-xl border border-base-300 bg-base-100 text-base-content pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary cursor-pointer"
                    popperClassName="react-datepicker-popper"
                    popperPlacement="bottom-start"
                    required
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>

                <select
                  value={meetingData.status}
                  onChange={(e) =>
                    setMeetingData({
                      ...meetingData,
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-base-300 bg-base-100 text-base-content px-4 py-3 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-xl border border-base-300 bg-base-200 hover:bg-base-300 text-base-content text-sm font-medium transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-success hover:bg-success/90 text-success-content text-sm font-semibold transition-colors"
                >
                  {editingMeeting ? "Save Changes" : "Create Meeting"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────── */}
      {/* DETAILS MODAL */}
      {/* ───────────────────────────────────── */}
      <AnimatePresence>
        {detailModalOpen && detailMeeting && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setDetailModalOpen(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-base-100 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-base-300"
            >
              {/* Header Cover */}
              <div className="relative h-28 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-end px-6 pb-6">
                <div className="absolute inset-0 bg-black/10" />
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition backdrop-blur-md"
                >
                  <XIcon className="w-4 h-4" />
                </button>
                <div className="relative z-10 flex items-center gap-4">
                  {detailMeeting.groupId ? (
                    <img
                      src={resolveImageSrc(detailMeeting.groupId.groupImage)}
                      alt={detailMeeting.groupId.groupName}
                      className="w-16 h-16 rounded-2xl object-cover ring-4 ring-base-100 bg-base-200 shadow-md"
                      onError={(e) => {
                        e.currentTarget.src = "/group.png";
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl ring-4 ring-base-100 bg-base-200 shadow-md flex items-center justify-center text-primary/40">
                      <VideoIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-base-content">
                      {detailMeeting.title}
                    </h2>
                    {detailMeeting.groupId && (
                      <p className="text-sm text-base-content/60 font-medium">
                        Group: {detailMeeting.groupId.groupName}
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                    ${detailMeeting.status === "upcoming" ? "bg-info/10 text-info" : ""}
                    ${detailMeeting.status === "completed" ? "bg-success/10 text-success" : ""}
                    ${detailMeeting.status === "pending" ? "bg-warning/10 text-warning" : ""}
                    ${detailMeeting.status === "cancelled" || detailMeeting.status === "expired" ? "bg-base-300 text-base-content/60" : ""}
                  `}
                  >
                    {detailMeeting.status}
                  </span>
                </div>

                {/* Date & Time */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 px-4 py-3 bg-base-200/50 rounded-xl border border-base-300/50 mb-5">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-base-content/40 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">
                        Date
                      </p>
                      <p className="text-xs font-semibold text-base-content/70">
                        {new Date(
                          detailMeeting.scheduledAt || detailMeeting.date,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-base-300" />
                  <div className="flex items-center gap-2">
                    <Clock3Icon className="w-4 h-4 text-base-content/40 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">
                        Time
                      </p>
                      <p className="text-xs font-semibold text-base-content/70">
                        {detailMeeting.time}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info row */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="rounded-xl border border-base-300/70 bg-base-200/50 px-4 py-3">
                    <div className="flex items-center gap-2 text-base-content/50 mb-1">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Created
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-base-content">
                      {new Date(detailMeeting.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="rounded-xl border border-base-300/70 bg-base-200/50 px-4 py-3">
                    <div className="flex items-center gap-2 text-base-content/50 mb-1">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Updated
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-base-content">
                      {new Date(detailMeeting.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setDetailModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-base-300 text-sm font-semibold text-base-content/70 hover:bg-base-200 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={(e) => {
                      setDetailModalOpen(false);
                      openEditModal(detailMeeting);
                    }}
                    className="flex-1 py-3 rounded-xl bg-primary hover:brightness-90 text-white text-sm font-semibold transition flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit Meeting
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScheduleMeetingPage;
