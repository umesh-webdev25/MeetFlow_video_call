import useAuthUser from "../hooks/useAuthUser";
import { useThemeStore } from "../store/useThemeStore";
import {
  SettingsIcon,
  MonitorIcon,
  SaveIcon,
  CheckIcon,
  CrownIcon,
  RadioIcon,
  FileTextIcon,
  Volume2Icon,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const DAISY_THEMES = [
  // LIGHT THEMES
  { name: "MeetFlow-pro", label: "MeetFlow Pro", type: "light" },
  { name: "light", label: "Light", type: "light" },
  { name: "cupcake", label: "Cupcake", type: "light" },
  { name: "emerald", label: "Emerald", type: "light" },
  { name: "pastel", label: "Pastel", type: "light" },

  // DARK THEMES
  { name: "MeetFlow-dark", label: "MeetFlow Dark", type: "dark" },
  { name: "dark", label: "Dark", type: "dark" },
  { name: "dracula", label: "Dracula", type: "dark" },
  { name: "night", label: "Night", type: "dark" },
  { name: "luxury", label: "Luxury", type: "dark" },
];

const THEME_SWATCHES = {
  "MeetFlow-pro": ["#2563EB", "#60A5FA", "#DBEAFE"],
  light: ["#3B82F6", "#93C5FD", "#DBEAFE"],
  cupcake: ["#65C3C8", "#EF9FBC", "#EEAF3A"],
  emerald: ["#66CC8A", "#377CFB", "#EA5234"],
  pastel: ["#D1C1D7", "#F6CBD1", "#B4E9D6"],
  "MeetFlow-dark": ["#3B82F6", "#818CF8", "#93C5FD"],
  dark: ["#3B82F6", "#818CF8", "#93C5FD"],
  dracula: ["#BD93F9", "#FF79C6", "#8BE9FD"],
  night: ["#38BDF8", "#818CF8", "#7DD3FC"],
  luxury: ["#FFFFFF", "#D4AF37", "#1E293B"],
};

const DISPLAY_TOGGLES = [
  {
    key: "onlineStatus",
    icon: RadioIcon,
    title: "Online Status",
    description: "Show when you're active",
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    key: "readReceipts",
    icon: FileTextIcon,
    title: "Read Receipts",
    description: "Let others know you've read their messages",
    color: "text-indigo-500 bg-indigo-500/10",
  },
  {
    key: "soundEffects",
    icon: Volume2Icon,
    title: "Sound Effects",
    description: "Play sounds for messages and calls",
    color: "text-orange-500 bg-orange-500/10",
  },
];


const PreferencesPage = () => {
  const { authUser } = useAuthUser();
  const { theme, setTheme } = useThemeStore();
  const [display, setDisplay] = useState({
    onlineStatus: true,
    readReceipts: true,
    soundEffects: true,
  });
  const [saved, setSaved] = useState(false);

  const toggleDisplay = (key) => {
    setDisplay((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    toast.success("Preferences saved");
    setTimeout(() => setSaved(false), 2000);
  };

  const lightThemes = DAISY_THEMES.filter((t) => t.type === "light");
  const darkThemes = DAISY_THEMES.filter((t) => t.type === "dark");

  const renderThemeCard = (t) => {
    const active = theme === t.name;
    const swatches = THEME_SWATCHES[t.name] || ["#94A3B8", "#CBD5E1", "#E2E8F0"];

    return (
      <button
        key={t.name}
        onClick={() => setTheme(t.name)}
        className={`relative p-3 rounded-xl border-2 transition-all text-center ${
          active
            ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
            : "border-base-300/50 hover:border-base-300 hover:bg-base-200/50 bg-base-100"
        }`}
      >
        <div className="mb-2 flex justify-center gap-1.5">
          {swatches.map((c, i) => (
            <div key={i} className="size-3 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </div>
        <span
          className={`text-[10px] font-semibold ${
            active ? "text-primary" : "text-base-content/60"
          }`}
        >
          {t.label}
        </span>
        {active && (
          <div className="absolute -top-1 -right-1 size-4 bg-primary rounded-full flex items-center justify-center">
            <CheckIcon className="size-2.5 text-primary-content" strokeWidth={3} />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* THEME SELECTOR */}
      <section className="backdrop-blur-md bg-base-200 border border-base-300/50 rounded-2xl p-6 sm:p-7 shadow-m space-y-5 -mt-10 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <SettingsIcon className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-base-content tracking-tight">
                Theme
              </h3>
              <p className="text-sm text-base-content/40 mt-0.5">
                Choose your visual style
              </p>
            </div>
          </div>
          <div className="badge badge-outline badge-sm text-base-content/40 gap-1.5 py-3">
            <CrownIcon className="size-3.5 text-amber-500" />
            {DAISY_THEMES.find((t) => t.name === theme)?.label || theme}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold text-base-content/40 uppercase tracking-wider mb-3">
              Light Themes
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {lightThemes.map((t) => renderThemeCard(t))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-base-content/40 uppercase tracking-wider mb-3">
              Dark Themes
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {darkThemes.map((t) => renderThemeCard(t))}
            </div>
          </div>
        </div>
      </section>

      {/* DISPLAY */}
      <section className="backdrop-blur-md bg-base-200 border border-base-300/50 rounded-2xl p-6 sm:p-7 shadow-m space-y-5 transition-all duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <MonitorIcon className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-base-content tracking-tight">
              Display
            </h3>
            <p className="text-sm text-base-content/40 mt-0.5">
              Customize your viewing experience
            </p>
          </div>
        </div>

        <div className="space-y-1">
          {DISPLAY_TOGGLES.map(({ key, icon: Icon, title, description, color }) => (
            <label
              key={key}
              className="flex items-center justify-between p-4 rounded-xl bg-base-200/40 border border-base-300/50 cursor-pointer hover:bg-base-200/70 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`flex size-10 items-center justify-center rounded-lg ${color}`}>
                  <Icon className="size-4.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-base-content">{title}</p>
                  <p className="text-xs text-base-content/40 mt-0.5">{description}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={display[key]}
                onChange={() => toggleDisplay(key)}
                className="toggle toggle-primary"
              />
            </label>
          ))}
        </div>
      </section>

      {/* SAVE */}
      <div className="flex justify-end pb-4">
        <button
          onClick={handleSave}
          className="btn bg-gradient-to-r from-primary to-blue-500 text-white border-none px-8 rounded-xl font-bold shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 gap-2"
        >
          {saved ? (
            <>
              <CheckIcon className="size-4" />
              Saved
            </>
          ) : (
            <>
              <SaveIcon className="size-4" />
              Save Preferences
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PreferencesPage;