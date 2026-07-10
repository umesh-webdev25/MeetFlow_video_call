import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggle2FA } from "../lib/api";
import {
  ShieldIcon,
  ShieldCheckIcon,
  KeyIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircleIcon,
  XCircleIcon,
  SmartphoneIcon,
  GlobeIcon,
  Trash2Icon,
  LogOutIcon,
  AlertTriangleIcon,
  MailIcon,
  CheckIcon,
  MoreVerticalIcon,
} from "lucide-react";

import useAuthUser from "../hooks/useAuthUser";
import toast from "react-hot-toast";
import { useThemeStore } from "../store/useThemeStore";

const SecurityPage = () => {
  const { authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const twoFactorEnabled = authUser?.twoFactorEnabled || false;
  const queryClient = useQueryClient();

  const { mutate: toggle2FAMutation, isPending: is2FAPending } = useMutation({
    mutationFn: toggle2FA,
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], data);
      toast.success(
        data.twoFactorEnabled
          ? "Two-factor authentication enabled"
          : "Two-factor authentication disabled"
      );
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to toggle 2FA");
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saved, setSaved] = useState(false);

  const activeSessions = [
    {
      id: 1,
      device: "Chrome on Windows",
      ip: "192.168.1.1",
      location: "New York, US",
      lastActive: "Active now",
      isCurrent: true,
    },
    {
      id: 2,
      device: "Safari on iPhone",
      ip: "192.168.1.1",
      location: "New York, US",
      lastActive: "2 hours ago",
      isCurrent: false,
    },
  ];

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSaved(true);
    toast.success("Password updated successfully");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setSaved(false), 2000);
  };

  const handleEnable2FA = () => toggle2FAMutation();
  const handleRevokeSession = () => toast.success("Session revoked");
  const handleDeleteAccount = () => toast.error("Account deletion is not available yet");

  const strengthChecks = [
    { label: "At least 6 characters", met: passwordData.newPassword.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(passwordData.newPassword) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(passwordData.newPassword) },
    { label: "Contains number", met: /\d/.test(passwordData.newPassword) },
    { label: "Contains special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) },
  ];

  const strengthScore = strengthChecks.filter((c) => c.met).length;
  const strengthLabel = strengthScore <= 2 ? "Weak" : strengthScore <= 3 ? "Medium" : "Strong";
  const strengthColor =
    strengthScore <= 2 ? "text-rose-500" : strengthScore <= 3 ? "text-amber-500" : "text-emerald-500";
  const strengthBar =
    strengthScore <= 2 ? "bg-rose-500" : strengthScore <= 3 ? "bg-amber-500" : "bg-emerald-500";

  const securityScore = twoFactorEnabled ? 95 : 78;

  return (
    <div className="space-y-6">
      {/* ── SECURITY OVERVIEW ── */}
      <section className={`relative overflow-hidden rounded-2xl border transition-all duration-200 -mt-12 p-6 shadow-m sm:p-7 ${
        theme === "MeetFlow-pro"
          ? "border-slate-100 bg-gradient-to-r from-blue-50/60 via-white to-white"
          : "border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900"
      }`}>
        {/* decorative illustration */}
        <div className="pointer-events-none absolute inset-y-0 right-24 hidden w-72 items-center justify-center lg:flex">
          <svg viewBox="0 0 260 140" className="h-full w-full" fill="none">
            <circle cx="130" cy="70" r="55" stroke={theme === "MeetFlow-pro" ? "#DBEAFE" : "#1E1B4B"} strokeWidth="1.5" />
            <ellipse cx="130" cy="70" rx="90" ry="35" stroke={theme === "MeetFlow-pro" ? "#DBEAFE" : "#1E1B4B"} strokeWidth="1.5" />
            {[
              [40, 40],
              [220, 45],
              [30, 100],
              [230, 95],
              [130, 15],
              [130, 125],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="3" fill={theme === "MeetFlow-pro" ? "#93C5FD" : "#4338CA"} opacity="0.7" />
            ))}
            <g transform="translate(105, 35)">
              <path d="M25 0 L50 9 V40 C50 60 33 72 25 78 C17 72 0 60 0 40 V9 Z" fill={theme === "MeetFlow-pro" ? "#3B82F6" : "#312E81"} opacity="0.15" />
              <path d="M25 8 L45 15 V40 C45 56 31 66 25 71 C19 66 5 56 5 40 V15 Z" fill={theme === "MeetFlow-pro" ? "#60A5FA" : "#4338CA"} opacity="0.5" />
              <rect x="16" y="34" width="18" height="14" rx="3" fill={theme === "MeetFlow-pro" ? "white" : "#1E293B"} />
              <path d="M19 34 V29 a6 6 0 0 1 12 0 V34" stroke={theme === "MeetFlow-pro" ? "white" : "#1E293B"} strokeWidth="2.5" fill="none" />
            </g>
          </svg>
        </div>

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/25">
                <ShieldIcon className="size-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold tracking-tight transition-colors duration-200 ${theme === "MeetFlow-pro" ? "text-slate-900" : "text-slate-100"}`}>Security Center</h2>
                <p className={`mt-0.5 text-sm transition-colors duration-200 ${theme === "MeetFlow-pro" ? "text-slate-500" : "text-slate-400"}`}>Keep your account secure and protected</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                theme === "MeetFlow-pro"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                  : "border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
              }`}>
                <ShieldCheckIcon className="size-3.5" /> Secure
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                theme === "MeetFlow-pro"
                  ? "border-amber-200 bg-amber-50 text-amber-600"
                  : "border-amber-500/20 bg-amber-500/5 text-amber-500"
              }`}>
                <AlertTriangleIcon className="size-3.5" /> Recommendations
              </span>
            </div>
          </div>

          <div className="relative z-10 flex gap-3">
            <div className={`min-w-[140px] rounded-2xl border p-5 shadow-sm transition-colors duration-200 ${
              theme === "MeetFlow-pro" ? "border-slate-100 bg-white" : "border-slate-800 bg-slate-900"
            }`}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/40">
                Security Score
              </p>
              <h3 className={`mt-2 text-3xl font-black transition-colors ${theme === "MeetFlow-pro" ? "text-blue-600" : "text-indigo-400"}`}>
                {securityScore}
                <span className="text-lg font-semibold">%</span>
              </h3>
              <div className={`mt-2.5 h-1.5 w-full overflow-hidden rounded-full transition-colors ${theme === "MeetFlow-pro" ? "bg-slate-100" : "bg-slate-800"}`}>
                <div
                  className={`h-full rounded-full transition-all duration-700 ${theme === "MeetFlow-pro" ? "bg-blue-600" : "bg-indigo-500"}`}
                  style={{ width: `${securityScore}%` }}
                />
              </div>
            </div>
            <div className={`min-w-[140px] rounded-2xl border p-5 shadow-sm transition-colors duration-200 ${
              theme === "MeetFlow-pro" ? "border-slate-100 bg-white" : "border-slate-800 bg-slate-900"
            }`}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/40">
                Active Sessions
              </p>
              <h3 className="mt-2 text-3xl font-black text-base-content">{activeSessions.length}</h3>
              <p className="mt-2.5 text-[11px] text-base-content/40">Current sessions</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROW: CHANGE PASSWORD / TWO-FACTOR AUTH ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        {/* CHANGE PASSWORD */}
        <section className="rounded-2xl border border-base-300/50 bg-base-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 border-b border-base-300/50 px-5 pt-5 pb-4">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10">
              <KeyIcon className="size-4.5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-tight text-base-content">Change Password</h3>
              <p className="mt-0.5 text-xs text-base-content/40">Update your password to keep account secure</p>
            </div>
          </div>

          <div className="space-y-4 p-5">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-base-content/60">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                  className="h-10 w-full rounded-xl border border-base-300 bg-base-100/50 pl-3.5 pr-10 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary focus:bg-base-100 focus:outline-none transition-all duration-200"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 transition-colors hover:text-base-content"
                >
                  {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-base-content/60">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                  className="h-10 w-full rounded-xl border border-base-300 bg-base-100/50 pl-3.5 pr-10 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary focus:bg-base-100 focus:outline-none transition-all duration-200"
                />
                <button
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 transition-colors hover:text-base-content"
                >
                  {showNewPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                </button>
              </div>
            </div>

            {/* Password Strength */}
            {passwordData.newPassword.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-base-300/50 bg-base-100">
                <div className="flex items-center justify-between px-3.5 pt-3.5 pb-2.5">
                  <p className="text-xs font-semibold text-base-content/60">Password Strength</p>
                  <span className={`text-xs font-bold ${strengthColor}`}>{strengthLabel}</span>
                </div>
                <div className="flex gap-1 px-3.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        i <= strengthScore ? strengthBar : "bg-base-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="space-y-1.5 p-3.5">
                  {strengthChecks.map((check, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px]">
                      {check.met ? (
                        <CheckCircleIcon className="size-3 shrink-0 text-emerald-500" />
                      ) : (
                        <XCircleIcon className="size-3 shrink-0 text-base-content/25" />
                      )}
                      <span className={check.met ? "text-base-content/70" : "text-base-content/35"}>{check.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-base-content/60">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  className={`h-10 w-full rounded-xl border bg-base-100/50 pl-3.5 pr-10 text-sm text-base-content placeholder:text-base-content/30 focus:bg-base-100 focus:outline-none focus:ring-2 ${
                    passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword
                      ? "border-rose-300 focus:ring-rose-500/20"
                      : passwordData.confirmPassword && passwordData.confirmPassword === passwordData.newPassword
                      ? "border-emerald-300 focus:ring-emerald-500/20"
                      : "border-base-300 focus:border-primary focus:ring-primary/20"
                  }`}
                />
                <button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 transition-colors hover:text-base-content"
                >
                  {showConfirmPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                </button>
              </div>
              {passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword && (
                <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                  <XCircleIcon className="size-3" /> Passwords don't match
                </p>
              )}
            </div>

            <button
              onClick={handlePasswordChange}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-sm font-semibold text-white shadow-sm shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {saved ? (
                <>
                  <CheckIcon className="size-4" /> Updated!
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </section>

        {/* TWO-FACTOR AUTH */}
        <section className="overflow-hidden rounded-2xl border border-base-300/50 bg-base-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-base-300/50 px-6 pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10">
                <ShieldIcon className="size-4.5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-tight text-base-content">
                  Two-Factor Authentication
                </h3>
                <p className="mt-0.5 text-xs text-base-content/40">Add an extra layer of security to your account</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                twoFactorEnabled
                  ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-600"
                  : "border-amber-500/20 bg-amber-500/5 text-amber-600"
              }`}
            >
              <span className={`size-1.5 rounded-full ${twoFactorEnabled ? "bg-emerald-500" : "bg-amber-500"}`} />
              {twoFactorEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2">
            {/* Email verification card */}
            <div
              className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${
                twoFactorEnabled ? "border-emerald-500/20 bg-emerald-500/5" : "border-base-300/50 bg-base-100"
              }`}
            >
              <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-blue-500/10">
                <MailIcon className="size-5 text-blue-600" />
              </div>
              <h4 className="text-sm font-semibold text-base-content">Email Verification</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-base-content/50">
                Receive codes via email to verify your identity
              </p>
              <p className="mt-3 text-[11px] text-base-content/40">
                Secured delivery · Easy to use · Reliable
              </p>
              <button
                onClick={handleEnable2FA}
                disabled={is2FAPending}
                className={`mt-5 flex h-10 w-full items-center justify-center rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
                  twoFactorEnabled
                    ? "border border-rose-500/20 bg-base-100 text-rose-500 hover:bg-rose-500/10"
                    : "bg-gradient-to-r from-primary to-blue-500 text-white shadow-sm shadow-primary/20 hover:scale-[1.02]"
                }`}
              >
                {is2FAPending ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : twoFactorEnabled ? (
                  "Disable 2FA"
                ) : (
                  "Enable 2FA"
                )}
              </button>
            </div>

            {/* Why enable 2FA */}
            <div className="relative overflow-hidden rounded-2xl border border-base-300/50 bg-base-100 p-5">
              <div className="pointer-events-none absolute -right-4 -top-4 opacity-40">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="45" stroke={theme === "MeetFlow-pro" ? "#DBEAFE" : "#1E1B4B"} strokeWidth="1.5" />
                  {[
                    [20, 30],
                    [95, 40],
                    [15, 85],
                    [100, 90],
                  ].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="2.5" fill={theme === "MeetFlow-pro" ? "#93C5FD" : "#4338CA"} />
                  ))}
                  <path
                    d="M50 20 L70 27 V50 C70 63 60 71 50 76 C40 71 30 63 30 50 V27 Z"
                    fill={theme === "MeetFlow-pro" ? "#3B82F6" : "#312E81"}
                    opacity="0.15"
                  />
                </svg>
              </div>
              <h4 className="relative text-sm font-semibold text-base-content">Why enable 2FA?</h4>
              <ul className="relative mt-3 space-y-2.5">
                {[
                  "Protects your account even if your password leaks",
                  "Blocks unauthorized login attempts",
                  "Recommended by all security experts",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-base-content/60">
                    <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* ── ROW: ACTIVE SESSIONS / DANGER ZONE ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        {/* ACTIVE SESSIONS */}
        <section className="overflow-hidden rounded-2xl border border-base-300/50 bg-base-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-base-300/50 px-5 pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10">
                <SmartphoneIcon className="size-4.5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-tight text-base-content">Active Sessions</h3>
                <p className="mt-0.5 text-xs text-base-content/40">Manage devices logged in to your account</p>
              </div>
            </div>
            <span className="text-xs font-medium text-base-content/40">{activeSessions.length} devices</span>
          </div>

          <div className="space-y-2.5 p-4">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-center justify-between gap-2 rounded-xl border p-3.5 transition-colors ${
                  session.isCurrent ? "border-primary/20 bg-primary/5" : "border-base-300/50 bg-base-100"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                      session.isCurrent ? "bg-primary/10" : "bg-base-200"
                    }`}
                  >
                    <GlobeIcon className={`size-3.5 ${session.isCurrent ? "text-primary" : "text-base-content/50"}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-xs font-semibold text-base-content">{session.device}</p>
                      {session.isCurrent && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                          <span className="size-1 rounded-full bg-primary animate-pulse" />
                          Current
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-base-content/40">
                      {session.location} · {session.lastActive}
                    </p>
                  </div>
                </div>
                {session.isCurrent ? (
                  <button className="shrink-0 text-base-content/30 hover:text-base-content/50">
                    <MoreVerticalIcon className="size-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleRevokeSession}
                    className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-rose-500 transition-colors hover:bg-rose-500/10"
                  >
                    <LogOutIcon className="size-3" />
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* DANGER ZONE */}
        <section className="overflow-hidden rounded-2xl border border-rose-500/20 bg-rose-500/5">
          <div className="flex items-center gap-3 border-b border-rose-500/10 px-6 pt-5 pb-4">
            <div className="flex size-9 items-center justify-center rounded-xl bg-rose-500/10">
              <AlertTriangleIcon className="size-4.5 text-rose-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-tight text-slate-900">Danger Zone</h3>
              <p className="mt-0.5 text-xs text-rose-400">Irreversible account actions</p>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-rose-500/10 bg-base-100 p-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold text-slate-800">Delete Account</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  Permanently remove your account, profile, and all associated data. This action cannot be undone.
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-rose-500/20 px-5 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-500/10"
              >
                <Trash2Icon className="size-4" />
                Delete
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SecurityPage;