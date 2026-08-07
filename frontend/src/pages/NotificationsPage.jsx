import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import {
  Bell,
  CheckCheck,
  BellIcon,
  ClockIcon,
  CheckCircleIcon,
  UserPlusIcon,
} from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import { capitalize } from "../lib/utils";
import { getLanguageFlag } from "../components/FriendCard";
import { Helmet } from "react-helmet-async";
import ProfileImage from "../components/ProfileImage.jsx";
import { useNotificationStore } from "../store/useNotificationStore.js";
import { useThemeStore } from "../store/useThemeStore.js";
import { useEffect } from "react";
import toast from "react-hot-toast";

const timeAgo = (dateInput) => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const NotificationsPage = () => {
  const { theme } = useThemeStore();
  const queryClient = useQueryClient();
  const { notifications, fetchMyNotifications, markAllAsRead, markAsRead } =
    useNotificationStore();

  useEffect(() => {
    fetchMyNotifications();
  }, [fetchMyNotifications]);

  const {
    data: friendRequests,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onMutate: async (requestId) => {
      await queryClient.cancelQueries({ queryKey: ["friendRequests"] });
      const previousData = queryClient.getQueryData(["friendRequests"]);

      if (previousData) {
        queryClient.setQueryData(["friendRequests"], {
          ...previousData,
          incomingReqs: (previousData.incomingReqs || []).filter((req) => req._id !== requestId),
        });
      }

      toast.success("Friend request accepted!");
      return { previousData };
    },
    onError: (err, requestId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["friendRequests"], context.previousData);
      }
      toast.error(`${err?.response?.data?.message || "Failed to accept friend request"}. Action rolled back.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="p-6 sm:p-8 max-w-8xl mx-auto space-y-10">
      <Helmet>
        <title>Notifications | MeetFlow</title>
      </Helmet>

      {/* PAGE HEADER */}
      <div
        className="relative flex w-full flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden rounded-2xl px-10 py-7 border border-base-300/50 bg-base-200 backdrop-blur-md shadow-m transition-all duration-200"
      >
        {/* decorative background blobs */}
        <div
          className={`pointer-events-none absolute -right-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full blur-2xl transition-colors duration-200 ${
            theme === "MeetFlow-pro" ? "bg-indigo-100/30" : "bg-indigo-950/20"
          }`}
        />
        <div
          className={`pointer-events-none absolute right-32 top-3 h-4 w-4 rounded-full transition-colors duration-200 ${
            theme === "MeetFlow-pro" ? "bg-indigo-200/30" : "bg-indigo-900/10"
          }`}
        />
        <div
          className={`pointer-events-none absolute right-52 bottom-4 h-3 w-3 rounded-full transition-colors duration-200 ${
            theme === "MeetFlow-pro" ? "bg-indigo-200/20" : "bg-indigo-900/10"
          }`}
        />

        {/* left: title */}
        <div className="relative z-10">
          <h1
            className={`text-2xl font-bold tracking-tight transition-colors duration-200 ${
              theme === "MeetFlow-pro" ? "text-slate-900" : "text-slate-100"
            }`}
          >
            Notifications
          </h1>
          <p
            className={`text-sm mt-1 transition-colors duration-200 ${
              theme === "MeetFlow-pro" ? "text-slate-500" : "text-slate-400"
            }`}
          >
            Stay updated with your professional network
          </p>
        </div>

        {/* center-right: bell illustration */}
        <div className="relative z-10 hidden sm:flex items-center justify-center ml-auto">
          <div
            className={`relative flex h-16 w-16 items-center justify-center rounded-full transition-colors duration-200 ${
              theme === "MeetFlow-pro" ? "bg-indigo-50" : "bg-indigo-950/40"
            }`}
          >
            <Bell
              className={`h-8 w-8 transition-colors duration-200 ${
                theme === "MeetFlow-pro" ? "text-indigo-600" : "text-indigo-400"
              }`}
              strokeWidth={1.75}
              fill="currentColor"
              fillOpacity={0.15}
            />
          </div>
        </div>
      </div>
      {/* right: action button */}
      <div className="relative z-10 flex justify-end">
        <button
          onClick={() => markAllAsRead()}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-all border ${
            theme === "MeetFlow-pro"
              ? "bg-white text-indigo-600 border-slate-200 hover:bg-indigo-50/50"
              : "bg-slate-800 text-indigo-400 border-slate-700 hover:bg-slate-700"
          }`}
        >
          <CheckCheck className="h-4 w-4" strokeWidth={2} />
          Mark all as read
        </button>
      </div>
      {/* LOADING */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <span className="loading loading-spinner loading-md text-primary" />
          <p className="text-xs font-medium text-base-content/40 uppercase tracking-widest">
            Loading notifications...
          </p>
        </div>
      ) : isError ? (
        <div className="alert alert-error rounded-lg py-3 text-sm border-none">
          <span>
            {error?.response?.data?.message ||
              error?.message ||
              "Failed to load notifications"}
          </span>
        </div>
      ) : (
        <div className="space-y-10">
          {/* INCOMING REQUESTS */}
          {incomingRequests.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-semibold text-base-content/50 uppercase tracking-widest flex items-center gap-2">
                Pending Requests
                <span className="badge badge-primary badge-sm font-semibold rounded-full">
                  {incomingRequests.length}
                </span>
              </h2>

              <div className="space-y-3">
                {incomingRequests.map((request) => (
                  <div
                    key={request._id}
                    className="bg-base-100 border border-base-200 rounded-xl p-4 hover:border-base-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="size-11 rounded-lg overflow-hidden ring-1 ring-base-300 shrink-0">
                          <ProfileImage
                            src={request.sender?.profilePic}
                            alt={request.sender?.fullName}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-base-content truncate leading-tight">
                            {request.sender?.fullName}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-base-200 text-base-content/60 px-2 py-0.5 rounded-md">
                              {getLanguageFlag(request.sender?.nativeLanguage)}
                              {capitalize(request.sender?.nativeLanguage)}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                              {getLanguageFlag(
                                request.sender?.learningLanguage,
                              )}
                              {capitalize(request.sender?.learningLanguage)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        className="btn btn-primary btn-sm rounded-lg gap-2 font-medium self-start sm:self-auto shrink-0"
                        onClick={() => acceptRequestMutation(request._id)}
                        disabled={isPending}
                      >
                        <UserPlusIcon className="size-4" />
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ACCEPTED REQUESTS */}
          {acceptedRequests.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-semibold text-base-content/50 uppercase tracking-widest">
                Recent Connections
              </h2>

              <div className="space-y-3">
                {acceptedRequests.map((notification) => (
                  <div
                    key={notification._id}
                    className="bg-base-100 border border-base-200 rounded-xl p-4 hover:border-base-300 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-lg overflow-hidden ring-1 ring-base-300 shrink-0">
                        <ProfileImage
                          src={notification.recipient?.profilePic}
                          alt={notification.recipient?.fullName}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base-content leading-tight truncate">
                          {notification.recipient?.fullName}
                        </h3>
                        <p className="text-sm text-base-content/50 mt-0.5">
                          Accepted your friend request and is ready to connect.
                        </p>
                        <div className="flex items-center gap-1 text-xs text-base-content/30 mt-1.5">
                          <ClockIcon className="size-3" />
                          {timeAgo(notification.createdAt)}
                        </div>
                      </div>
                      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-md border border-success/20 shrink-0">
                        <CheckCircleIcon className="size-3.5" />
                        Connected
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* GENERAL NOTIFICATIONS */}
          {notifications.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-semibold text-base-content/50 uppercase tracking-widest -mt-16 ml-4">
                All Notifications
              </h2>

              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() =>
                      !notification.isRead && markAsRead(notification._id)
                    }
                    className={`bg-base-100 border rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                      notification.isRead
                        ? "border-base-200 opacity-70"
                        : "border-primary/30 shadow-sm bg-base-200/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-lg overflow-hidden ring-1 ring-base-300 shrink-0 bg-base-300 flex items-center justify-center">
                        {notification.sender?.profilePic ? (
                          <ProfileImage
                            src={notification.sender.profilePic}
                            alt={notification.title}
                            className="w-full h-full"
                          />
                        ) : (
                          <BellIcon className="size-5 text-base-content/50" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base-content leading-tight truncate">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-base-content/70 mt-0.5">
                          {notification.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-base-content/40 font-medium">
                          {timeAgo(notification.createdAt)}
                        </span>
                        {!notification.isRead && (
                          <div className="size-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EMPTY STATE */}
          {incomingRequests.length === 0 &&
            acceptedRequests.length === 0 &&
            notifications.length === 0 && <NoNotificationsFound />}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
