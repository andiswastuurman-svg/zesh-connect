import { useMemo, useState } from "react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Code2,
  Copy,
  Download,
  FileText,
  Filter,
  Heart,
  Image as ImageIcon,
  Layers3,
  Lightbulb,
  Mail,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Sparkles,
  Target,
  UserRound,
  Users,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

type Role = "Business" | "Creator" | "Agent";
type View = "Overview" | "Discover creators" | "Campaigns" | "AI Studio" | "Library";

type Creator = {
  name: string;
  handle: string;
  niche: string;
  location: string;
  followers: string;
  engagement: string;
  rate: string;
  platforms: string[];
  initials: string;
  tone: string;
  match: number;
};

const creators: Creator[] = [
  { name: "Mila Jacobs", handle: "@milamakeswaves", niche: "Travel & Lifestyle", location: "Sea Point", followers: "86.4K", engagement: "6.8%", rate: "R8K – R14K", platforms: ["IG", "TT"], initials: "MJ", tone: "coral", match: 96 },
  { name: "Thabo Ndlovu", handle: "@thaboeatscape", niche: "Food & Hospitality", location: "Observatory", followers: "42.1K", engagement: "8.4%", rate: "R5K – R9K", platforms: ["IG", "YT"], initials: "TN", tone: "blue", match: 92 },
  { name: "Zinhle Mbeki", handle: "@zinhlecreates", niche: "Beauty & Culture", location: "Woodstock", followers: "118K", engagement: "5.1%", rate: "R12K – R22K", platforms: ["IG", "TT", "YT"], initials: "ZM", tone: "teal", match: 89 },
  { name: "Ethan Cole", handle: "@ethanonthegrid", niche: "Tech & Business", location: "Gardens", followers: "29.8K", engagement: "7.2%", rate: "R4K – R8K", platforms: ["LI", "IG"], initials: "EC", tone: "navy", match: 84 },
  { name: "Aaliyah Daniels", handle: "@aaliyahafterdark", niche: "Fashion & Beauty", location: "Claremont", followers: "63.7K", engagement: "9.1%", rate: "R7K – R13K", platforms: ["IG", "TT"], initials: "AD", tone: "plum", match: 81 },
  { name: "Luca van Wyk", handle: "@lucaexplores", niche: "Outdoors & Travel", location: "Hout Bay", followers: "51.3K", engagement: "6.2%", rate: "R6K – R11K", platforms: ["IG", "YT"], initials: "LV", tone: "green", match: 78 },
];

const navItems: { label: View; icon: typeof BarChart3 }[] = [
  { label: "Overview", icon: BarChart3 },
  { label: "Discover creators", icon: Users },
  { label: "Campaigns", icon: ClipboardList },
  { label: "AI Studio", icon: WandSparkles },
  { label: "Library", icon: Layers3 },
];

const imageIdeas = [
  { label: "Summer launch", prompt: "Cape Town golden hour rooftop, coral product styling", tone: "image-coral" },
  { label: "Local food story", prompt: "Editorial market table, blue hour, Western Cape produce", tone: "image-blue" },
  { label: "Founder energy", prompt: "Modern studio portrait, translucent teal light planes", tone: "image-teal" },
  { label: "Coastal reset", prompt: "Hout Bay coastline, clean wellness campaign, soft sun", tone: "image-sand" },
];

function Avatar({ initials, tone = "teal", size = "md" }: { initials: string; tone?: string; size?: "sm" | "md" | "lg" }) {
  return <span className={`avatar avatar-${tone} avatar-${size}`}>{initials}</span>;
}

function StatCard({ label, value, detail, accent, icon: Icon }: { label: string; value: string; detail: string; accent: string; icon: typeof BarChart3 }) {
  return <div className="stat-card">
    <div className={`stat-icon ${accent}`}><Icon size={18} /></div>
    <div><p className="eyebrow">{label}</p><strong>{value}</strong><span className="stat-detail">{detail}</span></div>
    <ArrowUpRight size={16} className="stat-arrow" />
  </div>;
}

export default function Home() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<View>("Overview");
  const [role, setRole] = useState<Role>("Business");
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState("");
  const [niche, setNiche] = useState("All niches");
  const [saved, setSaved] = useState<string[]>(["Mila Jacobs"]);
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [aiType, setAiType] = useState("Campaign slogan");
  const [aiBrief, setAiBrief] = useState("A bright, locally rooted launch for a sustainable skincare brand targeting young Cape Town professionals.");
  const [generated, setGenerated] = useState("Your AI-ready marketing output will appear here.");
  const [imageSearch, setImageSearch] = useState("");
  const [toast, setToast] = useState("");
  const marketingMutation = trpc.ai.generateMarketing.useMutation();

  const filteredCreators = useMemo(() => creators.filter((creator) => {
    const searchable = `${creator.name} ${creator.handle} ${creator.niche} ${creator.location}`.toLowerCase();
    return searchable.includes(search.toLowerCase()) && (niche === "All niches" || creator.niche === niche);
  }), [search, niche]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const generate = () => {
    marketingMutation.mutate({ format: aiType, brief: aiBrief }, {
      onSuccess: (result) => { setGenerated(result.content); notify("AI Studio draft generated"); },
      onError: () => notify("AI Studio could not reach the model — try again"),
    });
  };

  const pageTitle = activeView === "Overview" ? "Good morning" : activeView;
  const pageSubtitle = activeView === "Overview" ? "Here’s what’s moving across your creator network." : activeView === "Discover creators" ? "Find the people who make your next story worth sharing." : activeView === "Campaigns" ? "Keep every brief, collaborator, and deliverable moving." : activeView === "AI Studio" ? "Turn a sharp brief into campaign-ready thinking." : "Keep your best thinking close and reusable.";

  return <div className="app-shell">
    <aside className={`app-sidebar ${mobileNav ? "open" : ""}`}>
      <div className="brand-lockup"><div className="brand-mark"><span /><span /><span /></div><span>Zesh <b>Connect</b></span></div>
      <div className="workspace-switcher"><div className="workspace-avatar">SC</div><div><small>Workspace</small><strong>Studio Collective</strong></div><ChevronDown size={15} /></div>
      <div className="sidebar-label">Workspace</div>
      <nav className="primary-nav">{navItems.map(({ label, icon: Icon }) => <button key={label} className={activeView === label ? "active" : ""} onClick={() => { setActiveView(label); setMobileNav(false); }}><Icon size={17} /><span>{label}</span>{label === "AI Studio" && <span className="new-pill">New</span>}</button>)}</nav>
      <div className="sidebar-label sidebar-label-spaced">Manage</div>
      <nav className="primary-nav secondary-nav"><button onClick={() => notify("Inbox is ready for your next collaboration") }><Mail size={17} /><span>Inbox</span><span className="nav-count">4</span></button><button onClick={() => notify("Settings are coming next") }><BriefcaseBusiness size={17} /><span>Account settings</span></button></nav>
      <div className="sidebar-bottom"><div className="help-card"><CircleHelp size={17} /><div><strong>Need a hand?</strong><small>Visit the resource hub</small></div><ArrowUpRight size={14} /></div><div className="profile-row"><Avatar initials={user?.name?.slice(0, 2).toUpperCase() || "SC"} tone="coral" size="sm" /><div><strong>{user?.name || "Studio Collective"}</strong><small>{user?.email || "Business workspace"}</small></div><MoreHorizontal size={16} /></div></div>
    </aside>

    <main className="main-canvas">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)}><Menu size={20} /></button><div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>{activeView}</strong></div><div className="top-actions"><button className="icon-button" onClick={() => notify("You’re all caught up") }><Bell size={18} /><i /></button><button className="help-button" onClick={() => notify("Resource hub opened") }><CircleHelp size={17} /> Help</button><div className="role-toggle"><span>Viewing as</span><select value={role} onChange={(e) => setRole(e.target.value as Role)}><option>Business</option><option>Creator</option><option>Agent</option></select></div><button className="user-menu"><Avatar initials={user?.name?.slice(0, 2).toUpperCase() || "SC"} tone="coral" size="sm" /><ChevronDown size={14} /></button></div></header>

      <div className="content-wrap">
        <div className="page-heading"><div><p className="kicker">{role} workspace</p><h1>{pageTitle}{activeView === "Overview" && <span className="heading-dot">.</span>}</h1><p className="page-subtitle">{pageSubtitle}</p></div><div className="heading-actions"><button className="button button-ghost" onClick={() => notify("Your workspace report is being prepared") }><Download size={16} /> Export report</button><button className="button button-primary" onClick={() => setCampaignOpen(true)}><Plus size={17} /> New campaign</button></div></div>

        {activeView === "Overview" && <>
          <section className="hero-banner"><div className="hero-copy"><span className="mini-label"><Sparkles size={14} /> Zesh intelligence</span><h2>Your next great collaboration is closer than you think.</h2><p>We found 18 creators aligned with your Q3 launch goals, audience and budget.</p><button className="button button-dark" onClick={() => setActiveView("Discover creators")}>Review recommendations <ArrowUpRight size={16} /></button></div><div className="hero-art"><div className="plane plane-one" /><div className="plane plane-two" /><div className="plane plane-three" /><div className="hero-orb"><Target size={28} /><span>96%</span><small>best fit</small></div><div className="art-caption"><span className="live-dot" /> Matching live <strong>18</strong></div></div></section>
          <div className="stats-grid"><StatCard label="Active campaigns" value="06" detail="+2 this month" accent="stat-teal" icon={ClipboardList} /><StatCard label="Creator pipeline" value="42" detail="8 new this week" accent="stat-blue" icon={Users} /><StatCard label="Projected reach" value="1.2M" detail="+18.6% vs last month" accent="stat-coral" icon={Zap} /><StatCard label="Avg. engagement" value="7.4%" detail="Above category avg." accent="stat-lilac" icon={BarChart3} /></div>
          <div className="section-grid"><section className="panel activity-panel"><div className="panel-heading"><div><p className="eyebrow">Momentum</p><h3>Campaign activity</h3></div><button className="text-button" onClick={() => setActiveView("Campaigns")}>View all <ArrowUpRight size={14} /></button></div><div className="chart-area"><div className="chart-metrics"><strong>482K</strong><span>total impressions <b>↗ 12.8%</b></span></div><div className="chart"><div className="chart-y"><span>500K</span><span>350K</span><span>200K</span><span>50K</span></div><div className="chart-lines"><i /><i /><i /><i /><svg viewBox="0 0 520 160" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#26c9b2" stopOpacity=".25" /><stop offset="1" stopColor="#26c9b2" stopOpacity="0" /></linearGradient></defs><path d="M0,130 C35,116 42,124 67,107 S111,112 140,88 S188,92 214,96 S250,60 284,70 S324,45 350,60 S391,34 410,44 S465,18 520,24 V160 H0 Z" fill="url(#fill)" /><path d="M0,130 C35,116 42,124 67,107 S111,112 140,88 S188,92 214,96 S250,60 284,70 S324,45 350,60 S391,34 410,44 S465,18 520,24" fill="none" stroke="#13ad9b" strokeWidth="3" /></svg></div></div><div className="chart-x"><span>May 01</span><span>May 15</span><span>Jun 01</span><span>Jun 15</span><span>Jul 01</span><span>Jul 15</span></div></div></section><section className="panel pipeline-panel"><div className="panel-heading"><div><p className="eyebrow">Creator pipeline</p><h3>Needs your attention</h3></div><button className="circle-plus" onClick={() => setActiveView("Discover creators")}><Plus size={17} /></button></div><div className="pipeline-list"><div className="pipeline-item"><div className="status-number teal-number">01</div><div><strong>Awaiting reply</strong><span>4 creators to follow up with</span></div><ArrowUpRight size={15} /></div><div className="pipeline-item"><div className="status-number blue-number">02</div><div><strong>Ready to brief</strong><span>3 creators accepted your invite</span></div><ArrowUpRight size={15} /></div><div className="pipeline-item"><div className="status-number coral-number">03</div><div><strong>Review deliverables</strong><span>2 drafts need approval</span></div><ArrowUpRight size={15} /></div></div><div className="pipeline-footer"><div className="stacked-avatars"><Avatar initials="MJ" tone="coral" size="sm" /><Avatar initials="TN" tone="blue" size="sm" /><Avatar initials="ZM" tone="teal" size="sm" /><span>+7</span></div><small>12 collaborators in motion</small></div></section></div>
          <div className="section-grid lower-grid"><section className="panel campaign-panel"><div className="panel-heading"><div><p className="eyebrow">Live work</p><h3>Recent campaigns</h3></div><button className="text-button" onClick={() => setActiveView("Campaigns")}>Manage campaigns <ArrowUpRight size={14} /></button></div><div className="campaign-table"><div className="table-head"><span>Campaign</span><span>Creators</span><span>Progress</span><span>Status</span></div>{[{ title: "Winter in the City", type: "Brand awareness · 12 assets", creators: "08", progress: 78, status: "On track", color: "green" }, { title: "Sea & Soil launch", type: "Product launch · 24 assets", creators: "12", progress: 46, status: "In review", color: "orange" }, { title: "The Local Edit", type: "Always-on · 08 assets", creators: "05", progress: 91, status: "On track", color: "green" }].map((campaign) => <div className="table-row" key={campaign.title}><div><strong>{campaign.title}</strong><span>{campaign.type}</span></div><span>{campaign.creators}</span><div className="progress-wrap"><div className="progress-bar"><i style={{ width: `${campaign.progress}%` }} /></div><small>{campaign.progress}%</small></div><span className={`status-pill ${campaign.color}`}>{campaign.status}</span></div>)}</div></section><section className="panel insight-panel"><div className="panel-heading"><div><p className="eyebrow">Quick insight</p><h3>Small shift, big lift</h3></div><Lightbulb size={19} className="insight-icon" /></div><p>Creators with audiences between <strong>20–60K</strong> are driving <strong>2.4× more saves</strong> on your lifestyle content than your current average.</p><button className="button button-outline" onClick={() => setActiveView("Discover creators")}>Explore this segment <ArrowUpRight size={15} /></button></section></div>
        </>}

        {activeView === "Discover creators" && <CreatorDirectory filteredCreators={filteredCreators} search={search} setSearch={setSearch} niche={niche} setNiche={setNiche} saved={saved} setSaved={setSaved} notify={notify} />}
        {activeView === "Campaigns" && <Campaigns onNew={() => setCampaignOpen(true)} notify={notify} />}
        {activeView === "AI Studio" && <AIStudio aiType={aiType} setAiType={setAiType} aiBrief={aiBrief} setAiBrief={setAiBrief} generated={generated} generate={generate} generating={marketingMutation.isPending} notify={notify} />}
        {activeView === "Library" && <Library imageSearch={imageSearch} setImageSearch={setImageSearch} notify={notify} />}
      </div>
    </main>

    {campaignOpen && <CampaignModal close={() => setCampaignOpen(false)} notify={notify} />}
    {toast && <div className="toast"><Check size={16} /> {toast}</div>}
  </div>;
}

