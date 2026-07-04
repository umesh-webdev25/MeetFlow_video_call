import React, { useState } from 'react';
import { User, Search, SlidersHorizontal, MoreVertical, ArrowRight } from 'lucide-react';

const ContactsOverview = ({ contacts = [], onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts?.filter(contact =>
    (contact.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (contact.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  ) || [];

  const getStatusDisplay = (status, idx) => {
    const finalStatus = status?.toLowerCase() || (idx % 3 === 0 ? 'online' : idx % 3 === 1 ? 'away' : 'offline');
    switch (finalStatus) {
      case 'online':
        return { dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', label: 'Online' };
      case 'away':
        return { dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', label: 'Away' };
      default:
        return { dot: 'bg-base-content/30', text: 'text-base-content/50', label: 'Offline' };
    }
  };

  return (
    <section className="w-full max-w-[1400px] mx-auto border border-base-300 rounded-2xl bg-base-200/50 backdrop-blur-sm p-6 shadow-sm flex flex-col -mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <User className="size-5 text-primary" strokeWidth={2.5} />
          </div>
          <h2 className="text-[25px] font-bold leading-none tracking-tight text-base-content">Contacts Overview</h2>
        </div>
        <button className="flex items-center gap-1.5 text-sm font-bold text-primary group hover:text-primary-focus transition-colors">
          Manage All
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-base-200 border border-base-300 rounded-xl text-sm font-medium placeholder-base-content/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-inner text-base-content"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-base-200 border border-base-300 rounded-xl text-sm font-bold text-base-content/70 hover:bg-base-300 hover:text-base-content transition-colors shadow-sm shrink-0">
          <SlidersHorizontal className="size-4" strokeWidth={2.2} />
          Filter
        </button>
      </div>

      {/* Contacts Grid Layout */}
      <div className="grid grid-cols-1 gap-2">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact, idx) => {
            const statusConfig = getStatusDisplay(contact.status, idx);
            const timeAgo = contact.lastActive || (idx === 0 ? '2 min ago' : idx === 1 ? '5 min ago' : idx === 2 ? '15 min ago' : '2 hours ago');

            return (
              <div
                key={contact._id || idx}
                className="w-full flex items-center justify-between p-5 bg-base-200 border border-base-300 rounded-2xl shadow-sm hover:shadow-md transition-all
"
              >
                {/* Left Side: Profile Photo & Text Stack */}
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={contact.contactImage || contact.avatar || `https://i.pravatar.cc/150?u=${contact._id || idx}`}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-[15px] text-base-content tracking-tight">
                      {contact.name || "Umesh Gayakwad"}
                    </h4>
                    <p className="text-xs font-medium text-base-content/40 mt-0.5">
                      {contact.designation || "DevOps Engineer"}
                    </p>
                  </div>
                </div>

                {/* Right Side: Status Metrics & Actions (Matches image_74cf86.png exactly) */}
                <div className="flex items-center gap-5 shrink-0">
                  {/* Status Info Stack */}
                  <div className="flex flex-col items-end justify-center">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                      <span className={`text-xs font-bold ${statusConfig.text}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-base-content/40 mt-1">
                      {timeAgo}
                    </span>
                  </div>

                  {/* Vertical Options Trigger */}
                  <button
                    onClick={() => onDelete?.(contact._id)}
                    className="text-base-content/40 hover:text-base-content/70 transition-colors p-1"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 xl:col-span-3 flex flex-col items-center justify-center py-12 bg-base-200 border border-base-300/60 rounded-xl">
            <User className="size-8 text-base-content/20 mb-2" />
            <p className="text-sm font-bold text-base-content/50">No contacts found</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactsOverview;