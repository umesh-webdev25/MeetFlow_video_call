import React from 'react';
import { motion } from 'framer-motion';
import { ActivityIcon, CalendarIcon, UsersIcon, UserIcon, ArrowUpIcon, VideoIcon, MessagesSquareIcon, Trash2Icon } from 'lucide-react';

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const DashboardStats = ({ stats }) => {
  const cards = [
    {
      label: "Total Groups",
      value: stats.totalGroups,
      trend: "up",
      trendValue: "20%",
      trendLabel: "this month",
      icon: UsersIcon,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Total Contacts",
      value: stats.totalContacts,
      trend: "up",
      trendValue: "15%",
      trendLabel: "this month",
      icon: UserIcon,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "Active Groups",
      value: stats.activeGroups,
      trend: "up",
      trendValue: "10%",
      trendLabel: "this month",
      icon: ActivityIcon,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Upcoming Meetings",
      value: stats.upcomingMeetings,
      trend: "neutral",
      trendValue: "",
      trendLabel: `Today ${stats.todayMeetings || 0} meetings`,
      icon: CalendarIcon,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      label: "Total Sessions",
      value: stats.totalSessions,
      trend: "up",
      trendValue: "5%",
      trendLabel: "this month",
      icon: VideoIcon,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      label: "Total Messages",
      value: stats.totalMessages,
      trend: "up",
      trendValue: "12%",
      trendLabel: "this month",
      icon: MessagesSquareIcon,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Deleted Groups",
      value: stats.deletedGroups,
      trend: "down",
      trendValue: "2%",
      trendLabel: "this month",
      icon: Trash2Icon,
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
    {
      label: "Deleted Contacts",
      value: stats.deletedContacts,
      trend: "down",
      trendValue: "1%",
      trendLabel: "this month",
      icon: Trash2Icon,
      color: "text-rose-500",
      bg: "bg-rose-50",
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <motion.div
          key={card.label}
          variants={statVariants}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="
  w-[380px]
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
          <div className={`w-20 h-20 border-xs rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0 mr-4 sm:mr-5`}>
            <card.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${card.color}`} />
          </div>

          <div className="flex flex-col">
            <p className="text-[13px] sm:text-sm font-bold text-base-content/60 mb-0.5">
              {card.label}
            </p>
            <h2 className="text-[40px] font-bold text-base-content leading-none mb-1.5 sm:mb-2">
              {card.value}
            </h2>

            <div className="flex items-center text-[11px] sm:text-[12px] font-bold">
              {card.trend === "up" && (
                <span className="text-emerald-500 flex items-center gap-1">
                  <ArrowUpIcon className="w-3 h-3" strokeWidth={3} />
                  {card.trendValue} {card.trendLabel}
                </span>
              )}
              {card.trend === "down" && (
                <span className="text-rose-500 flex items-center gap-1">
                  <ArrowUpIcon className="w-3 h-3 rotate-180" strokeWidth={3} />
                  {card.trendValue} {card.trendLabel}
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
  );
};

export default DashboardStats;