function CreatorDirectory({ filteredCreators, search, setSearch, niche, setNiche, saved, setSaved, notify }: { filteredCreators: Creator[]; search: string; setSearch: (x: string) => void; niche: string; setNiche: (x: string) => void; saved: string[]; setSaved: (x: string[]) => void; notify: (x: string) => void }) {
  return <div className="directory-view"><div className="directory-toolbar"><div className="search-field"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search creators, niches or locations" /></div><select value={niche} onChange={(e) => setNiche(e.target.value)}><option>All niches</option><option>Travel & Lifestyle</option><option>Food & Hospitality</option><option>Beauty & Culture</option><option>Tech & Business</option><option>Fashion & Beauty</option><option>Outdoors & Travel</option></select><button className="filter-button"><Filter size={16} /> More filters</button></div><div className="directory-meta"><div><strong>{filteredCreators.length * 74 + 312}</strong> creators in Cape Town <span className="live-dot" /> Updated today</div><button className="ai-recommendation" onClick={() => notify("AI recommendations refreshed") }><Sparkles size={15} /> AI recommendations <ArrowUpRight size={14} /></button></div><div className="creator-grid">{filteredCreators.map((creator) => <CreatorCard key={creator.name} creator={creator} isSaved={saved.includes(creator.name)} onSave={() => setSaved(saved.includes(creator.name) ? saved.filter((name) => name !== creator.name) : [...saved, creator.name])} notify={notify} />)}</div>{filteredCreators.length === 0 && <div className="empty-state"><Search size={24} /><h3>No creators found</h3><p>Try a broader search or reset your niche filter.</p></div>}</div>;
}

