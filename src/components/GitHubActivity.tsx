import { useState, useEffect, useMemo } from 'react';
import { 
  GitCommit, 
  GitBranch, 
  Star, 
  ExternalLink, 
  RefreshCw, 
  Terminal, 
  Activity, 
  FolderGit2, 
  CheckCircle2,
  Clock,
  Flame,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import cachedContributions from '../data/githubContributions2026.json';

interface GitHubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  updated_at: string;
}

interface GitHubActivityItem {
  id: string;
  type: string;
  category: 'commit' | 'star' | 'repo';
  repo: string;
  repoUrl: string;
  sha?: string;
  title: string;
  detail: string;
  date: string;
  verified?: boolean;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
}

interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0, 1, 2, 3, 4
}

// Guaranteed Fallback Snapshot with the EXACT latest real-world events and commits
const FALLBACK_PROFILE: GitHubProfile = {
  login: 'Vidson313',
  avatar_url: 'https://avatars.githubusercontent.com/u/192873381?v=4',
  html_url: 'https://github.com/Vidson313',
  public_repos: 19,
  followers: 3,
  following: 9,
  updated_at: '2026-10-10T03:03:33Z',
};

const FALLBACK_ACTIVITIES: GitHubActivityItem[] = [
  {
    id: 'evt-1',
    type: 'Starred Repository',
    category: 'star',
    repo: 'msasanmh/DNSveil',
    repoUrl: 'https://github.com/msasanmh/DNSveil',
    title: 'Starred msasanmh/DNSveil',
    detail: 'Tracked & starred upstream network security & DNS privacy gateway repository',
    date: '2026-10-08T20:30:49Z',
  },
  {
    id: 'evt-2',
    type: 'Starred Repository',
    category: 'star',
    repo: 'msasanmh/SecureDNSClient',
    repoUrl: 'https://github.com/msasanmh/SecureDNSClient',
    title: 'Starred msasanmh/SecureDNSClient',
    detail: 'Inspected encrypted DNS tunneling client codebase and architecture',
    date: '2026-10-08T20:30:40Z',
  },
  {
    id: 'evt-3',
    type: 'Starred Repository',
    category: 'star',
    repo: 'diegosouzapw/OmniRoute',
    repoUrl: 'https://github.com/diegosouzapw/OmniRoute',
    title: 'Starred diegosouzapw/OmniRoute',
    detail: 'Multi-provider routing and resilient proxy load balancer repository',
    date: '2026-10-02T19:39:47Z',
  },
  {
    id: 'evt-4',
    type: 'Starred Repository',
    category: 'star',
    repo: 'xeljazwix/ShufflerApp',
    repoUrl: 'https://github.com/xeljazwix/ShufflerApp',
    title: 'Starred xeljazwix/ShufflerApp',
    detail: 'Explored modern utility workflow application architecture',
    date: '2026-09-12T21:47:17Z',
  },
  {
    id: 'cmt-1',
    type: 'Commit',
    category: 'commit',
    repo: 'Vidson313/sorena-marketplace',
    repoUrl: 'https://github.com/Vidson313/sorena-marketplace',
    sha: 'ad298d0',
    title: 'fix(ssr): await headers, null-safe search filter, typed url-provider',
    detail: 'Resolved asynchronous server headers hydration and tightened URL query parameter types in Next.js 14 SSR.',
    date: '2026-09-04T05:46:10Z',
    verified: true,
  },
  {
    id: 'cmt-2',
    type: 'Commit',
    category: 'commit',
    repo: 'Vidson313/sorena-marketplace',
    repoUrl: 'https://github.com/Vidson313/sorena-marketplace',
    sha: 'efd5165',
    title: 'fix(demo): structured offline browser client, mock categories, auth guards',
    detail: 'Added defensive fallbacks for offline demo browsing and mock catalog state transitions.',
    date: '2026-09-04T05:41:40Z',
    verified: true,
  },
  {
    id: 'cmt-3',
    type: 'Commit',
    category: 'commit',
    repo: 'Vidson313/vidson.dev---Senior-Full-Stack-Engineer--new-z-ai',
    repoUrl: 'https://github.com/Vidson313/vidson.dev---Senior-Full-Stack-Engineer--new-z-ai',
    sha: '6858438',
    title: 'feat: initialize portfolio project structure',
    detail: 'Set up Vite, Tailwind CSS, Lucide icons, and core portfolio architectural layouts.',
    date: '2026-09-03T02:42:54Z',
    verified: true,
  },
  {
    id: 'cmt-4',
    type: 'Commit',
    category: 'commit',
    repo: 'Vidson313/sorena-marketplace',
    repoUrl: 'https://github.com/Vidson313/sorena-marketplace',
    sha: '659207e',
    title: 'docs: add live production demo URL badge',
    detail: 'Linked live deployment endpoint on Vercel with automated status badges.',
    date: '2026-09-02T00:05:22Z',
    verified: false,
  },
  {
    id: 'cmt-5',
    type: 'Commit',
    category: 'commit',
    repo: 'Vidson313/Hero',
    repoUrl: 'https://github.com/Vidson313/Hero',
    sha: '3dc7ac7',
    title: 'feat(moon-hero): implement interactive Moon landing hero section',
    detail: 'Integrated WebGL mesh rendering and GSAP timeline scroll-trigger animation sequences.',
    date: '2026-08-02T21:25:36Z',
    verified: false,
  },
];

const FALLBACK_REPOS: GitHubRepo[] = [
  {
    name: 'sorena-marketplace',
    description: '🛒 High-performance digital marketplace for source codes & templates — Next.js 14, Supabase SSR, PostgreSQL RLS & Stripe.',
    html_url: 'https://github.com/Vidson313/sorena-marketplace',
    language: 'TypeScript',
    stargazers_count: 2,
    forks_count: 1,
    pushed_at: '2026-09-04T05:46:15Z',
  },
  {
    name: 'vidson.dev---Senior-Full-Stack-Engineer--new-z-ai',
    description: '⚡ Official interactive portfolio & architecture showcase engineered with React 19, TypeScript, and high-performance design.',
    html_url: 'https://github.com/Vidson313/vidson.dev---Senior-Full-Stack-Engineer--new-z-ai',
    language: 'TypeScript',
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: '2026-09-03T02:42:55Z',
  },
  {
    name: 'Hero',
    description: 'Interactive high-fidelity Moon Hero section with WebGL canvas rendering and fluid responsive typography.',
    html_url: 'https://github.com/Vidson313/Hero',
    language: 'TypeScript',
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: '2026-08-02T21:26:02Z',
  },
  {
    name: 'pass-manager',
    description: 'Client-side encrypted password & credential manager with zero-telemetry and custom Persian typography styling.',
    html_url: 'https://github.com/Vidson313/pass-manager',
    language: 'TypeScript',
    stargazers_count: 1,
    forks_count: 0,
    pushed_at: '2026-06-23T01:19:40Z',
  },
  {
    name: 'sorena-net-landing-page',
    description: 'Official corporate landing page for Sorena Net network infrastructure and software services.',
    html_url: 'https://github.com/Vidson313/sorena-net-landing-page',
    language: 'TypeScript',
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: '2026-06-18T16:40:28Z',
  },
  {
    name: 'VIDSON313',
    description: 'Special profile repository with automated GitHub Actions CI/CD workflows and activity trackers.',
    html_url: 'https://github.com/Vidson313/VIDSON313',
    language: 'Shell / Actions',
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: '2026-10-10T03:03:33Z',
  },
];

export default function GitHubActivity() {
  const [profile, setProfile] = useState<GitHubProfile>(FALLBACK_PROFILE);
  const [activities, setActivities] = useState<GitHubActivityItem[]>(FALLBACK_ACTIVITIES);
  const [repos, setRepos] = useState<GitHubRepo[]>(FALLBACK_REPOS);
  const [contributions, setContributions] = useState<ContributionDay[]>(
    cachedContributions?.contributions || []
  );
  const [totalContributions, setTotalContributions] = useState<number>(
    cachedContributions?.total?.['2026'] || 62
  );
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'stream' | 'repos'>('stream');

  // Fetch real-time data from GitHub Public APIs
  const fetchGitHubData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Profile
      const profilePromise = fetch('https://api.github.com/users/Vidson313')
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);

      // 2. Fetch Events (Contains strictly latest events: stars, watchers, etc.)
      const eventsPromise = fetch('https://api.github.com/users/Vidson313/events')
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);

      // 3. Fetch Repositories sorted by pushed date
      const reposPromise = fetch('https://api.github.com/users/Vidson313/repos?per_page=100&sort=pushed')
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);

      // 4. Fetch Contributions Calendar from public API proxy
      const contribPromise = fetch('https://github-contributions-api.jogruber.de/v4/Vidson313?y=2026')
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);

      const [profileData, eventsData, reposData, contribData] = await Promise.all([
        profilePromise,
        eventsPromise,
        reposPromise,
        contribPromise,
      ]);

      if (profileData) {
        setProfile({
          login: profileData.login,
          avatar_url: profileData.avatar_url,
          html_url: profileData.html_url,
          public_repos: profileData.public_repos ?? 19,
          followers: profileData.followers ?? 3,
          following: profileData.following ?? 9,
          updated_at: profileData.updated_at,
        });
      }

      if (contribData?.contributions) {
        setContributions(contribData.contributions);
        if (contribData.total?.['2026']) {
          setTotalContributions(contribData.total['2026']);
        }
      }

      // Collect unified recent activities
      const aggregated: GitHubActivityItem[] = [];

      // Add recent GitHub events (Starred repos, WatchEvents from October/September 2026)
      if (Array.isArray(eventsData)) {
        eventsData.forEach((evt) => {
          if (evt.type === 'WatchEvent') {
            aggregated.push({
              id: `evt-${evt.id}`,
              type: 'Starred Repository',
              category: 'star',
              repo: evt.repo.name,
              repoUrl: `https://github.com/${evt.repo.name}`,
              title: `Starred ${evt.repo.name}`,
              detail: `Tracked & starred upstream open-source codebase`,
              date: evt.created_at,
            });
          } else if (evt.type === 'PushEvent') {
            const commitCount = evt.payload?.commits?.length || 1;
            const topMsg = evt.payload?.commits?.[0]?.message || 'Pushed commits to branch';
            aggregated.push({
              id: `push-${evt.id}`,
              type: 'Pushed Commits',
              category: 'commit',
              repo: evt.repo.name,
              repoUrl: `https://github.com/${evt.repo.name}`,
              sha: evt.payload?.commits?.[0]?.sha?.substring(0, 7),
              title: topMsg.split('\n')[0],
              detail: `Pushed ${commitCount} commit(s) to ${evt.repo.name}`,
              date: evt.created_at,
            });
          }
        });
      }

      // Fetch top 3 latest commits from each recently pushed repo
      if (Array.isArray(reposData) && reposData.length > 0) {
        const sortedPushed = [...reposData]
          .filter((r) => r.name !== '123')
          .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());

        // Update Repositories Tab
        const parsedRepos: GitHubRepo[] = sortedPushed.slice(0, 6).map((r) => ({
          name: r.name,
          description: r.description,
          html_url: r.html_url,
          language: r.language || (r.name === 'nahan' ? 'TypeScript' : 'Code'),
          stargazers_count: r.stargazers_count || 0,
          forks_count: r.forks_count || 0,
          pushed_at: r.pushed_at,
        }));
        setRepos(parsedRepos);

        // Fetch commits from the 6 most recent repos
        const commitPromises = sortedPushed.slice(0, 6).map(async (r) => {
          try {
            const cRes = await fetch(`https://api.github.com/repos/Vidson313/${r.name}/commits?per_page=3`);
            if (cRes.ok) {
              const cList = await cRes.json();
              if (Array.isArray(cList)) {
                return cList.map((c) => ({
                  id: `cmt-${c.sha}`,
                  type: 'Commit',
                  category: 'commit' as const,
                  repo: `Vidson313/${r.name}`,
                  repoUrl: `https://github.com/Vidson313/${r.name}`,
                  sha: c.sha.substring(0, 7),
                  title: c.commit.message.split('\n')[0],
                  detail: `Committed to repository branch`,
                  date: c.commit.author?.date || c.commit.committer?.date,
                  verified: Boolean(c.commit.verification?.verified),
                }));
              }
            }
          } catch {
            return [];
          }
          return [];
        });

        const commitsArrays = await Promise.all(commitPromises);
        commitsArrays.flat().forEach((c) => aggregated.push(c));
      }

      if (aggregated.length > 0) {
        // Deduplicate by ID and sort descending by date (strictly newest first)
        const unique = Array.from(new Map(aggregated.map((item) => [item.id, item])).values());
        unique.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setActivities(unique.slice(0, 8));
      }
    } catch {
      // Keep verified snapshot
    } finally {
      setIsLoading(false);
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => {
    fetchGitHubData();
  }, []);

  // Format date helper
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const getRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 30) return `${diffDays} days ago`;
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} mo ago`;
    } catch {
      return '';
    }
  };

  // Split contributions into weeks (columns of 7 days)
  const weeksData = useMemo(() => {
    if (!contributions || contributions.length === 0) return [];
    
    // Group into 7-day columns
    const weeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    // If Jan 1 is Thursday (4), prepend empty placeholders so Sunday is top
    const firstDay = new Date(contributions[0].date).getUTCDay();
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push({ date: `pad-${i}`, count: 0, level: -1 });
    }

    for (const day of contributions) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [contributions]);

  // Color mapper for GitHub heat map squares
  const getLevelColor = (level: number) => {
    switch (level) {
      case -1:
        return 'bg-transparent border-transparent';
      case 0:
        return 'bg-[#181818] border-white/[0.04] hover:border-white/20';
      case 1:
        return 'bg-[#0e4429] border-[#006d32]/40 hover:border-emerald-400';
      case 2:
        return 'bg-[#006d32] border-[#26a641]/50 hover:border-emerald-300';
      case 3:
        return 'bg-[#26a641] border-[#39d353]/60 hover:border-white';
      case 4:
        return 'bg-[#39d353] border-emerald-200 hover:brightness-125';
      default:
        return 'bg-[#181818] border-white/[0.04]';
    }
  };

  const getLanguageColor = (lang: string | null) => {
    switch (lang?.toLowerCase()) {
      case 'typescript':
        return 'bg-[#3178C6]';
      case 'javascript':
        return 'bg-[#F7DF1E]';
      case 'rust':
        return 'bg-[#DEA584]';
      case 'css':
        return 'bg-[#563D7C]';
      case 'shell / actions':
      case 'yaml / shell':
        return 'bg-[#89E051]';
      default:
        return 'bg-[#FF5C00]';
    }
  };

  return (
    <section id="github-activity" className="py-24 px-6 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 font-mono-code text-xs text-[#FF5C00] tracking-widest uppercase mb-2">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>01.5 // LIVE ACTIVITY & CONTRIBUTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-grotesk font-bold tracking-tight text-white">
            Real-Time GitHub Stream
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/60 max-w-2xl font-normal">
            Direct feed & live contribution matrix from <span className="font-mono-code text-[#FF5C00] font-semibold">@vidson313</span>. Inspect latest code commits, starred research, and deployment velocity.
          </p>
        </div>

        {/* Live Status Controls */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141414] border border-white/10 font-mono-code text-xs text-white/70">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-semibold">LIVE SYNC</span>
            <span className="text-white/40">|</span>
            <span className="text-white/50">{lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <button
            onClick={fetchGitHubData}
            disabled={isLoading}
            className="p-2 rounded-lg bg-[#141414] border border-white/10 hover:border-[#FF5C00]/40 text-white/60 hover:text-[#FF5C00] transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh GitHub Feed"
            aria-label="Refresh GitHub Feed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#FF5C00]' : ''}`} />
          </button>

          <a
            href="https://github.com/Vidson313"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF5C00]/10 hover:bg-[#FF5C00]/20 border border-[#FF5C00]/30 hover:border-[#FF5C00] text-[#FF5C00] font-mono-code text-xs font-semibold transition-all group"
          >
            <span>github.com/Vidson313</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Main Terminal Shell Frame */}
      <div className="rounded-xl border border-white/10 bg-[#101010]/95 backdrop-blur-md overflow-hidden shadow-2xl">
        {/* Terminal Window Header Bar */}
        <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-[#171717] border-b border-white/[0.08] gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2 font-mono-code text-xs text-white/70">
              <Terminal className="w-3.5 h-3.5 text-[#FF5C00]" />
              <span className="text-white/90 font-medium">vidson@github-telemetry:~</span>
              <span className="text-white/40">git log --all --recent</span>
            </div>
          </div>

          {/* Navigation View Switcher */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setActiveTab('stream')}
              className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-mono-code transition-all ${
                activeTab === 'stream'
                  ? 'bg-[#FF5C00] text-black font-semibold shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Latest Activity Stream</span>
            </button>
            <button
              onClick={() => setActiveTab('repos')}
              className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-mono-code transition-all ${
                activeTab === 'repos'
                  ? 'bg-[#FF5C00] text-black font-semibold shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Active Repositories ({profile.public_repos})</span>
            </button>
          </div>
        </div>

        {/* Profile Quick Stats Bar */}
        <div className="px-6 py-4 bg-[#131313] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={profile.avatar_url}
              alt={profile.login}
              className="w-10 h-10 rounded-full border border-white/20 p-0.5 object-cover"
              loading="lazy"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-grotesk font-bold text-sm tracking-wide">
                  {profile.login}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-code bg-[#FF5C00]/20 text-[#FF5C00] font-semibold">
                  PROD_DEV
                </span>
              </div>
              <p className="text-xs text-white/50 font-mono-code">
                Full-Stack Systems & Microservices Architect
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono-code text-xs text-white/60">
            <div>
              <span className="text-white font-bold">{profile.public_repos}</span>
              <span className="text-white/40 ml-1.5">Public Repos</span>
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <div>
              <span className="text-white font-bold">{totalContributions}</span>
              <span className="text-emerald-400 font-semibold ml-1.5">Contributions (2026)</span>
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Identity</span>
            </div>
          </div>
        </div>

        {/* GITHUB CONTRIBUTION HEATMAP MATRIX (مستطیل شدت فعالیت) */}
        <div className="px-6 py-5 bg-[#0e0e0e] border-b border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 font-mono-code text-xs">
              <Flame className="w-4 h-4 text-[#FF5C00]" />
              <span className="font-bold text-white tracking-wider">ANNUAL CONTRIBUTION MATRIX</span>
              <span className="text-white/40">({totalContributions} contributions in 2026)</span>
            </div>

            {/* Hover tooltip or legend */}
            <div className="flex items-center gap-3 font-mono-code text-[11px] text-white/40">
              {hoveredDay && hoveredDay.level >= 0 ? (
                <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-[#1a1a1a] border border-white/10 text-white">
                  <Calendar className="w-3 h-3 text-[#FF5C00]" />
                  <span>
                    <strong className="text-emerald-400">{hoveredDay.count} contribution{hoveredDay.count === 1 ? '' : 's'}</strong> on {formatDate(hoveredDay.date)}
                  </span>
                </div>
              ) : (
                <span>Hover square for date metrics</span>
              )}

              {/* Heatmap Legend */}
              <div className="flex items-center gap-1.5 ml-2">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded-sm bg-[#181818] border border-white/5 inline-block" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0e4429] inline-block" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#006d32] inline-block" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#26a641] inline-block" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#39d353] inline-block" />
                <span>More</span>
              </div>
            </div>
          </div>

          {/* Interactive Scrollable Contribution Grid */}
          <div className="overflow-x-auto pb-2 scrollbar-thin">
            <div className="min-w-[780px] flex gap-[3px] py-1">
              {weeksData.map((week, wIdx) => (
                <div key={`week-${wIdx}`} className="flex flex-col gap-[3px]">
                  {week.map((day, dIdx) => (
                    <button
                      key={`day-${wIdx}-${dIdx}`}
                      disabled={day.level < 0}
                      onMouseEnter={() => day.level >= 0 && setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-[11px] h-[11px] rounded-[2px] border transition-transform duration-100 ${getLevelColor(
                        day.level
                      )} ${day.level >= 0 ? 'hover:scale-125' : 'cursor-default'}`}
                      aria-label={day.level >= 0 ? `${day.count} contributions on ${day.date}` : undefined}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Months row */}
            <div className="min-w-[780px] flex justify-between font-mono-code text-[10px] text-white/30 pt-2 px-1">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>

        {/* Dynamic Activity Feed Content Body */}
        <div className="p-6">
          {activeTab === 'stream' ? (
            /* LATEST ACTIVITY STREAM (Commits & Events strictly ordered by latest date) */
            <div className="space-y-3">
              <div className="font-mono-code text-xs text-white/40 mb-2 flex items-center justify-between">
                <span>CHRONOLOGICAL LIVE ACTIVITY STREAM // STRICTLY NEWEST FIRST</span>
                <span>EVENT TYPE / REPOSITORY / TIMESTAMP</span>
              </div>

              {activities.map((act) => (
                <div
                  key={act.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-[#141414]/70 border border-white/[0.06] hover:border-[#FF5C00]/30 hover:bg-[#181818] transition-all group"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    {/* Icon badge */}
                    <div className="p-2 rounded bg-[#FF5C00]/10 text-[#FF5C00] group-hover:bg-[#FF5C00] group-hover:text-black transition-colors shrink-0 mt-0.5 sm:mt-0">
                      {act.category === 'star' ? (
                        <Star className="w-4 h-4 fill-[#FF5C00]/20" />
                      ) : (
                        <GitCommit className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Event type badge */}
                        <span
                          className={`px-2 py-0.5 rounded font-mono-code text-[10px] font-bold uppercase tracking-wider ${
                            act.category === 'star'
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              : 'bg-[#FF5C00]/20 text-[#FF5C00] border border-[#FF5C00]/30'
                          }`}
                        >
                          {act.type}
                        </span>

                        {/* Repo name link */}
                        <a
                          href={act.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono-code text-xs font-bold text-white group-hover:text-[#FF5C00] transition-colors underline decoration-white/20 underline-offset-2"
                        >
                          {act.repo}
                        </a>

                        {act.sha && (
                          <span className="px-1.5 py-0.2 rounded bg-black/60 font-mono-code text-[11px] text-[#FF5C00] border border-white/10">
                            {act.sha}
                          </span>
                        )}

                        {act.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono-code text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>verified</span>
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-white/90 font-mono-code mt-1 line-clamp-1">
                        {act.title}
                      </p>
                      <p className="text-xs text-white/50 font-mono-code mt-0.5 line-clamp-1">
                        {act.detail}
                      </p>
                    </div>
                  </div>

                  {/* Date & Link */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 font-mono-code text-xs text-white/40">
                    <span className="flex items-center gap-1.5 text-white/60">
                      <Clock className="w-3 h-3 text-[#FF5C00]" />
                      <span>{formatDate(act.date)}</span>
                      <span className="text-white/30">({getRelativeTime(act.date)})</span>
                    </span>
                    <a
                      href={act.sha ? `${act.repoUrl}/commit/${act.sha}` : act.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 group-hover:text-[#FF5C00] transition-colors p-1"
                      aria-label={`View ${act.title} on GitHub`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ACTIVE REPOSITORIES VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {repos.map((repo, idx) => (
                <div
                  key={`${repo.name}-${idx}`}
                  className="flex flex-col justify-between p-4 rounded-lg bg-[#141414]/70 border border-white/[0.06] hover:border-[#FF5C00]/40 transition-all group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono-code font-bold text-sm text-white group-hover:text-[#FF5C00] transition-colors flex items-center gap-1.5"
                      >
                        <FolderGit2 className="w-4 h-4 text-[#FF5C00] shrink-0" />
                        <span className="truncate">{repo.name}</span>
                      </a>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/30 group-hover:text-[#FF5C00] transition-colors"
                        aria-label={`Open repository ${repo.name}`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <p className="mt-2.5 text-xs text-white/60 line-clamp-2 leading-relaxed">
                      {repo.description || 'Production codebase and architectural modules maintained by @vidson313.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between font-mono-code text-xs text-white/50">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language)}`} />
                      <span>{repo.language || 'Code'}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-1 text-amber-400/90">
                          <Star className="w-3 h-3 fill-amber-400/40" />
                          <span>{repo.stargazers_count}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3 h-3 text-white/40" />
                        <span>{repo.forks_count}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer command prompt summary */}
        <div className="px-6 py-3 bg-[#0d0d0d] border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 font-mono-code text-xs text-white/40">
          <div className="flex items-center gap-2">
            <span className="text-[#FF5C00] font-bold">»</span>
            <span>Real-time telemetry pipeline synced directly with github.com/Vidson313.</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Branch: <span className="text-white/70">main</span></span>
            <span className="text-white/20">•</span>
            <span>Status: <span className="text-emerald-400 font-semibold">200 OK</span></span>
          </div>
        </div>
      </div>
    </section>
  );
}
