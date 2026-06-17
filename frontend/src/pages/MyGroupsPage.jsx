import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyGroups, getAllContacts } from "../lib/api";
import {
  GroupIcon,
  CalendarIcon,
  VideoIcon,
  ActivityIcon,
  UsersIcon,
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

const MyGroupsPage = () => {
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const openMembersModal = async (group) => {
    try {
      setSelectedGroup(group);
      setShowMembersModal(true);
      setLoadingMembers(true);

      const data = await getAllContacts();

      const filteredMembers = (data || []).filter((contact) => {
        const cid =
          typeof contact.groupId === "object"
            ? contact.groupId?._id
            : contact.groupId;

        return cid === group.groupId;
      });

      setMembers(filteredMembers);
    } catch (error) {
      console.error("Failed to load members:", error);
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const closeMembersModal = () => {
    setShowMembersModal(false);
    setSelectedGroup(null);
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
        setGroups(data || []);
      } catch (err) {
        console.error("Failed to fetch my groups:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyGroups();
  }, []);

  return (
    <div className="h-full bg-base-200 p-4 md:p-6 font-sans">
      <Helmet>
        <title>My Groups | MeetFlow</title>
      </Helmet>

      {/* ── PAGE HEADER ── */}
      <div className="flex items-center justify-between mb-6 bg-base-100 border border-base-300 rounded-2xl px-6 py-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <GroupIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">My Groups</h1>
            <p className="text-sm text-base-content/50 mt-1">
              Groups where you are a member or an admin
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {groups.map((group) => (
          <div
            key={group.groupId}
            onClick={() => navigate(`/groups/${group.groupId}`)}
            className="bg-base-100 border border-base-300 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Group Info */}
              <div className="flex items-center gap-4 min-w-[250px] flex-1">
                <img
                  src={resolveImageSrc(group.groupImage)}
                  alt={group.groupName}
                  className="w-14 h-14 rounded-xl object-cover border border-base-300"
                  onError={(e) => {
                    e.currentTarget.src = "/group.png";
                  }}
                />

                <div>
                  <h3 className="font-bold text-lg">{group.groupName}</h3>
                  <div className="flex items-center gap-2 text-sm text-base-content/60">
                    <UsersIcon className="w-4 h-4" />
                    <span>{group.memberCount} Members</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Meetings */}
              <div className="flex items-center gap-2 min-w-[120px]">
                <CalendarIcon className="w-4 h-4 text-secondary" />
                <div>
                  <p className="text-xs text-base-content/60">Upcoming</p>
                  <p className="font-semibold">{group.upcomingMeetingCount}</p>
                </div>
              </div>

              {/* Status */}
              <div className="min-w-[120px]">
                {group.activeMeeting ? (
                  <div className="badge badge-success gap-2 py-3">
                    <ActivityIcon className="w-4 h-4 animate-pulse" />
                    Live Now
                  </div>
                ) : (
                  <div className="badge badge-ghost gap-2 py-3">
                    <VideoIcon className="w-4 h-4" />
                    Offline
                  </div>
                )}
              </div>

              {/* Action */}
              <div>
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
              </div>
            </div>
          </div>
        ))}
      </div>

      {showMembersModal && selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ">
          <div className="bg-base-100 rounded-2xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden -mt-28 pt-2">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-base-300">
              <div className="flex items-center gap-2">
                <img
                  src={resolveImageSrc(selectedGroup.groupImage)}
                  className="w-14 h-14 rounded-xl object-cover border border-base-300"
                  onError={(e) => {
                    e.currentTarget.src = "/group.png";
                  }}
                />
                <h2 className="text-xl font-bold">{selectedGroup.groupName}</h2>
                <p className="text-sm text-base-content/60">
                  {selectedGroup.memberCount} Members
                </p>
              </div>

              <button
                onClick={closeMembersModal}
                className="btn btn-circle btn-ghost btn-sm"
              >
                ✕
              </button>
            </div>

            {/* Members List */}
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member._id}
                  className="group flex items-center justify-between p-4 bg-base-100 border border-base-300 rounded-xl hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Left Section */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Profile Image */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={resolveImageSrc(member.contactImage)}
                        alt={member.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-base-300 shadow-sm"
                        onError={(e) => {
                          e.currentTarget.src = "/avatar.png";
                        }}
                      />

                      {/* Online Dot */}
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success rounded-full border-2 border-base-100"></span>
                    </div>

                    {/* User Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-base-content truncate">
                          {member.name}
                        </h3>

                        {member.designation && (
                          <span className="badge badge-primary badge-outline badge-sm">
                            {member.designation}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-base-content/70 truncate">
                        {member.email}
                      </p>

                      {member.mobileNumber && (
                        <p className="text-xs text-base-content/50 mt-1">
                          {member.mobileNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Section */}
                  {/* <div className="hidden md:flex flex-col items-end">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        member.status === "active"
                          ? "bg-green-100 text-green-700"
                          : member.status === "inactive"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div> */}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-base-300 flex justify-end"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGroupsPage;
