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
  MessageSquareIcon,
  VideoIcon,
  FilterIcon,
  EyeIcon,
  CalendarIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  FileTextIcon ,
  ShieldCheckIcon ,
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
      `Groups_Report_${new Date().toISOString().split("T")[0]}.xlsx`
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
      { withCredentials: true }
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
      group.admins?.some(
        (admin) => (admin._id || admin) === currentUserId,
      ) ||
      group.members?.some(
        (m) =>
          (m.userId?._id || m.userId || m.user?._id || m.user) ===
          currentUserId && m.role === "admin",
      )
    );
  };

  const isCurrentUserAdmin = useMemo(() => isGroupAdmin(selectedGroup), [selectedGroup, authUser]);

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
    () => groups.filter(g => !g.isDeleted).reduce((sum, g) => sum + (g.members?.length ?? 0), 0),
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
    <div className={cn("h-full p-4 md:p-6 font-sans", theme === "MeetFlow-pro" ? "bg-[#f8fafc]" : "bg-base-200")}>
      {/* ── PAGE HEADER ── */}
      <div
        className="
    flex items-center justify-between
    mb-5
   bg-base-200
    border border-base-300/70 rounded-xl
    px-6 py-5
    shadow-sm
  "
      >
        {/* Left Content */}
        <div>
          <h1 className="text-2xl font-bold text-base-content">Groups</h1>

          <p className="text-sm text-base-content/50 mt-1">
            Manage your groups and contacts easily
          </p>
        </div>

        {/* Right Button */}

      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
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
            value: groups.filter((g) => !g.isDeleted && g.members?.length > 0).length,
            trend: "up",
            trendValue: "15%",
            trendLabel: "this month",
            icon: ActivityIcon,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-500/10",
          },
          {
            label: "Inactive Groups",
            value: groups.filter((g) => !g.isDeleted && g.status === "inactive").length,
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
          }
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
            <div className={`w-16 h-16 sm:w-20 sm:h-20 border-xs rounded-[16px] ${card.bg} flex items-center justify-center flex-shrink-0 mr-4 sm:mr-5`}>
              <card.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${card.color}`} />
            </div>

            <div className="flex flex-col min-w-0">
              <p className="text-[13px] sm:text-sm font-bold text-base-content/60 mb-0.5 truncate">
                {card.label}
              </p>
              <h2 className="text-[25px] font-bold text-base-content leading-none mb-1.5 sm:mb-2">
                {card.value}
              </h2>

              <div className="flex items-center text-[11px] sm:text-[12px] font-bold whitespace-nowrap">
                {card.trend === "up" && (
                  <span className="text-emerald-500 flex items-center gap-1">
                    <ArrowUpIcon className="w-3 h-3" strokeWidth={3} />
                    {card.trendValue} <span className="hidden sm:inline">{card.trendLabel}</span>
                  </span>
                )}
                {card.trend === "down" && (
                  <span className="text-rose-500 flex items-center gap-1">
                    <ArrowUpIcon className="w-3 h-3 rotate-180" strokeWidth={3} />
                    {card.trendValue} <span className="hidden sm:inline">{card.trendLabel}</span>
                  </span>
                )}
                {card.trend === "neutral" && (
                  <span className="text-orange-500">
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
                    { bg: 'bg-[#eeebff]', text: 'text-[#6b4eff]' },
                    { bg: 'bg-[#e5faef]', text: 'text-[#0ea960]' },
                    { bg: 'bg-[#eef4ff]', text: 'text-[#3b82f6]' },
                    { bg: 'bg-[#fff4e5]', text: 'text-[#f59e0b]' },
                    { bg: 'bg-[#ffeef0]', text: 'text-[#f43f5e]' }
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
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${style.bg} ${style.text}`}>
                            {group.groupImage ? (
                              <img
                                src={resolveImageSrc(group.groupImage, group.groupName)}
                                alt={group.groupName}
                                className="w-full h-full rounded-xl object-cover"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
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
                                  src={member.userId?.profilePic ? resolveImageSrc(member.userId.profilePic) : "/avatar.png"}
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
                            {new Date(group.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <span className="text-xs text-base-content/40 pl-5">
                            {new Date(group.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-sm text-base-content/70 font-medium">
                            <CalendarIcon className="w-3.5 h-3.5 text-base-content/40" />
                            {new Date(group.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <span className="text-xs text-base-content/40 pl-5">
                            {new Date(group.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 gap-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenChat(e, group);
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
                                const rect = e.currentTarget.getBoundingClientRect();
                                setMenuPosition({
                                  top: rect.bottom + 8,
                                  left: rect.right - 180,
                                });
                                setMenuOpenId(menuOpenId === group._id ? null : group._id);
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
                }))}
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
            <span className="text-sm font-medium text-base-content/60">Items per page</span>
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
                    className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${p === safePage
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
            <span className="text-sm font-medium text-base-content/60">Jump to</span>
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
      {openModal && (
  <div
    className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    onClick={(e) => e.target === e.currentTarget && closeModal()}
  >
    <div className="bg-base-200 rounded-xl shadow-2xl w-full max-w-[500px] p-6 relative">
      {/* Close */}
      <button
        onClick={closeModal}
        className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-base-200 hover:bg-base-300 text-base-content/50 transition"
      >
        <XIcon className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <UsersIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-base-content">
            {editingGroup ? "Edit Group" : "Add New Group"}
          </h2>
          <p className="text-sm text-base-content/60">
            {editingGroup
              ? "Update your group details"
              : "Create a new group to organize your members"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image Upload */}
        <label className="block cursor-pointer">
          <div className="w-full rounded-2xl border-2 border-dashed border-base-300 bg-base-200/50 hover:bg-base-200 flex flex-col items-center justify-center gap-2 py-8 transition overflow-hidden">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 rounded-xl object-cover"
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
              className="w-full bg-base-200 text-base-content placeholder:text-base-content/30 border border-base-300 rounded-xl pl-14 pr-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
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
              className="w-full bg-base-200 text-base-content placeholder:text-base-content/30 border border-base-300 rounded-xl pl-14 pr-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition resize-none"
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
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  groupData.status === "active" ? "bg-success/10" : "bg-base-200"
                }`}
              >
                <ShieldCheckIcon
                  className={`w-4 h-4 ${
                    groupData.status === "active" ? "text-success" : "text-base-content/40"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-base-content">
                  {groupData.status === "active" ? "Active Group" : "Inactive Group"}
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
                  status: prev.status === "active" ? "inactive" : "active",
                }))
              }
              className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                groupData.status === "active" ? "bg-success" : "bg-base-300"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-base-200 shadow-md transition-all duration-300 ${
                  groupData.status === "active" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Timestamps (Edit Only) */}
        {editingGroup && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 px-4 py-3 bg-base-200/50 rounded-2xl border border-base-200">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-base-content/40" />
              <div>
                <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">Created</p>
                <p className="text-xs font-semibold text-base-content/70">
                  {new Date(groupData.createdAt || Date.now()).toLocaleDateString()} at{" "}
                  {new Date(groupData.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-base-300" />
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-base-content/40" />
              <div>
                <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">Last Updated</p>
                <p className="text-xs font-semibold text-base-content/70">
                  {new Date(groupData.updatedAt || Date.now()).toLocaleDateString()} at{" "}
                  {new Date(groupData.updatedAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={closeModal}
            className="flex-1 py-3.5 rounded-full border border-base-300 text-sm font-semibold text-base-content/70 hover:bg-base-200 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3.5 rounded-full bg-primary hover:brightness-90 text-white text-sm font-semibold disabled:opacity-60 transition flex items-center justify-center gap-2"
          >
            {submitting ? (
              editingGroup ? "Saving..." : "Creating..."
            ) : (
              <>
                {!editingGroup && <PlusIcon className="w-4 h-4" />}
                {editingGroup ? "Save Changes" : "Add New Group"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* ── CHAT PANEL ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {openChat && selectedGroup && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenChat(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ y: "100%", opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="
                relative
                bg-base-200/95
                backdrop-blur-xl
                w-full sm:max-w-md
                h-[85vh] sm:h-[650px]
                rounded-t-[2.5rem] sm:rounded-[2.5rem]
                shadow-[0_20px_60px_rgba(0,0,0,0.3)]
                border border-base-300/50
                flex flex-col
                overflow-hidden
                z-10
              "
            >
              {/* Header - Sticky */}
              <div className="sticky top-0 z-20 bg-base-200/80 backdrop-blur-md border-b border-base-300 px-6 py-4 flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary to-secondary rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur" />
                  <img
                    src={resolveImageSrc(
                      selectedGroup.groupImage,
                      selectedGroup.groupName,
                    )}
                    alt={selectedGroup.groupName}
                    onError={(e) => {
                      e.currentTarget.src = "/group.png";
                    }}
                    className="relative w-12 h-12 rounded-2xl object-cover ring-2 ring-primary/20 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-base-100 rounded-full shadow-sm" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base-content text-lg leading-tight truncate">
                    {selectedGroup.groupName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
                    <p className="text-xs font-medium text-base-content/60">
                      {selectedGroup.members?.length ?? 0} members · Online
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setOpenChat(false)}
                  className="
                    w-10 h-10
                    flex items-center justify-center
                    rounded-2xl
                    bg-base-200/70
                    text-base-content/60
                    hover:bg-error hover:text-white
                    hover:rotate-90
                    hover:scale-95
                    active:scale-90
                    transition-all duration-300
                  "
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Live Meeting Banner */}
              {/* {activeMeetingCode && (
                <div className="bg-primary/10 border-b border-primary/20 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                      <VideoIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">Group Call in Progress</p>
                      <p className="text-xs font-medium text-primary/70">Join the ongoing discussion</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/meeting/lobby?code=${activeMeetingCode}`)}
                    className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    Join Call
                  </button>
                </div>
              )} */}

              {/* Messages Area */}
              <div
                className="
                  flex-1
                  overflow-y-auto
                  px-6 py-6
                  space-y-6
                  scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent
                "
              >
                {chatLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                    <p className="text-sm font-medium text-base-content/40 animate-pulse">
                      Encrypting connection...
                    </p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-10">
                    <div className="w-20 h-20 rounded-3xl bg-base-200 flex items-center justify-center">
                      <MessageSquareIcon className="w-10 h-10 text-base-content/20" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-base-content">
                        No messages yet
                      </h4>
                      <p className="text-sm text-base-content/40 mt-1">
                        Be the first to break the ice in{" "}
                        {selectedGroup.groupName}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Date Divider Placeholder */}
                    <div className="flex items-center gap-4 py-2">
                      <div className="h-px flex-1 bg-base-300/50" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/30 bg-base-200/50 px-3 py-1 rounded-full">
                        Today
                      </span>
                      <div className="h-px flex-1 bg-base-300/50" />
                    </div>

                    {messages.map((msg, index) => (
                      <motion.div
                        key={msg.id || index}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                      >
                        <div className="flex flex-col gap-1.5 max-w-[85%]">
                          {msg.sender === "them" && msg.senderInfo && (
                            <span className="text-xs font-semibold text-base-content/60 ml-2">
                              {msg.senderInfo.fullName || "User"}
                            </span>
                          )}
                          <div
                            className={`
                              relative
                              px-5 py-3
                              text-sm
                              leading-relaxed
                              shadow-sm
                              transition-transform duration-200 hover:scale-[1.02]
                              ${msg.sender === "me"
                                ? "bg-gradient-to-br from-primary to-secondary text-white rounded-[1.25rem] rounded-br-[0.3rem] shadow-primary/20 shadow-lg"
                                : "bg-base-200 text-base-content border border-base-300/50 rounded-[1.25rem] rounded-bl-[0.3rem]"
                              }
                            `}
                          >
                            {msg.type === "meeting_invite" ? (
                              <div className="flex flex-col gap-2 min-w-[200px]">
                                <div className="flex items-center gap-2 mb-1">
                                  <VideoIcon className="w-5 h-5" />
                                  <span className="font-bold text-sm">
                                    Video Call Started
                                  </span>
                                </div>
                                <p className="text-xs opacity-90 leading-tight">
                                  Join the group video meeting now!
                                </p>
                                <button
                                  onClick={() => navigate(msg.meta.lobbyUrl)}
                                  className={`mt-2 py-2 px-4 rounded-xl text-xs font-bold w-full transition-colors ${msg.sender === "me"
                                    ? "bg-white text-primary hover:bg-white/90"
                                    : "bg-primary text-white hover:bg-primary/90"
                                    }`}
                                >
                                  Join Meeting
                                </button>
                              </div>
                            ) : (
                              <>{msg.text}</>
                            )}

                            {/* Glow Effect for user messages */}
                            {msg.sender === "me" && (
                              <div className="absolute inset-0 bg-white/10 rounded-[1.25rem] rounded-br-[0.3rem] blur-xl -z-10 opacity-50" />
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-medium text-base-content/30 ${msg.sender === "me" ? "text-right mr-1" : "ml-1"}`}
                          >
                            {new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Section - Glassmorphism */}
              <div className="sticky bottom-0 bg-base-200/80 backdrop-blur-xl border-t border-base-300 px-5 py-4 sm:pb-6">
                {isCurrentUserAdmin ? (
                  <div className="relative group">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleMessageKeyDown}
                      placeholder="Message..."
                      className="
                        w-full
                        bg-base-200
                        text-base-content
                        placeholder:text-base-content/30
                        border border-base-300
                        rounded-[1.25rem]
                        pl-5 pr-14 py-3.5
                        text-sm
                        outline-none
                        focus:border-primary/50
                        focus:ring-4 focus:ring-primary/5
                        transition-all duration-300
                      "
                    />
                    <div className="ml-10">
                      <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="
                        absolute right-2 top-2 bottom-2
                        px-4
                        bg-gradient-to-br from-primary to-secondary
                        text-white
                        rounded-xl
                        flex items-center justify-center
                        shadow-md shadow-primary/20
                        hover:scale-105 active:scale-95
                        disabled:opacity-40 disabled:grayscale disabled:scale-100
                        transition-all duration-300
                        z-10
                      "
                      >
                        <SendIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-sm font-medium text-base-content/50 py-3">
                    Only an admin can send a message to the group.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Group;
