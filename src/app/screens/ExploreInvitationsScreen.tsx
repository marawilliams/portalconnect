import { Eye, MessageCircle, MapPin, User, Calendar } from "lucide-react";
import { TopBar } from "../components/TopBar";

export interface Invitation {
  id: number;
  tag: "Local" | "Tourist";
  name?: string;
  ageRange: string;
  category: string;
  tags: string[];
  invitationTitle: string;
  description: string;
  avatarColor: string;
  timeline: string;
}

export const MOCK_INVITATIONS: Invitation[] = [
  {
    id: 1,
    tag: "Local",
    name: "Nikos",
    ageRange: "25–34",
    category: "Food & Dining",
    tags: ["Food & Dining", "Exploring the City"],
    invitationTitle: "Discover Hidden Tavernas",
    description: "I know the best local spots tourists never find, want to join me for a proper Cretan dinner tonight?",
    avatarColor: "#c7d2fe",
    timeline: "Today",
  },
  {
    id: 2,
    tag: "Tourist",
    ageRange: "18–24",
    name: "Priya",
    category: "Food & Dining",
    tags: ["Food & Dining"],
    invitationTitle: "Street Food Hunt",
    description: "Looking for someone to explore the street food scene with me today, I heard the market is amazing!",
    avatarColor: "#fed7aa",
    timeline: "Today",
  },
  {
    id: 3,
    tag: "Tourist",
    name: "Sarah",
    ageRange: "18–24",
    category: "Hiking",
    tags: ["Hiking", "Photography"],
    invitationTitle: "Samaria Gorge Hike",
    description: "Planning to hike Samaria Gorge tomorrow, would love a hiking buddy to share the experience with!",
    avatarColor: "#fde68a",
    timeline: "Tomorrow",
  },
  {
    id: 4,
    tag: "Local",
    name: "Kostas",
    ageRange: "35–49",
    category: "Hiking",
    tags: ["Hiking"],
    invitationTitle: "Morning Trail Run",
    description: "I go trail running every morning near the old city walls, anyone keen to join for a scenic run?",
    avatarColor: "#bbf7d0",
    timeline: "This Week",
  },
  {
    id: 5,
    tag: "Tourist",
    name: "Emma",
    ageRange: "25–34",
    category: "Shopping",
    tags: ["Shopping", "Arts & Culture"],
    invitationTitle: "Thrift Shop Adventure",
    description: "My partner and I are on a mission to find the best thrift shops in Heraklion, come with us!",
    avatarColor: "#a7f3d0",
    timeline: "This Week",
  },
  {
    id: 6,
    tag: "Local",
    name: "Irini",
    ageRange: "18–24",
    category: "Shopping",
    tags: ["Shopping"],
    invitationTitle: "Saturday Market Guide",
    description: "Happy to show visitors around the Saturday market and help find the best local crafts and produce.",
    avatarColor: "#fbcfe8",
    timeline: "This Week",
  },
  {
    id: 7,
    tag: "Local",
    name: "Manolis",
    ageRange: "35–49",
    category: "Food & Dining",
    tags: ["Food & Dining", "Nightlife"],
    invitationTitle: "Paideia Restaurant Dinner",
    description: "Trying out the highly recommended Paideia restaurant with friends, anyone is welcome to join us!",
    avatarColor: "#fca5a5",
    timeline: "Next Week",
  },
  {
    id: 8,
    tag: "Tourist",
    name: "Lena",
    ageRange: "25–34",
    category: "Arts & Culture",
    tags: ["Arts & Culture", "History"],
    invitationTitle: "Heraklion Museum Visit",
    description: "Heading to the Archaeological Museum of Heraklion, would love a culture buddy to explore it with!",
    avatarColor: "#ddd6fe",
    timeline: "Tomorrow",
  },
  {
    id: 9,
    tag: "Local",
    name: "Eleni",
    ageRange: "18–24",
    category: "Arts & Culture",
    tags: ["Arts & Culture", "Music"],
    invitationTitle: "Local Art Gallery Tour",
    description: "There's a great new exhibition opening this weekend, I'd love to show it to someone visiting the city.",
    avatarColor: "#e9d5ff",
    timeline: "This Week",
  },
  {
    id: 10,
    tag: "Tourist",
    name: "Jake",
    ageRange: "18–24",
    category: "Music",
    tags: ["Music", "Nightlife"],
    invitationTitle: "Live Music Night Out",
    description: "Looking for someone to check out the live music scene in Heraklion tonight, anyone know good spots?",
    avatarColor: "#fef08a",
    timeline: "Today",
  },
  {
    id: 11,
    tag: "Local",
    name: "Stavros",
    ageRange: "25–34",
    category: "Music",
    tags: ["Music"],
    invitationTitle: "Rooftop Concert Tonight",
    description: "There's a rooftop concert tonight with local Cretan musicians, come enjoy the views and the sounds!",
    avatarColor: "#bfdbfe",
    timeline: "Today",
  },
  {
    id: 12,
    tag: "Tourist",
    name: "Marco",
    ageRange: "35–49",
    category: "Nightlife",
    tags: ["Nightlife", "Food & Dining"],
    invitationTitle: "Bar Crawl Companions",
    description: "Planning a relaxed bar crawl through the old harbour area, looking for fun people to explore with.",
    avatarColor: "#fecdd3",
    timeline: "Tomorrow",
  },
  {
    id: 13,
    tag: "Local",
    name: "Petros",
    ageRange: "25–34",
    category: "History",
    tags: ["History", "Arts & Culture"],
    invitationTitle: "Knossos Palace Tour",
    description: "I visit Knossos often and love sharing the history, happy to give an informal tour to curious visitors.",
    avatarColor: "#d1fae5",
    timeline: "Next Week",
  },
  {
    id: 14,
    tag: "Tourist",
    name: "Chloe",
    ageRange: "18–24",
    category: "History",
    tags: ["History"],
    invitationTitle: "Old City Walls Walk",
    description: "Want to walk the Venetian walls around the old city, looking for someone interested in the history.",
    avatarColor: "#fde68a",
    timeline: "This Week",
  },
  {
    id: 15,
    tag: "Tourist",
    name: "Yuki",
    ageRange: "25–34",
    category: "Photography",
    tags: ["Photography", "Exploring the City"],
    invitationTitle: "Golden Hour Photo Walk",
    description: "Planning a golden hour walk through the old harbour to shoot photos, any photographers want to join?",
    avatarColor: "#fee2e2",
    timeline: "Tomorrow",
  },
  {
    id: 16,
    tag: "Local",
    name: "Giorgos",
    ageRange: "18–24",
    category: "Photography",
    tags: ["Photography", "Hiking"],
    invitationTitle: "Sunrise at the Fortress",
    description: "I shoot the Koules Fortress at sunrise, it's magical and I'd love to share it with a fellow photographer.",
    avatarColor: "#cffafe",
    timeline: "Tomorrow",
  },
  {
    id: 17,
    tag: "Tourist",
    name: "Alex",
    ageRange: "18–24",
    category: "Sports",
    tags: ["Sports"],
    invitationTitle: "Beach Volleyball Partner",
    description: "Looking for a beach volleyball partner for this afternoon, any skill level welcome, just want to play!",
    avatarColor: "#dcfce7",
    timeline: "Today",
  },
  {
    id: 18,
    tag: "Local",
    name: "Takis",
    ageRange: "18–24",
    category: "Sports",
    tags: ["Sports", "Hiking"],
    invitationTitle: "Football Kickabout",
    description: "We play a casual football match most evenings at the local pitch, visitors always welcome to join in!",
    avatarColor: "#e0f2fe",
    timeline: "This Week",
  },
  {
    id: 19,
    tag: "Tourist",
    name: "Sofia",
    ageRange: "25–34",
    category: "Language Exchange",
    tags: ["Language Exchange"],
    invitationTitle: "Greek–English Language Swap",
    description: "I'm learning Greek and happy to help with English in return, coffee and conversation, anyone?",
    avatarColor: "#f0fdf4",
    timeline: "This Week",
  },
  {
    id: 20,
    tag: "Local",
    name: "Antonis",
    ageRange: "35–49",
    category: "Language Exchange",
    tags: ["Language Exchange", "Food & Dining"],
    invitationTitle: "Practice Your Greek Over Coffee",
    description: "I'd love to practice my English with a native speaker while teaching you some everyday Greek phrases.",
    avatarColor: "#eff6ff",
    timeline: "Next Week",
  },
  {
    id: 21,
    tag: "Tourist",
    name: "Mia",
    ageRange: "25–34",
    category: "Exploring the City",
    tags: ["Exploring the City", "Food & Dining"],
    invitationTitle: "Hidden Gems of Heraklion",
    description: "I've been here a week and found some amazing spots, want to share them with someone just arriving!",
    avatarColor: "#fef9c3",
    timeline: "This Week",
  },
  {
    id: 22,
    tag: "Local",
    name: "Yannis",
    ageRange: "50+",
    category: "Exploring the City",
    tags: ["Exploring the City", "History"],
    invitationTitle: "My Favourite Neighbourhood",
    description: "Born and raised here, I'd love to show you the corners of the city that guidebooks always miss.",
    avatarColor: "#f5f3ff",
    timeline: "Next Week",
  },
  {
    id: 23,
    tag: "Tourist",
    name: "Tom",
    ageRange: "18–24",
    category: "Custom Category",
    tags: ["Custom Category"],
    invitationTitle: "Sailing Day Trip",
    description: "Joining a sailing trip tomorrow with a few spots left, anyone want to come along for the day?",
    avatarColor: "#e0f7fa",
    timeline: "Tomorrow",
  },
  {
    id: 24,
    tag: "Local",
    name: "Dimitris",
    ageRange: "25–34",
    category: "Custom Category",
    tags: ["Custom Category", "Food & Dining"],
    invitationTitle: "Olive Grove Visit",
    description: "My family owns an olive grove just outside the city, happy to take interested visitors for a tour.",
    avatarColor: "#f0fff4",
    timeline: "Next Week",
  },
];

const REPLY_LIMIT = 3;

interface Props {
  language: string;
  selectedCategories: string[];
  userAgeRange?: string;
  viewedIds: Set<number>;
  repliedIds: Set<number>;
  onView: (inv: Invitation) => void;
  onBack: () => void;
  onExit: () => void;
  onFinish: () => void;
  onLanguageChange?: (lang: string) => void;
}

export function ExploreInvitationsScreen({ language, onLanguageChange, selectedCategories, viewedIds, repliedIds, onView, onBack, onExit, onFinish }: Props) {
  const filtered = MOCK_INVITATIONS.filter((inv) => {
    return inv.tags.some((t) => selectedCategories.includes(t));
  }).slice(0, 6);

  const atLimit = repliedIds.size >= REPLY_LIMIT;

  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col">
      <TopBar onBack={onBack} onExit={onExit} language={language} onLanguageChange={onLanguageChange} />
      <div className="flex-1 px-8 pt-20 pb-8 max-w-2xl mx-auto w-full">
        <h2 className="text-[var(--app-text)] text-center mb-1">Browse Invitations</h2>
        <p className="text-center text-xs text-[var(--app-text-30)] mb-3">
          Showing results for: <span className="text-[#e07b00]">{selectedCategories.join(", ")}</span>
        </p>

        {/* Reply limit banner */}
        {atLimit ? (
          <div className="mb-5 bg-[#e07b00]/15 border-2 border-[#e07b00] rounded-2xl px-5 py-4 text-center">
            <p className="text-[#e07b00] font-semibold text-base mb-1">You've used all {REPLY_LIMIT} responses.</p>
            <p className="text-[var(--app-text-60)] text-sm mb-4">You can still browse invitations. When you're ready, continue below.</p>
            <button
              onClick={onFinish}
              className="w-full bg-[#e07b00] hover:bg-[#c96e00] text-white py-3 rounded-xl font-semibold transition-colors"
            >
              Continue →
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 mb-5 bg-[var(--app-surface-alt)] border border-[var(--app-border)] rounded-xl px-4 py-2.5">
            <span className="text-sm text-[var(--app-text-50)]">You can respond to a maximum of</span>
            <span className="text-sm font-semibold text-[#e07b00]">{REPLY_LIMIT} invitations</span>
            <span className="text-sm text-[var(--app-text-30)]">({repliedIds.size}/{REPLY_LIMIT} used)</span>
          </div>
        )}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[var(--app-text-40)] text-sm">No invitations found for your selected categories yet.</p>
            <p className="text-[var(--app-text-25)] text-xs mt-2">Check back soon, new invitations are added all the time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5">
            {filtered.map((inv) => {
              const viewed = viewedIds.has(inv.id);
              const replied = repliedIds.has(inv.id);

              return (
                <div
                  key={inv.id}
                  className={`rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                    replied
                      ? "border-[#e07b00] bg-[#e07b00]/10"
                      : viewed
                      ? "border-[#e07b00]/60 bg-[#e07b00]/5"
                      : "border-[var(--app-border)] bg-[var(--app-surface-alt)]"
                  }`}
                >
                  {(viewed || replied) && (
                    <div className={`w-full py-1.5 flex items-center justify-center gap-1.5 text-xs font-medium ${
                      replied ? "bg-[#e07b00] text-white" : "bg-[#e07b00]/20 text-[#e07b00]"
                    }`}>
                      {replied ? (
                        <><MessageCircle className="w-3.5 h-3.5" /> Replied</>
                      ) : (
                        <><Eye className="w-3.5 h-3.5" /> Viewed</>
                      )}
                    </div>
                  )}

                  <div
                    className="h-24 flex items-center justify-center relative"
                    style={{ backgroundColor: inv.avatarColor + "33" }}
                  >
                    <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center shadow-sm">
                      <User className="w-7 h-7 text-[var(--app-text-60)]" strokeWidth={1.5} />
                    </div>
                    <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      inv.tag === "Local" ? "bg-[#e07b00] text-white" : "bg-[var(--app-elevated)] text-[var(--app-text-70)]"
                    }`}>
                      {inv.tag === "Local" ? <MapPin className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {inv.tag}
                    </div>
                    <div className="absolute top-2 right-2 bg-black/50 text-[var(--app-text-70)] text-xs px-2 py-0.5 rounded-full">
                      {inv.ageRange}
                    </div>
                  </div>

                  <div className="p-4">
                    {inv.name && (
                      <p className="text-xs text-[#e07b00] mb-1">{inv.name}</p>
                    )}
                    <p className="text-sm text-[var(--app-text)] mb-2 leading-snug">{inv.invitationTitle}</p>
                    <p className="text-xs text-[var(--app-text-40)] mb-3 leading-relaxed line-clamp-2">"{inv.description}"</p>
                    <div className="flex items-center gap-1 mb-3 text-xs text-[var(--app-text-60)]">
                      <Calendar className="w-3 h-3" />
                      <span>{inv.timeline}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {inv.tags.map(t => (
                        <span key={t} className={`text-xs px-2 py-0.5 rounded-full ${
                          selectedCategories.includes(t)
                            ? "bg-[#e07b00] text-white"
                            : "bg-[var(--app-elevated)] text-[var(--app-text-50)]"
                        }`}>{t}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => onView(inv)}
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                        replied
                          ? "bg-[#e07b00] text-white hover:bg-[#c96e00]"
                          : viewed
                          ? "border border-[#e07b00]/60 text-[#e07b00] hover:bg-[#e07b00]/10"
                          : "border border-[var(--app-border)] text-[var(--app-text-60)] hover:border-[#e07b00]/50 hover:text-[var(--app-text)]"
                      }`}
                    >
                      {replied ? "View Again" : viewed ? "View Again" : "View Invitation"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}