import React, { useState } from 'react';
import {
  Folder,
  ArrowRight,
  Search,
  Filter,
  MoreVertical,
  Building,
  Gamepad2,
  GraduationCap,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CARD_STYLES = [
  { bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', icon: Building },
  { bg: 'bg-pink-50 dark:bg-pink-500/10', text: 'text-pink-600 dark:text-pink-400', icon: Gamepad2 },
  { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', icon: GraduationCap },
  { bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', icon: Heart }
];

const getStatusDisplay = (status, idx) => {
  const finalStatus = status || (idx === 0 ? 'active' : idx === 1 ? 'scheduled' : idx === 2 ? 'active' : 'inactive');
  if (finalStatus === 'active') return { dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', label: 'Active' };
  if (finalStatus === 'scheduled') return { dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', label: 'Scheduled' };
  return { dot: 'bg-base-content/30', text: 'text-base-content/60', label: 'Inactive' };
};

const RecentGroups = ({ groups = [], onDelete }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups =
    groups?.filter(
      (group) =>
        (group.groupName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (group.groupBio?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <section className="w-[800px] max-w-5xl mx-auto border border-base-300 rounded-2xl bg-base-200/50 backdrop-blur-sm p-6 shadow-sm -mt-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Folder className="w-5 h-5 text-primary" strokeWidth={2.5} />
          </div>
          <h2 className="text-[25px] font-bold leading-none tracking-tight text-base-content">
            Recent Groups
          </h2>
        </div>
        <button
          onClick={() => navigate('/groups')}
          className="text-sm font-bold text-primary flex items-center gap-1.5 group hover:text-primary-focus transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
        </button>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-base-200 border border-base-300 rounded-xl text-sm font-medium placeholder-base-content/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
          />
        </div>

        {/* Filter Button */}
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-base-200 border border-base-300 rounded-xl text-sm font-bold text-base-content/70 hover:bg-base-300 hover:text-base-content transition-colors shadow-sm shrink-0">
          <Filter className="w-4 h-4" strokeWidth={2.2} />
          Filter
        </button>
      </div>

      {/* GROUPS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGroups.length > 0 ? (
          filteredGroups.slice(0, 4).map((group, idx) => {
            const style = CARD_STYLES[idx % 4];
            const status = getStatusDisplay(group.status, idx);
            const displayMembers = group.members?.slice(0, 3) || [];
            const extraCount = Math.max((group.members?.length || 0) - 3, 0);
            const membersCount = group.members?.length || 0;

            return (
              <div
                key={group._id || idx}
                className=" bg-base-200 border border-base-300/70 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* TOP CARD ROW */}
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className={`w-14 w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${style.bg} ${style.text}`}>
                      {group.groupImage || group.image ? (
                        <img
                          src={group.groupImage || group.image}
                          alt={group.groupName}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <style.icon className="w-6 h-6" strokeWidth={2.2} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="font-bold text-base text-base-content truncate">
                        {group.groupName}
                      </h3>
                      <p className="text-xs font-medium text-base-content/60 line-clamp-2 mt-1 leading-relaxed">
                        {group.groupBio || "No description provided for this group."}
                      </p>
                    </div>

                    <button
                      onClick={() => onDelete?.(group._id)}
                      className="text-base-content/30 hover:text-base-content/70 transition-colors p-1.5 rounded-lg hover:bg-base-200 shrink-0"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* AVATARS & STATUS BAR */}
                  <div className="flex items-center gap-4 py-2 border-t border-base-200">
                    {/* User Stacks */}
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {displayMembers.map((member, i) => (
                          <img
                            key={member.userId?._id || i}
                            src={
                              member.userId?.profilePic ||
                              "https://ui-avatars.com/api/?name=" +
                              encodeURIComponent(member.userId?.fullName || "User")
                            }
                            alt={member.userId?.fullName || "Member"}
                            title={member.userId?.fullName}
                            className="w-10 h-10 rounded-full border-2 border-base-100 object-cover bg-base-200"
                          />
                        ))}
                      </div>
                      {extraCount > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 bg-base-200 rounded-md text-[10px] font-extrabold text-base-content/70">
                          +{extraCount}
                        </span>
                      )}
                    </div>

                    {/* Divider Line */}
                    <div className="w-px h-3 bg-base-300" />

                    {/* Status badge */}
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      <span className={`text-xs font-bold ${status.text}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM ACTION ROW */}
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-base-200">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-base-content/40">
                      {membersCount} Members
                    </span>
                    <span className="text-[10px] font-medium text-base-content/30" title="Created on">
                      Created: {new Date(group.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/groups/${group._id}`)}
                    className="text-xs font-bold text-primary flex items-center gap-1 hover:text-primary-focus group/btn"
                  >
                    Open
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-12 bg-base-200 border border-base-300/60 rounded-xl">
            <Folder className="w-8 h-8 text-base-content/20 mb-2" />
            <p className="text-sm font-bold text-base-content/50">
              No groups found
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentGroups;