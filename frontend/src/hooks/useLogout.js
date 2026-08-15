import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import { useMeetingStore } from "../store/useMeetingStore";

const useLogout = () => {
  const queryClient = useQueryClient();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear all react-query cache (clearing authUser, groups, contacts, etc.)
      queryClient.clear();
      // Reset meeting store state
      useMeetingStore.getState().clearMeetingState();
      // Force full window reload/redirect to login page to wipe out memory state, sockets, Stream clients
      window.location.href = "/login";
    },
    onError: (err) => {
      console.error("Logout failed:", err);
      // Fallback: still redirect to login to force clear
      queryClient.clear();
      window.location.href = "/login";
    }
  });

  return { logoutMutation, isPending, error };
};
export default useLogout;