function CreatorCard({ creator, isSaved, onSave, notify }: { creator: Creator; isSaved: boolean; onSave: () => void; notify: (x: string) => void }) {
  return <article className="creator-card"><div className={`creator-cover cover-${creator.tone}`}><div className="cover-grid" /><button className={`save-button ${isSaved ? "saved" : ""}`} onClick={onSave}><Heart size={16} fill={isSaved ? "currentColor" : "none"} /></button><div className="creator-avatar-wrap"><Avatar initials={creator.initials} tone={creator.tone} size="lg" /><span className="verified"><Check size={11} /></span></div></div><div className="creator-card-body"><div className="creator-name-row"><div><h3>{creator.name}</h3><span>{creator.handle}</span></div><span className="match-score"><Sparkles size={12} /> {creator.match}%</span></div><p className="creator-niche">{creator.niche}</p><div className="creator-tags">{creator.platforms.map((platform) => <span key={platform}>{platform}</span>)}<span>{creator.location}</span></div><div className="creator-metrics"><div><strong>{creator.followers}</strong><span>Audience</span></div><div><strong>{creator.engagement}</strong><span>Engagement</span></div><div><strong>{creator.rate}</strong><span>Typical rate</span></div></div><button className="button button-outline full-button" onClick={() => notify(`Opening ${creator.name}'s profile`) }>View profile <ArrowUpRight size={14} /></button></div></article>;
}

