import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getMyGroups } from "../lib/api";
import {
  GroupIcon,
  CalendarIcon,
  VideoIcon,
  ActivityIcon,
  UsersIcon,
  PlusIcon,
  LayoutGridIcon,
  ListIcon,
  ChevronDownIcon,
  MoreVerticalIcon,
  ExternalLinkIcon,
  BadgeCheckIcon,
  ClockIcon,
  SparklesIcon,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";

const resolveImageSrc = (img) => {
  if (!img) return "/group.png";
  if (/^https?:\/\//i.test(img)) return img;
  const base = (import.meta?.env?.VITE_API_BASE_URL || "")
    .replace(/\/api\/v1$/, "")
    .replace(/\/$/, "");
  const path = img.startsWith("/") ? img : `/${img}`;
  return `${base}${path}`;
};

// Deterministic accent palette per-group so cards feel distinct but consistent
// on every render/reload (hashed off the group name).
const AVATAR_PALETTES = [
  { bg: "bg-amber-100", ring: "ring-amber-200", text: "text-amber-700" },
  { bg: "bg-rose-100", ring: "ring-rose-200", text: "text-rose-700" },
  { bg: "bg-sky-100", ring: "ring-sky-200", text: "text-sky-700" },
  { bg: "bg-emerald-100", ring: "ring-emerald-200", text: "text-emerald-700" },
  { bg: "bg-violet-100", ring: "ring-violet-200", text: "text-violet-700" },
  { bg: "bg-orange-100", ring: "ring-orange-200", text: "text-orange-700" },
];

const paletteFor = (name = "") => {
  const sum = name
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_PALETTES[sum % AVATAR_PALETTES.length];
};

const timeAgo = (dateStr) => {
  if (!dateStr) return null;
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (Number.isNaN(days)) return null;
  if (days <= 0) return "Updated today";
  if (days === 1) return "Updated 1 day ago";
  return `Updated ${days} days ago`;
};

const StatCard = ({ icon: Icon, iconBg, iconColor, label, value, trend }) => (
  <div className="flex items-center gap-3 px-5 py-4 flex-1 min-w-[180px]">
    <div className={`w-20 h-20 sm:w-18 sm:h-18 border-xs rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs text-base-content/50">{label}</p>
      <p className="text-2xl font-bold text-base-content leading-tight">{value}</p>
      {trend && <p className="text-xs text-success font-medium mt-0.5">{trend}</p>}
    </div>
  </div>
);

const GroupAvatar = ({ group }) => {
  const palette = paletteFor(group.groupName);
  const [errored, setErrored] = useState(false);

  if (group.groupImage && !errored) {
    return (
      <img
        src={resolveImageSrc(group.groupImage)}
        alt={group.groupName}
        className="w-14 h-14 rounded-2xl object-cover border border-base-300 shrink-0"
        onError={() => setErrored(true)}
      />
    );
  }

  return (
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ring-4 ${palette.bg} ${palette.ring} ${palette.text}`}
    >
      <span className="text-xl font-extrabold">
        {group.groupName?.trim()?.[0]?.toUpperCase() || "G"}
      </span>
    </div>
  );
};

const MemberStack = ({ members = [], count = 0 }) => {
  const displayCount = count || members.length;
  const shownMembers = members.slice(0, 3);
  const remainingSlots = Math.max(0, Math.min(displayCount, 3) - shownMembers.length);

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {shownMembers.map((member, i) => (
          <img
            key={member.userId || i}
            src={resolveImageSrc(member.profilePic)}
            alt={member.name || "Member"}
            className="w-6 h-6 rounded-full object-cover border-2 border-base-100 bg-base-300"
            onError={(e) => {
              e.currentTarget.src = "/avatar.png";
            }}
          />
        ))}
        {Array.from({ length: remainingSlots }).map((_, i) => (
          <div
            key={`placeholder-${i}`}
            className="w-6 h-6 rounded-full bg-base-300 border-2 border-base-100 flex items-center justify-center"
          >
            <UsersIcon className="w-3 h-3 text-base-content/40" />
          </div>
        ))}
      </div>
      <span className="text-xs text-base-content/60">
        {displayCount} {displayCount === 1 ? "Member" : "Members"}
      </span>
    </div>
  );
};

const MyGroupsPage = () => {
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState("list"); // "list" | "grid"

  const openMembersModal = (group) => {
    console.log("Group members in openMembersModal:", group.members);
    setSelectedGroup(group);
    const newMembers = group.members || [];
    setMembers(newMembers);
    console.log("State members set to:", newMembers);
    setShowMembersModal(true);
  };

  const closeMembersModal = () => {
    setShowMembersModal(false);
    setSelectedGroup(null);
    setMembers([]);
  };
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { authUser } = useAuthUser();

  useEffect(() => {
    const fetchMyGroups = async () => {
      try {
        setLoading(true);
        const data = await getMyGroups();
        console.log("Groups API Response:", data);
        setGroups(data || []);
      } catch (err) {
        console.error("Failed to fetch my groups:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyGroups();
  }, []);


  const sortedGroups = useMemo(() => {
    const copy = [...groups];
    if (sortBy === "name") {
      copy.sort((a, b) => (a.groupName || "").localeCompare(b.groupName || ""));
    } else if (sortBy === "members") {
      copy.sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0));
    }
    // "latest" keeps original order from the API
    return copy;
  }, [groups, sortBy]);

  const stats = useMemo(() => {
    const totalGroups = groups.length;
    const upcomingMeetings = groups.reduce(
      (sum, g) => sum + (g.upcomingMeetingCount || 0),
      0
    );
    const totalMembers = groups.reduce((sum, g) => sum + (g.memberCount || 0), 0);
    const liveCount = groups.filter((g) => g.activeMeeting).length;
    return { totalGroups, upcomingMeetings, totalMembers, liveCount };
  }, [groups]);

  return (
    <div className="h-full bg-base-200 p-4 md:p-6 font-sans">
      <Helmet>
        <title>My Groups | MeetFlow</title>
      </Helmet>

      {/* ── PAGE HEADER ── */}
      <div className="relative overflow-hidden flex items-center justify-between rounded-2xl border border-base-300/70 bg-base-200 px-6 py-6 shadow-sm">
        <div className="flex items-center gap-4 relative z-10">
          {/* <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <UsersIcon className="w-6 h-6" />
          </div> */}
          <div>
            <h1 className="text-2xl font-bold text-base-content">My Groups</h1>
            <p className="text-sm text-base-content/50 mt-1">
              Groups where you are a member or an admin
            </p>
          </div>
        </div>

        {/* decorative chat-cluster illustration */}
        <div className="hidden md:flex items-center gap-2 relative z-10 opacity-90">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <UsersIcon className="w-5 h-5" />
          </div>
          <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center text-secondary -ml-3 ring-4 ring-base-200">
            <VideoIcon className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1.5 -ml-1">
            <div className="w-8 h-5 rounded-full bg-primary/10" />
            <div className="w-10 h-5 rounded-full bg-secondary/10" />
          </div>
        </div>
        <div className="absolute -right-6 -top-8 w-40 h-40 rounded-full bg-primary/5" />
        <div className="absolute right-24 -bottom-10 w-24 h-24 rounded-full bg-secondary/5" />
      </div>

      {/* ── STATS ROW ── */}
      <div className="flex flex-wrap items-stretch divide-x divide-base-300/70 bg-base-200 border border-base-300/70 rounded-xl mb-5 shadow-sm overflow-hidden mt-4">
        <StatCard
          icon={UsersIcon}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          label="Total My Groups"
          value={stats.totalGroups}
          trend={stats.totalGroups > 0 ? "↑ Active" : null}
        />
        <StatCard
          icon={CalendarIcon}
          iconBg="bg-secondary/10"
          iconColor="text-secondary"
          label="Upcoming Meetings"
          value={stats.upcomingMeetings}
          trend={stats.upcomingMeetings === 0 ? "No upcoming" : null}
        />
        <StatCard
          icon={UsersIcon}
          iconBg="bg-accent/10"
          iconColor="text-accent"
          label="Total Members"
          value={stats.totalMembers}
          trend="Across all groups"
        />
        <StatCard
          icon={ActivityIcon}
          iconBg={stats.liveCount > 0 ? "bg-success/10" : "bg-base-300/60"}
          iconColor={stats.liveCount > 0 ? "text-success" : "text-base-content/50"}
          label="Status"
          value={stats.liveCount > 0 ? `${stats.liveCount} Live` : "All Offline"}
          trend={`${stats.totalGroups} groups`}
        />
      </div>

      {/* ── CONTROLS ── */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="font-bold text-base-content">Your Groups</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none text-sm bg-base-200 border border-base-300/70 rounded-xl pl-3 pr-8 py-2 text-base-content/70 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="latest">Sort by: Latest</option>
              <option value="name">Sort by: Name</option>
              <option value="members">Sort by: Members</option>
            </select>
            <ChevronDownIcon className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
          </div>

          <div className="flex items-center bg-base-200 border border-base-300/70 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-base-content/40"
                }`}
              aria-label="Grid view"
            >
              <LayoutGridIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-base-content/40"
                }`}
              aria-label="List view"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── GROUPS LIST ── */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-base-content/50 text-sm">
          Loading your groups…
        </div>
      ) : sortedGroups.length === 0 ? (
        <div className="bg-base-200 border border-base-300/70 rounded-xl py-16 text-center text-base-content/50">
          <UsersIcon className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No groups yet</p>
          <p className="text-sm mt-1">Create a group to start meeting with your team.</p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 gap-4"
              : "space-y-4"
          }
        >
          {sortedGroups.map((group) => (
            <div
              key={group.groupId}
              onClick={() => navigate(`/groups/${group.groupId}`)}
              className="group/card bg-base-200 border border-base-300/70 rounded-xl p-4 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <GroupAvatar group={group} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-lg truncate">{group.groupName}</h3>
                      {group.verified && (
                        <BadgeCheckIcon className="w-4 h-4 text-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-base-content/50">
                      {group.category || "General"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg text-base-content/30 hover:bg-base-200 hover:text-base-content/60 transition-colors shrink-0"
                >
                  <MoreVerticalIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 mb-3">
                <MemberStack members={group.members} count={group.memberCount} />
                {group.description && (
                  <p className="hidden sm:block text-xs text-base-content/50 truncate max-w-xs">
                    {group.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap pt-3 border-t border-base-300">
                {/* Upcoming Meetings */}
                <div className="flex items-center gap-2 min-w-[110px]">
                  <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50">Upcoming</p>
                    <p className="font-semibold text-sm">{group.upcomingMeetingCount}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1 min-w-[120px]">
                  {group.activeMeeting ? (
                    <div className="badge badge-success gap-1.5 py-3">
                      <ActivityIcon className="w-3.5 h-3.5 animate-pulse" />
                      Live Now
                    </div>
                  ) : (
                    <div className="badge badge-ghost gap-1.5 py-3">
                      <VideoIcon className="w-3.5 h-3.5" />
                      Offline
                    </div>
                  )}
                  {timeAgo(group.updatedAt) && (
                    <span className="flex items-center gap-1 text-[11px] text-base-content/40">
                      <ClockIcon className="w-3 h-3" />
                      {timeAgo(group.updatedAt)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-auto">
                  {group.activeMeeting ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/meeting/lobby?code=${group.activeMeeting}`);
                      }}
                      className="btn btn-success btn-sm"
                    >
                      Join Meeting
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openMembersModal(group);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-blue-500/20 shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200"
                    >
                      <UsersIcon className="w-4 h-4" />
                      View Members
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/groups/${group.groupId}`);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-base-300 text-sm font-semibold text-base-content/70 hover:bg-base-200 transition-colors"
                  >
                    Open Group
                    <ExternalLinkIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── FOOTER BANNER ── */}
      {/* <div className="relative overflow-hidden mt-6 bg-base-100 border border-base-300 rounded-2xl px-6 py-6 text-center shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <SparklesIcon className="w-4 h-4 text-secondary" />
          <UsersIcon className="w-5 h-5 text-primary" />
          <SparklesIcon className="w-4 h-4 text-secondary" />
        </div>
        <h3 className="font-bold text-base-content">All your groups in one place</h3>
        <p className="text-sm text-base-content/50 mt-1">
          Create, manage and connect with your groups easily.
        </p>
      </div> */}

      {/* ── MEMBERS MODAL ── */}
      {showMembersModal && selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-base-100 rounded-2xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden -mt-28 pt-2 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-base-300">
              <div className="flex items-center gap-3">
                <GroupAvatar group={selectedGroup} />
                <div>
                  <h2 className="text-xl font-bold">{selectedGroup.groupName}</h2>
                  <p className="text-sm text-base-content/60">
                    {selectedGroup.memberCount} Members
                  </p>
                </div>
              </div>

              <button
                onClick={closeMembersModal}
                className="btn btn-circle btn-ghost btn-sm"
              >
                ✕
              </button>
            </div>

            {/* Members List */}
            <div className="space-y-2 p-4 overflow-y-auto">
              {loadingMembers ? (
                <div className="py-10 text-center text-sm text-base-content/50">
                  Loading members…
                </div>
              ) : members.length === 0 ? (
                <div className="py-10 text-center text-sm text-base-content/50">
                  No members found in this group.
                </div>
              ) : (
                members.map((member) => (
                  <div
                    key={member.userId}
                    className="group flex items-center justify-between p-4 bg-base-200 border border-base-300/70 rounded-xl hover:border-primary/30 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={resolveImageSrc(member.profilePic)}
                        alt={member.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-base-300"
                        onError={(e) => {
                          e.currentTarget.src = "/avatar.png";
                        }}
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold">{member.name}</h3>

                        <p className="text-sm text-base-content/60">
                          {member.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`badge ${member.role === "admin"
                          ? "badge-primary"
                          : "badge-outline"
                        }`}
                    >
                      {member.role}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-base-300 flex justify-end">
              <button
                onClick={closeMembersModal}
                className="px-4 py-2 rounded-xl border border-base-300 text-sm font-semibold text-base-content/70 hover:bg-base-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGroupsPage;