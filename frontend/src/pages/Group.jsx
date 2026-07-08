import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  UsersIcon,
  PlusIcon,
  SearchIcon,
  MessageCircleIcon,
  XIcon,
  UploadIcon,
  SendIcon,
  PencilIcon,
  ArrowUpIcon,
  Trash2Icon,
  ContactIcon,
  ActivityIcon,
  FolderIcon,
  MoreVerticalIcon,
  DownloadIcon,
  FilterIcon,
  EyeIcon,
  CalendarIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  FileTextIcon,
  ShieldCheckIcon,
  UserIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { useMeeting } from "../hooks/useMeeting";
import {
  createGroup,
  getAllGroups,
  updateGroup,
  getAllContacts,
  getGroupById,
  deleteGroup,
  getActiveGroupMeeting,
  getGroupMessages,
  updateAdminOnlyMessaging,
} from "../lib/api";
import * as XLSX from "xlsx";
import useAuthUser from "../hooks/useAuthUser";
import { useThemeStore } from "../store/useThemeStore";
import { cn } from "../lib/utils";

/** Resolve image URL from backend */
const resolveImageSrc = (img, name) => {
  if (!img) return "/group.png";
  if (/^https?:\/\//i.test(img)) return img;
  const base = (import.meta?.env?.VITE_API_BASE_URL || "").replace(/\/$/, "");
  const path = img.startsWith("/") ? img : `/${img}`;
  return `${base}${path}`;
};

const Group = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const { authUser } = useAuthUser();
  const { theme } = useThemeStore();

  // ── State ──────────────────────────────────────────────────────────────────
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [groupData, setGroupData] = useState({
    groupName: "",
    groupBio: "",
    status: "active",
  });
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeMeetingCode, setActiveMeetingCode] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailGroup, setDetailGroup] = useState(null);
  const handleViewDetails = (e, group) => {
    e.stopPropagation();
    setDetailGroup(group);
    setDetailModalOpen(true);
  };
  const { handleCreateGroupMeeting } = useMeeting();

  const handleExport = () => {
    const exportData = groups.map((group) => ({
      "Group Name": group.groupName || "",
      Members: group.members?.length || 0,
      Status: group.status || "",
      Created: group.createdAt
        ? new Date(group.createdAt).toLocaleString()
        : "",
      Updated: group.updatedAt
        ? new Date(group.updatedAt).toLocaleString()
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Groups");

    XLSX.writeFile(
      workbook,
      `Groups_Report_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  // ── Fetch Groups from API ──────────────────────────────────────────────────
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await getAllGroups({ includeDeleted: true });
      const groupsWithMembers = await Promise.all(
        (data || []).map(async (g) => {
          if (Array.isArray(g.members)) return g;
          try {
            const full = await getGroupById(g._id);
            return { ...g, members: full?.members || [] };
          } catch (e) {
            return { ...g, members: [] };
          }
        }),
      );
      setGroups(groupsWithMembers);
    } catch (err) {
      console.error("fetchGroups error:", err);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  console.log("groups", groups);

  // ── Fetch Contacts from API ────────────────────────────────────────────────
  const fetchContacts = async () => {
    try {
      const data = await getAllContacts();
      setContacts(data || []);
    } catch (err) {
      console.error("fetchContacts error:", err);
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchContacts();
  }, []);

  useEffect(() => {
    const handler = () => fetchGroups();
    window.addEventListener("groups:updated", handler);
    return () => window.removeEventListener("groups:updated", handler);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpenModal(false);
        setOpenChat(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // Close action menu on outside click
  useEffect(() => {
    const close = () => setMenuOpenId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  // ── Open Chat ─────────────────────────────────────────────────────────────
  const handleOpenChat = async (e, group) => {
    e.stopPropagation();
    try {
      setChatLoading(true);
      const full = await getGroupById(group._id);
      setSelectedGroup(full || group);
      const activeMeeting = await getActiveGroupMeeting(group._id);
      if (activeMeeting) {
        setActiveMeetingCode(activeMeeting.meetingCode);
      } else {
        setActiveMeetingCode(null);
      }

      // Fetch chat history
      const pastMessages = await getGroupMessages(group._id || group.groupId);
      setMessages(
        pastMessages.map((msg) => ({
          id: msg._id || Date.now(),
          text: msg.text,
          sender:
            msg.sender?._id === (authUser?._id || authUser?.id) ? "me" : "them",
          senderInfo: msg.sender,
        })),
      );
    } catch (err) {
      console.error("open chat error:", err);
      setSelectedGroup(group);
      setActiveMeetingCode(null);
      setMessages([]);
    } finally {
      setChatLoading(false);
    }
    setOpenChat(true);
  };

  useEffect(() => {
    if (!selectedGroup) return;

    // Connect to backend
    const socket = io(
      import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") ||
        "http://localhost:5000",
      { withCredentials: true },
    );
    socketRef.current = socket;

    socket.emit(
      "join_group_room",
      selectedGroup?._id || selectedGroup?.groupId,
    );

    socket.on("meeting_started", (data) => {
      if (data.groupId === (selectedGroup?._id || selectedGroup?.groupId)) {
        setActiveMeetingCode(data.meetingCode);
        if (data.message) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              text: data.message.text,
              sender: data.hostId === authUser._id ? "me" : "them",
              ...data.message,
            },
          ]);
        }
      }
    });

    socket.on("receive_group_message", (msg) => {
      if (msg.groupId === (selectedGroup?._id || selectedGroup?.groupId)) {
        setMessages((prev) => [
          ...prev,
          {
            id: msg._id,
            text: msg.text,
            sender:
              msg.sender?._id === (authUser?._id || authUser?.id)
                ? "me"
                : "them",
            senderInfo: msg.sender,
          },
        ]);
      }
    });

    socket.on("meeting_ended", (data) => {
      if (data.groupId === (selectedGroup?._id || selectedGroup?.groupId)) {
        setActiveMeetingCode(null);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [selectedGroup]);

  // ── Form field change ──────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Image file select ──────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ── Create / Update group via API ──────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupData.groupName.trim()) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("groupName", groupData.groupName);
      formData.append("groupBio", groupData.groupBio);
      if (imageFile) formData.append("groupImage", imageFile);
      formData.append("status", groupData.status || "active");
      const currentUserId = authUser?._id || authUser?.id;
      formData.append(
        "members",
        JSON.stringify([{ user: currentUserId, isAdmin: true }]),
      );
      formData.append("admins", JSON.stringify([currentUserId]));

      let response;
      if (editingGroup) {
        response = await updateGroup(editingGroup._id, formData);
        setGroups((prev) =>
          prev.map((g) => (g._id === editingGroup._id ? response : g)),
        );
      } else {
        response = await createGroup(formData);
        setGroups((prev) => [response, ...prev]);
      }
      closeModal();
    } catch (err) {
      console.error("Submit error:", err.response?.data || err);
      alert(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete group ───────────────────────────────────────────────────────────
  const handleDeleteGroup = async (e, id) => {
    e.stopPropagation();
    const prev = groups;
    setGroups((p) => p.filter((g) => g._id !== id));
    try {
      await deleteGroup(id);
      window.dispatchEvent(new CustomEvent("groups:updated"));
    } catch (err) {
      console.error("Failed to delete group:", err);
      setGroups(prev);
    }
  };

  // ── Open edit modal ────────────────────────────────────────────────────────
  const handleEditGroup = (e, group) => {
    e.stopPropagation();
    setEditingGroup(group);
    setGroupData({
      groupName: group.groupName,
      groupBio: group.groupBio,
      status: group.status,
    });
    setImagePreview(resolveImageSrc(group.groupImage, group.groupName));
    setImageFile(null);
    setOpenModal(true);
  };

  const openCreateModal = () => {
    setEditingGroup(null);
    setGroupData({ groupName: "", groupBio: "", status: "active" });
    setImagePreview(null);
    setImageFile(null);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingGroup(null);
    setGroupData({ groupName: "", groupBio: "", status: "active" });
    setImagePreview(null);
    setImageFile(null);
  };

  const isGroupAdmin = (group) => {
    if (!group || !authUser) return false;
    const currentUserId = authUser._id || authUser.id;
    return (
      group.admins?.some((admin) => (admin._id || admin) === currentUserId) ||
      group.members?.some(
        (m) =>
          (m.userId?._id || m.userId || m.user?._id || m.user) ===
            currentUserId && m.role === "admin",
      )
    );
  };

  const isCurrentUserAdmin = useMemo(
    () => isGroupAdmin(selectedGroup),
    [selectedGroup, authUser],
  );

  // ── Send message ───────────────────────────────────────────────────────────
  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Emit to backend
    if (socketRef.current && selectedGroup) {
      socketRef.current.emit("send_group_message", {
        groupId: selectedGroup._id || selectedGroup.groupId,
        text: message.trim(),
      });
    } else {
      // Fallback local state if socket not connected
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: message.trim(), sender: "me" },
      ]);
    }

    setMessage("");
  };

  const handleMessageKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ── Export CSV ────────────────────────────────────────────────────────────
  // const handleExport = () => {
  //   const csv = [
  //     "Name,Bio,Status,Members,Created",
  //     ...groups.map(
  //       (g) =>
  //         `"${g.groupName}","${g.groupBio || ""}",${g.status},${g.contactCount ?? 0},${new Date(g.createdAt).toLocaleDateString()}`,
  //     ),
  //   ].join("\n");
  //   const a = document.createElement("a");
  //   a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  //   a.download = "groups.csv";
  //   a.click();
  // };

  // ── Filter & paginate ──────────────────────────────────────────────────────
  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      if (g.isDeleted) return false;
      const q = search.toLowerCase();
      const matchQ =
        !q ||
        g.groupName?.toLowerCase().includes(q) ||
        (g.groupBio || "").toLowerCase().includes(q);
      const matchS = statusFilter === "all" || g.status === statusFilter;
      return matchQ && matchS;
    });
  }, [groups, search, statusFilter]);

  // Compute total members across all groups
  const totalMembers = useMemo(
    () =>
      groups
        .filter((g) => !g.isDeleted)
        .reduce((sum, g) => sum + (g.members?.length ?? 0), 0),
    [groups],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredGroups.length / rowsPerPage),
  );
  const safePage = Math.min(page, totalPages);
  const pagedGroups = filteredGroups.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage,
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "h-full p-4 md:p-6 font-sans",
        theme === "MeetFlow-pro" ? "bg-[#f8fafc]" : "bg-base-200",
      )}
    >
      {/* ── PAGE HEADER ── */}
      <div className="relative overflow-hidden flex items-center justify-between rounded-2xl border border-base-300/70 bg-base-200 px-6 py-6 shadow-sm">
        {/* Left Content */}
        <div className="flex items-center gap-4 relative z-10">
          {/* <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
            <UsersIcon className="h-7 w-7 text-primary" />
          </div> */}

          <div>
            <h1 className="text-3xl font-bold text-base-content">My Groups</h1>
            <p className="mt-1 text-sm text-base-content/60">
              Groups where you are a member or an admin
            </p>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="hidden md:flex items-center gap-2 relative z-10">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-primary" />
          </div>

          <div className="h-14 w-14 rounded-full border-4 border-base-200 bg-primary/20 flex items-center justify-center shadow">
            <UsersIcon className="h-7 w-7 text-primary" />
          </div>

          <div className="space-y-2 ml-2">
            <div className="h-5 w-10 rounded-full bg-primary/10" />
            <div className="h-5 w-10 rounded-full bg-primary/10" />
          </div>
        </div>

        {/* Decorative Shapes */}
        <div className="absolute -right-6 top-0 h-full w-48 rounded-l-full bg-primary/5" />
        <div className="absolute right-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-primary/5" />
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-8 mt-4">
        {[
          {
            label: "Total Groups",
            value: groups.filter((g) => !g.isDeleted).length,
            trend: "up",
            trendValue: "12%",
            trendLabel: "this month",
            icon: UsersIcon,
            color: "text-indigo-600 dark:text-indigo-400",
            bg: "bg-indigo-50 dark:bg-indigo-500/10",
          },
          {
            label: "Total Contacts",
            value: totalMembers,
            trend: "up",
            trendValue: "8%",
            trendLabel: "this month",
            icon: ContactIcon,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
          },
          {
            label: "Active Groups",
            value: groups.filter((g) => !g.isDeleted && g.members?.length > 0)
              .length,
            trend: "up",
            trendValue: "15%",
            trendLabel: "this month",
            icon: ActivityIcon,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-500/10",
          },
          {
            label: "Inactive Groups",
            value: groups.filter((g) => !g.isDeleted && g.status === "inactive")
              .length,
            trend: "neutral",
            trendValue: "",
            trendLabel: "No change",
            icon: FolderIcon,
            color: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-50 dark:bg-orange-500/10",
          },
          {
            label: "Deleted Groups",
            value: groups.filter((g) => g.isDeleted).length,
            trend: "down",
            trendValue: "2%",
            trendLabel: "this month",
            icon: Trash2Icon,
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
      {/* ── TABLE CARD ── */}
      <div className="bg-base-200 border border-base-300/70 rounded-xl overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-base-200">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 max-w-md bg-base-200 border border-base-300 rounded-lg px-3 h-10 shadow-sm transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
            <SearchIcon className="w-4 h-4 text-base-content/40 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by group name, description or members..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-transparent outline-none text-sm text-base-content/80 placeholder:text-base-content/40"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 px-4 rounded-lg border border-base-300 text-sm font-medium text-base-content/80 bg-base-200 outline-none cursor-pointer shadow-sm hover:bg-base-300 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Filter */}
            <button className="h-10 px-4 rounded-lg border border-base-300 bg-base-200 hover:bg-base-300 text-base-content/80 text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
              <FilterIcon className="w-4 h-4" />
              Filter
            </button>

            {/* Add New */}
            <button
              onClick={openCreateModal}
              className="h-10 px-4 rounded-lg bg-primary hover:bg-primary-focus text-white text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Add New
            </button>

            {/* Export */}
            <button
              onClick={handleExport}
              className="h-10 px-4 rounded-lg border border-base-300 bg-base-200 hover:bg-base-300 text-base-content/80 text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <DownloadIcon className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left ">
            <thead>
              <tr className="border-b border border-base-300/70 rounded-xl bg-base-200">
                <th className="px-6 py-4 text-xs font-bold text-base-content/60 uppercase tracking-wider">
                  Group
                </th>
                <th className="px-6 py-4 text-xs font-bold text-base-content/60 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-4 text-xs font-bold text-base-content/60 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-base-content/60 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-xs font-bold text-base-content/60 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-4 text-xs font-bold text-base-content/60 uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200 bg-base-200">
              {pagedGroups.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-base-content/60"
                  >
                    No groups found.
                  </td>
                </tr>
              ) : (
                pagedGroups.map((group, idx) => {
                  const colors = [
                    { bg: "bg-[#eeebff]", text: "text-[#6b4eff]" },
                    { bg: "bg-[#e5faef]", text: "text-[#0ea960]" },
                    { bg: "bg-[#eef4ff]", text: "text-[#3b82f6]" },
                    { bg: "bg-[#fff4e5]", text: "text-[#f59e0b]" },
                    { bg: "bg-[#ffeef0]", text: "text-[#f43f5e]" },
                  ];
                  const style = colors[idx % colors.length];

                  return (
                    <tr
                      key={group._id}
                      onClick={() => navigate(`/groups/${group._id}`)}
                      className="hover:bg-base-200 transition-colors cursor-pointer group/row"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${style.bg} ${style.text}`}
                          >
                            {group.groupImage ? (
                              <img
                                src={resolveImageSrc(
                                  group.groupImage,
                                  group.groupName,
                                )}
                                alt={group.groupName}
                                className="w-full h-full rounded-xl object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <UsersIcon className="w-6 h-6" strokeWidth={2} />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-[15px] font-bold text-base-content">
                                {group.groupName}
                              </p>
                              <StarIcon className="w-3.5 h-3.5 text-base-content/40 group-hover/row:text-base-content/70 transition-colors" />
                            </div>
                            <p className="text-[13px] text-base-content/60 mt-0.5 max-w-[200px] truncate">
                              {group.groupBio || "No description"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2 overflow-hidden">
                              {group.members?.slice(0, 3).map((member, i) => (
                                <img
                                  key={i}
                                  className="inline-block h-7 w-7 rounded-full ring-2 ring-base-100 object-cover bg-base-300"
                                  src={
                                    member.userId?.profilePic
                                      ? resolveImageSrc(
                                          member.userId.profilePic,
                                        )
                                      : "/avatar.png"
                                  }
                                  alt={member.userId?.fullName || "Member"}
                                  onError={(e) => {
                                    e.currentTarget.src = "/avatar.png";
                                  }}
                                />
                              ))}
                            </div>
                            {(group.members?.length || 0) > 3 && (
                              <span className="text-xs font-semibold text-base-content/60 bg-base-200 px-2 py-0.5 rounded-full">
                                +{(group.members?.length || 0) - 3}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-medium text-base-content/60">
                            {group.members?.length || 0} Members
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {group.status === "active" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e5faef] text-[#0ea960]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0ea960]"></div>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fff4e5] text-[#f59e0b]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></div>
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-sm text-base-content/70 font-medium">
                            <CalendarIcon className="w-3.5 h-3.5 text-base-content/40" />
                            {new Date(group.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                          <span className="text-xs text-base-content/40 pl-5">
                            {new Date(group.createdAt).toLocaleTimeString(
                              "en-US",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-sm text-base-content/70 font-medium">
                            <CalendarIcon className="w-3.5 h-3.5 text-base-content/40" />
                            {new Date(group.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                          <span className="text-xs text-base-content/40 pl-5">
                            {new Date(group.updatedAt).toLocaleTimeString(
                              "en-US",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </span>
                        </div>
                      </td>

                      <td
                        className="px-6 py-4 gap-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(e, group);
                            }}
                            className="w-10 h-10 rounded-lg border border-base-300 text-base-content/40 hover:text-primary hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-colors"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditGroup(e, group);
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
                                  menuOpenId === group._id ? null : group._id,
                                );
                              }}
                              className="w-10 h-10 rounded-lg border border-base-300 text-base-content/40 hover:text-base-content hover:border-base-content/20 hover:bg-base-200 flex items-center justify-center transition-colors"
                            >
                              <MoreVerticalIcon className="w-5 h-5" />
                            </button>
                            {menuOpenId === group._id && (
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
                                    handleDeleteGroup(e, group._id);
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-base-200 bg-base-200">
          {/* Rows per page */}
          <div className="flex items-center gap-3">
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="h-9 px-3 rounded-lg border border-base-300 text-sm font-semibold text-base-content/80 bg-base-200 outline-none cursor-pointer focus:ring-2 focus:ring-primary/20"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span className="text-sm font-medium text-base-content/60">
              Items per page
            </span>
          </div>

          {/* Page Buttons */}
          <div className="flex items-center gap-1.5">
            {/* First */}
            <button
              onClick={() => setPage(1)}
              disabled={safePage === 1}
              className="w-8 h-8 rounded-lg text-base-content/40 hover:text-base-content/80 hover:bg-base-200 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center transition-colors"
            >
              <ChevronsLeftIcon className="w-4 h-4" />
            </button>
            {/* Prev */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-8 h-8 rounded-lg text-base-content/40 hover:text-base-content/80 hover:bg-base-200 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 || p === totalPages || Math.abs(p - safePage) <= 1,
              )
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span
                    key={`e-${i}`}
                    className="w-8 text-center text-sm font-medium text-base-content/40"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
                      p === safePage
                        ? "bg-primary text-white"
                        : "text-base-content/70 hover:bg-base-200"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

            {/* Next */}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="w-8 h-8 rounded-lg text-base-content/40 hover:text-base-content/80 hover:bg-base-200 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center transition-colors"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
            {/* Last */}
            <button
              onClick={() => setPage(totalPages)}
              disabled={safePage === totalPages}
              className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center transition-colors"
            >
              <ChevronsRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Jump to page */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-base-content/60">
              Jump to
            </span>
            <select
              value={safePage}
              onChange={(e) => setPage(Number(e.target.value))}
              className="h-9 px-3 rounded-lg border border-base-300 text-sm font-semibold text-base-content/80 bg-base-200 outline-none cursor-pointer focus:ring-2 focus:ring-primary/20"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── CREATE / EDIT MODAL ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {openModal && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            {/* Scoped scrollbar-hide style — only affects .group-modal-scroll below */}
            <style>{`
        .group-modal-scroll::-webkit-scrollbar { display: none; }
        .group-modal-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-base-200 rounded-2xl shadow-2xl w-full max-w-[500px] max-h-[85vh] flex flex-col overflow-hidden relative"
            >
              {/* Sticky Header */}
              <div className="sticky top-0 z-10 bg-base-200/95 backdrop-blur-md border-b border-base-300/60 px-6 py-5 flex items-start gap-3 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <UsersIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-base-content leading-tight">
                    {editingGroup ? "Edit Group" : "Add New Group"}
                  </h2>
                  <p className="text-sm text-base-content/60 mt-0.5">
                    {editingGroup
                      ? "Update your group details"
                      : "Create a new group to organize your members"}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-base-200 hover:bg-base-300 text-base-content/50 hover:text-base-content hover:rotate-90 transition-all duration-300 shrink-0"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Body — scrollbar now hidden via .group-modal-scroll */}
              <form
                onSubmit={handleSubmit}
                className="group-modal-scroll flex-1 overflow-y-auto px-6 py-5 space-y-5"
              >
                {/* Image Upload */}
                <label className="block cursor-pointer">
                  <div className="w-full rounded-2xl border-2 border-dashed border-base-300 bg-base-200/50 hover:bg-base-200 hover:border-primary/40 flex flex-col items-center justify-center gap-2 py-7 transition-all duration-300 overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-xl object-cover ring-2 ring-base-300/50 shadow-sm"
                        onError={(e) => {
                          e.currentTarget.src = "/group.png";
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <UploadIcon className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <p className="text-sm font-semibold text-base-content mt-1">
                      {imagePreview ? "Change Image" : "Upload Group Image"}
                    </p>
                    <p className="text-xs text-base-content/40">
                      JPG, PNG or WEBP. Max size 2MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {/* Group Name */}
                <div>
                  <label className="block text-sm font-semibold text-base-content mb-2">
                    Group Name <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <UsersIcon className="w-4 h-4 text-primary" />
                    </div>
                    <input
                      type="text"
                      name="groupName"
                      value={groupData.groupName}
                      onChange={handleChange}
                      required
                      placeholder="Enter group name"
                      className="w-full bg-base-200 text-base-content placeholder:text-base-content/30 border border-base-300 rounded-xl pl-14 pr-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Group Bio */}
                <div>
                  <label className="block text-sm font-semibold text-base-content mb-2">
                    Bio / Description
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileTextIcon className="w-4 h-4 text-primary" />
                    </div>
                    <textarea
                      name="groupBio"
                      value={groupData.groupBio}
                      onChange={handleChange}
                      placeholder="Short description about this group..."
                      rows={3}
                      className="w-full bg-base-200 text-base-content placeholder:text-base-content/30 border border-base-300 rounded-xl pl-14 pr-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none"
                    />
                  </div>
                </div>

                {/* Status Toggle */}
                <div>
                  <label className="block text-sm font-semibold text-base-content mb-2">
                    Group Status
                  </label>
                  <div className="flex items-center justify-between bg-base-200 border border-base-300 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                          groupData.status === "active"
                            ? "bg-success/10"
                            : "bg-base-300/50"
                        }`}
                      >
                        <ShieldCheckIcon
                          className={`w-4 h-4 transition-colors duration-300 ${
                            groupData.status === "active"
                              ? "text-success"
                              : "text-base-content/40"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-base-content">
                          {groupData.status === "active"
                            ? "Active Group"
                            : "Inactive Group"}
                        </p>
                        <p className="text-xs text-base-content/60 mt-0.5">
                          {groupData.status === "active"
                            ? "Group is enabled and visible to all members"
                            : "Group is temporarily disabled"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setGroupData((prev) => ({
                          ...prev,
                          status:
                            prev.status === "active" ? "inactive" : "active",
                        }))
                      }
                      className={`relative w-14 h-8 rounded-full transition-colors duration-300 shrink-0 ${
                        groupData.status === "active"
                          ? "bg-success"
                          : "bg-base-300"
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                          groupData.status === "active"
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Timestamps (Edit Only) */}
                {editingGroup && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 px-4 py-3 bg-base-200/50 rounded-2xl border border-base-300/50">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-base-content/40 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">
                          Created
                        </p>
                        <p className="text-xs font-semibold text-base-content/70">
                          {new Date(
                            groupData.createdAt || Date.now(),
                          ).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(
                            groupData.createdAt || Date.now(),
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:block w-px h-8 bg-base-300" />
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-base-content/40 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">
                          Last Updated
                        </p>
                        <p className="text-xs font-semibold text-base-content/70">
                          {new Date(
                            groupData.updatedAt || Date.now(),
                          ).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(
                            groupData.updatedAt || Date.now(),
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>

              {/* Sticky Footer */}
              <div className="sticky bottom-0 bg-base-200/95 backdrop-blur-md border-t border-base-300/60 px-6 py-4 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-full border border-base-300 text-sm font-semibold text-base-content/70 hover:bg-base-300/50 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3 rounded-full bg-primary hover:brightness-90 text-white text-sm font-semibold disabled:opacity-60 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
                >
                  {submitting ? (
                    editingGroup ? (
                      "Saving..."
                    ) : (
                      "Creating..."
                    )
                  ) : (
                    <>
                      {!editingGroup && <PlusIcon className="w-4 h-4" />}
                      {editingGroup ? "Save Changes" : "Add New Group"}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* ── GROUP DETAILS MODAL ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {detailModalOpen && detailGroup && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setDetailModalOpen(false)
            }
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-base-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10"
            >
              {/* Close */}
              <button
                onClick={() => setDetailModalOpen(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-base-100/80 hover:bg-base-300 text-base-content/60 backdrop-blur-sm transition"
              >
                <XIcon className="w-4 h-4" />
              </button>

              {/* Cover / Image */}
              <div className="relative h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-end px-6 pb-0">
                <div className="absolute -inset-0.5 opacity-40 bg-gradient-to-tr from-primary to-secondary blur-2xl" />
                <div className="relative -mb-10 w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-base-200 shadow-lg bg-base-300 flex items-center justify-center shrink-0">
                  {detailGroup.groupImage ? (
                    <img
                      src={resolveImageSrc(
                        detailGroup.groupImage,
                        detailGroup.groupName,
                      )}
                      alt={detailGroup.groupName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/group.png";
                      }}
                    />
                  ) : (
                    <UsersIcon className="w-8 h-8 text-base-content/40" />
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="pt-12 px-6 pb-6">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h2 className="text-lg font-bold text-base-content leading-tight">
                    {detailGroup.groupName}
                  </h2>
                  {detailGroup.status === "active" ? (
                    <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e5faef] text-[#0ea960]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0ea960]" />
                      Active
                    </span>
                  ) : (
                    <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fff4e5] text-[#f59e0b]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                      Inactive
                    </span>
                  )}
                </div>

                <p className="text-sm text-base-content/60 mb-5">
                  {detailGroup.groupBio || "No description provided."}
                </p>

                {/* Stat row */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="rounded-xl border border-base-300/70 bg-base-200/50 px-4 py-3">
                    <div className="flex items-center gap-2 text-base-content/50 mb-1">
                      <UsersIcon className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        Members
                      </span>
                    </div>
                    <p className="text-xl font-bold text-base-content">
                      {detailGroup.members?.length ?? 0}
                    </p>
                  </div>

                  <div className="rounded-xl border border-base-300/70 bg-base-200/50 px-4 py-3">
                    <div className="flex items-center gap-2 text-base-content/50 mb-1">
                      <ShieldCheckIcon className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        Admins
                      </span>
                    </div>
                    <p className="text-xl font-bold text-base-content">
                      {detailGroup.admins?.length ?? 0}
                    </p>
                  </div>
                </div>

                {/* Member avatars preview */}
                {detailGroup.members?.length > 0 && (
                  <div className="mb-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/40 mb-2">
                      Members
                    </p>
                    <div className="flex items-center -space-x-2 overflow-hidden">
                      {detailGroup.members.slice(0, 8).map((member, i) => (
                        <img
                          key={i}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-base-200 object-cover bg-base-300"
                          src={
                            member.userId?.profilePic
                              ? resolveImageSrc(member.userId.profilePic)
                              : "/avatar.png"
                          }
                          alt={member.userId?.fullName || "Member"}
                          title={member.userId?.fullName || "Member"}
                          onError={(e) => {
                            e.currentTarget.src = "/avatar.png";
                          }}
                        />
                      ))}
                      {detailGroup.members.length > 8 && (
                        <div className="h-8 w-8 rounded-full ring-2 ring-base-200 bg-base-300 flex items-center justify-center text-[10px] font-bold text-base-content/60">
                          +{detailGroup.members.length - 8}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Created / Updated */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 px-4 py-3 bg-base-200/50 rounded-xl border border-base-300/50">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-base-content/40 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">
                        Created
                      </p>
                      <p className="text-xs font-semibold text-base-content/70">
                        {detailGroup.createdAt
                          ? `${new Date(detailGroup.createdAt).toLocaleDateString()} · ${new Date(detailGroup.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-base-300" />
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-base-content/40 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">
                        Updated
                      </p>
                      <p className="text-xs font-semibold text-base-content/70">
                        {detailGroup.updatedAt
                          ? `${new Date(detailGroup.updatedAt).toLocaleDateString()} · ${new Date(detailGroup.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-5">
                  <button
                    onClick={() => setDetailModalOpen(false)}
                    className="flex-1 py-3 rounded-full border border-base-300 text-sm font-semibold text-base-content/70 hover:bg-base-200 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={(e) => {
                      setDetailModalOpen(false);
                      handleEditGroup(e, detailGroup);
                    }}
                    className="flex-1 py-3 rounded-full bg-primary hover:brightness-90 text-white text-sm font-semibold transition flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit Group
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

export default Group;