function Campaigns({ onNew, notify }: { onNew: () => void; notify: (x: string) => void }) {
  const [tab, setTab] = useState("All campaigns");
  const campaigns = [{ title: "Winter in the City", brand: "Studio Collective · Brand awareness", status: "On track", progress: 78, creators: "8 creators", due: "Due 18 Jul", tone: "coral" }, { title: "Sea & Soil launch", brand: "Studio Collective · Product launch", status: "In review", progress: 46, creators: "12 creators", due: "Due 26 Jul", tone: "blue" }, { title: "The Local Edit", brand: "Studio Collective · Always-on", status: "On track", progress: 91, creators: "5 creators", due: "Due 02 Aug", tone: "teal" }, { title: "Found / Made", brand: "Studio Collective · Creator series", status: "Draft", progress: 12, creators: "3 creators", due: "Not scheduled", tone: "plum" }];
  return <div className="campaigns-view"><div className="view-tabs">{["All campaigns", "Active", "Drafts", "Completed"].map((item) => <button className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)}>{item}</button>)}<button className="button button-primary tab-cta" onClick={onNew}><Plus size={15} /> New campaign</button></div><div className="campaign-list">{campaigns.filter((c) => tab === "All campaigns" || (tab === "Active" && c.status !== "Draft") || (tab === "Drafts" && c.status === "Draft") || (tab === "Completed" && c.status === "Completed")).map((campaign) => <div className="campaign-card" key={campaign.title}><div className={`campaign-thumb thumb-${campaign.tone}`}><div className="thumb-shape one" /><div className="thumb-shape two" /><span>{campaign.title.split(" ").map((word) => word[0]).join("")}</span></div><div className="campaign-info"><div className="campaign-info-top"><div><h3>{campaign.title}</h3><p>{campaign.brand}</p></div><button className="dots-button"><MoreHorizontal size={18} /></button></div><div className="campaign-card-meta"><span>{campaign.creators}</span><span>{campaign.due}</span><span className={`status-pill ${campaign.status === "Draft" ? "gray" : campaign.status === "In review" ? "orange" : "green"}`}>{campaign.status}</span></div><div className="campaign-progress-row"><div className="progress-bar"><i style={{ width: `${campaign.progress}%` }} /></div><strong>{campaign.progress}% complete</strong></div></div><button className="open-campaign" onClick={() => notify(`${campaign.title} workspace opened`) }><ArrowUpRight size={18} /></button></div>)}</div></div>;
}

function AIStudio({ aiType, setAiType, aiBrief, setAiBrief, generated, generate, generating, notify }: { aiType: string; setAiType: (x: string) => void; aiBrief: string; setAiBrief: (x: string) => void; generated: string; generate: () => void; generating: boolean; notify: (x: string) => void }) {
  const tools = ["Campaign slogan", "Social caption", "Ad concept", "Video concept", "Hashtag set", "Influencer brief", "CTA options"];
  return <div className="ai-studio"><div className="ai-intro"><div><span className="mini-label"><Sparkles size={14} /> Built for the brief</span><h2>From blank page to <em>brand spark.</em></h2><p>Tell Zesh what you’re building. We’ll help you find the words, hooks and angles that make creators want to say yes.</p></div><div className="ai-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><Sparkles size={25} /></div></div><div className="ai-layout"><div className="ai-form panel"><p className="eyebrow">01 · Choose a format</p><div className="tool-grid">{tools.map((tool) => <button key={tool} className={aiType === tool ? "selected" : ""} onClick={() => setAiType(tool)}><span>{tool === "Campaign slogan" ? "✦" : tool === "Social caption" ? "◌" : tool === "Ad concept" ? "▱" : tool === "Video concept" ? "▶" : tool === "Hashtag set" ? "#" : tool === "Influencer brief" ? "☷" : "→"}</span>{tool}</button>)}</div><label className="eyebrow">02 · Give us the brief</label><textarea value={aiBrief} onChange={(e) => setAiBrief(e.target.value)} /><div className="form-foot"><span>{aiBrief.length} / 500</span><button className="button button-primary" onClick={generate} disabled={generating}><WandSparkles size={16} /> {generating ? "Thinking…" : "Generate draft"}</button></div></div><div className="ai-output panel"><div className="output-header"><div><p className="eyebrow">03 · Your draft</p><h3>{aiType}</h3></div><span className="ai-status"><span className="live-dot" /> AI ready</span></div><div className={`output-content ${generated.startsWith("Your AI") ? "empty-output" : ""}`}><Sparkles size={21} />{generated}</div><div className="output-actions"><button onClick={() => { navigator.clipboard?.writeText(generated); notify("Draft copied to clipboard"); }}><Copy size={15} /> Copy</button><button onClick={() => notify("Draft saved to Library") }><Heart size={15} /> Save to library</button></div></div></div><div className="response-strip"><div className="response-icon"><Mail size={19} /></div><div><strong>Need to reach out?</strong><span>Generate a polished collaboration message for any creator.</span></div><button className="button button-outline" onClick={() => notify("Response generator opened") }>Open response generator <ArrowUpRight size={15} /></button></div></div>;
}

function Library({ imageSearch, setImageSearch, notify }: { imageSearch: string; setImageSearch: (x: string) => void; notify: (x: string) => void }) {
  const [tab, setTab] = useState("Image inspiration");
  const tabs = ["Image inspiration", "Copy & content", "Prompt library", "Code snippets"];
  const shownIdeas = imageIdeas.filter((idea) => `${idea.label} ${idea.prompt}`.toLowerCase().includes(imageSearch.toLowerCase()));
  return <div className="library-view"><div className="library-tabs">{tabs.map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}<button className="button button-primary library-add" onClick={() => notify("New library item created") }><Plus size={15} /> Add asset</button></div>{tab === "Image inspiration" ? <><div className="image-search-hero"><div><span className="mini-label"><ImageIcon size={14} /> AI image inspiration</span><h2>Find the feeling before you find the frame.</h2><p>Search by prompt, visual direction or campaign mood. Save references to your next brief.</p></div><div className="image-search-field"><Search size={18} /><input value={imageSearch} onChange={(e) => setImageSearch(e.target.value)} placeholder="Try ‘coral rooftop launch’" /><button onClick={() => notify("Image inspiration refreshed")}>Search</button></div></div><div className="image-grid">{shownIdeas.map((idea) => <div className={`inspiration-card ${idea.tone}`} key={idea.label}><div className="inspiration-visual"><div className="visual-plane vp-one" /><div className="visual-plane vp-two" /><div className="visual-circle" /><button onClick={() => notify(`${idea.label} saved to library`) }><Heart size={15} /></button><span className="ai-badge"><Sparkles size={12} /> AI generated</span></div><div className="inspiration-copy"><strong>{idea.label}</strong><span>{idea.prompt}</span></div></div>)}</div></> : <div className="asset-library-grid">{[ { icon: FileText, title: "Sea & Soil creator brief", type: "Influencer brief · Saved 2 days ago" }, { icon: Copy, title: "Local launch captions", type: "Copy collection · Saved 4 days ago" }, { icon: Code2, title: "Campaign UTM builder", type: "Code snippet · Saved 1 week ago" }, { icon: Lightbulb, title: "Founder-led content hooks", type: "Prompt set · Saved 1 week ago" }].map(({ icon: Icon, title, type }) => <div className="asset-row" key={title}><div className="asset-icon"><Icon size={18} /></div><div><strong>{title}</strong><span>{type}</span></div><button onClick={() => notify(`${title} opened`) }><ArrowUpRight size={16} /></button></div>)}</div>}</div>;
}

function CampaignModal({ close, notify }: { close: () => void; notify: (x: string) => void }) {
  const [step, setStep] = useState(1);
  return <div className="modal-backdrop"><div className="modal-card"><div className="modal-header"><div><p className="eyebrow">New campaign · Step {step} of 2</p><h2>{step === 1 ? "Start with the brief" : "Set your collaboration goals"}</h2></div><button onClick={close}><X size={19} /></button></div>{step === 1 ? <div className="modal-body"><label>Campaign name<input placeholder="e.g. Summer skin, made local" /></label><label>What are you launching?<textarea placeholder="Describe your product, story, or moment in a few lines." /></label><div className="two-inputs"><label>Start date<input type="text" placeholder="20 Jul 2026" /></label><label>End date<input type="text" placeholder="20 Aug 2026" /></label></div></div> : <div className="modal-body"><label>Primary objective<select><option>Build brand awareness</option><option>Drive product sales</option><option>Grow community</option><option>Generate UGC</option></select></label><label>Ideal creator profile<input placeholder="e.g. Lifestyle creators, 20–60K, high saves" /></label><div className="goal-note"><Sparkles size={17} /><span><strong>Tip from Zesh AI</strong> Specific campaign goals help us surface better-fit creators and clearer match scores.</span></div></div>}<div className="modal-footer"><button className="button button-ghost" onClick={step === 1 ? close : () => setStep(1)}>{step === 1 ? "Cancel" : "Back"}</button><button className="button button-primary" onClick={() => step === 1 ? setStep(2) : (close(), notify("Campaign created — let’s find your creators"))}>{step === 1 ? "Continue" : "Create campaign"} <ArrowUpRight size={15} /></button></div></div></div>;
}
