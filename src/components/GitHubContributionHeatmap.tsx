import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Calendar, Flame, TrendingUp, Award, X } from 'lucide-react';

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: number; // 0 | 1 | 2 | 3 | 4 (-1 for padding)
}

export type HeatmapTheme = 'github' | 'ember';

interface GitHubContributionHeatmapProps {
  username: string;
  contributionsByPeriod: Record<string, ContributionDay[]>;
  totalsByPeriod: Record<string, number>;
  availablePeriods: string[];
  selectedPeriod: string;
  onSelectPeriod: (period: string) => void;
  isLoading?: boolean;
  onSelectDay?: (day: ContributionDay | null) => void;
}

interface TooltipState {
  day: ContributionDay;
  x: number;
  y: number;
}

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAY_LABELS: Array<{ row: number; label: string }> = [
  { row: 1, label: 'Mon' },
  { row: 3, label: 'Wed' },
  { row: 5, label: 'Fri' },
];

const LEVEL_LABELS: Record<number, string> = {
  0: 'No activity',
  1: 'Low',
  2: 'Moderate',
  3: 'High',
  4: 'Peak',
};

const THEME_CELL_CLASSES: Record<HeatmapTheme, Record<number, string>> = {
  github: {
    [-1]: 'bg-transparent border-transparent pointer-events-none',
    0: 'bg-[#17191d] border-white/[0.05] hover:border-white/30',
    1: 'bg-[#0e4429] border-[#196c2e]/60 hover:border-emerald-300',
    2: 'bg-[#006d32] border-[#26a641]/60 hover:border-emerald-200',
    3: 'bg-[#26a641] border-[#39d353]/70 hover:border-white',
    4: 'bg-[#39d353] border-emerald-200/80 hover:border-white',
  },
  ember: {
    [-1]: 'bg-transparent border-transparent pointer-events-none',
    0: 'bg-[#171717] border-white/[0.05] hover:border-white/30',
    1: 'bg-[#431a05] border-[#7c2d06]/60 hover:border-[#FF5C00]/80',
    2: 'bg-[#7c2d06] border-[#c2410c]/60 hover:border-[#ff8a47]',
    3: 'bg-[#c2410c] border-[#FF5C00]/70 hover:border-white',
    4: 'bg-[#FF5C00] border-[#ffb085]/90 hover:border-white',
  },
};

function parseUtcDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00Z`);
}

function formatFullDate(isoDate: string): string {
  try {
    return parseUtcDate(isoDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
  } catch {
    return isoDate;
  }
}

function formatShortDate(isoDate: string): string {
  try {
    return parseUtcDate(isoDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  } catch {
    return isoDate;
  }
}

function getPeriodLabel(period: string): string {
  return period === 'last' ? 'Last 12m' : period;
}

function getPeriodHeading(period: string): string {
  return period === 'last' ? 'the last 12 months' : period;
}

export default function GitHubContributionHeatmap({
  username,
  contributionsByPeriod,
  totalsByPeriod,
  availablePeriods,
  selectedPeriod,
  onSelectPeriod,
  isLoading = false,
  onSelectDay,
}: GitHubContributionHeatmapProps) {
  const [theme, setTheme] = useState<HeatmapTheme>('github');
  const [hoveredTooltip, setHoveredTooltip] = useState<TooltipState | null>(null);
  const [pinnedDay, setPinnedDay] = useState<ContributionDay | null>(null);
  const [activeLevelFilter, setActiveLevelFilter] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const days = useMemo(() => {
    const raw = contributionsByPeriod[selectedPeriod] || [];
    return [...raw].sort((a, b) => a.date.localeCompare(b.date));
  }, [contributionsByPeriod, selectedPeriod]);

  const totalCount = useMemo(() => {
    if (typeof totalsByPeriod[selectedPeriod] === 'number') {
      return totalsByPeriod[selectedPeriod];
    }
    return days.reduce((sum, d) => sum + d.count, 0);
  }, [totalsByPeriod, selectedPeriod, days]);

  // Reset pinned day when switching period
  useEffect(() => {
    setPinnedDay(null);
    setHoveredTooltip(null);
    onSelectDay?.(null);
  }, [selectedPeriod, onSelectDay]);

  // Allow Escape to clear pinned selection or intensity filter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (pinnedDay) {
          setPinnedDay(null);
          onSelectDay?.(null);
        } else if (activeLevelFilter !== null) {
          setActiveLevelFilter(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pinnedDay, activeLevelFilter, onSelectDay]);

  // Build 7-row week columns with accurate calendar weekday alignment & month labels
  const { weeks, monthLabels } = useMemo(() => {
    if (days.length === 0) {
      return { weeks: [] as ContributionDay[][], monthLabels: {} as Record<number, string> };
    }

    const builtWeeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    const firstWeekday = parseUtcDate(days[0].date).getUTCDay();
    for (let i = 0; i < firstWeekday; i++) {
      currentWeek.push({ date: `pad-start-${i}`, count: 0, level: -1 });
    }

    for (const day of days) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        builtWeeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({
          date: `pad-end-${currentWeek.length}`,
          count: 0,
          level: -1,
        });
      }
      builtWeeks.push(currentWeek);
    }

    // Position month labels precisely above the first week containing that month
    const labels: Record<number, string> = {};
    let lastLabeledMonth = -1;
    let lastLabeledWeek = -10;

    builtWeeks.forEach((week, weekIdx) => {
      // Find first valid day in this week, preferring the 1st of a month if present
      const firstOfMonth = week.find(
        (d) => d.level >= 0 && parseUtcDate(d.date).getUTCDate() === 1
      );
      const sampleDay = firstOfMonth || week.find((d) => d.level >= 0);
      if (!sampleDay) return;

      const monthIdx = parseUtcDate(sampleDay.date).getUTCMonth();
      if (monthIdx !== lastLabeledMonth) {
        // Prevent overlapping labels when the opening week is partial
        if (weekIdx - lastLabeledWeek >= 2) {
          labels[weekIdx] = MONTH_SHORT[monthIdx];
          lastLabeledWeek = weekIdx;
        }
        lastLabeledMonth = monthIdx;
      }
    });

    return { weeks: builtWeeks, monthLabels: labels };
  }, [days]);

  // Compute authentic coding metrics from the selected period
  const stats = useMemo(() => {
    let activeDays = 0;
    let longestStreak = 0;
    let runningStreak = 0;
    let peakDay: ContributionDay | null = null;

    for (const day of days) {
      if (day.count > 0) {
        activeDays += 1;
        runningStreak += 1;
        if (runningStreak > longestStreak) {
          longestStreak = runningStreak;
        }
        if (!peakDay || day.count > peakDay.count) {
          peakDay = day;
        }
      } else {
        runningStreak = 0;
      }
    }

    return {
      activeDays,
      longestStreak,
      peakDay,
    };
  }, [days]);

  const showTooltipForElement = useCallback(
    (day: ContributionDay, element: HTMLElement) => {
      if (day.level < 0 || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const cellRect = element.getBoundingClientRect();
      const rawX = cellRect.left - containerRect.left + cellRect.width / 2;
      const clampedX = Math.max(96, Math.min(containerRect.width - 96, rawX));
      const y = cellRect.top - containerRect.top;
      setHoveredTooltip({ day, x: clampedX, y });
    },
    []
  );

  const handleTogglePinDay = useCallback(
    (day: ContributionDay) => {
      if (day.level < 0) return;
      setPinnedDay((prev) => {
        const next = prev?.date === day.date ? null : day;
        onSelectDay?.(next);
        return next;
      });
    },
    [onSelectDay]
  );

  const handleToggleLevelFilter = (level: number) => {
    setActiveLevelFilter((prev) => (prev === level ? null : level));
  };

  const inspectedDay = hoveredTooltip?.day ?? pinnedDay;
  const accentTextClass = theme === 'github' ? 'text-emerald-400' : 'text-[#FF5C00]';
  const cellPalette = THEME_CELL_CLASSES[theme];

  return (
    <div
      ref={containerRef}
      className="relative px-6 py-5 bg-[#0e0e0e] border-b border-white/[0.06]"
    >
      {/* Floating Tooltip anchored outside the horizontal scroll box so it never clips */}
      {hoveredTooltip && (
        <div
          role="tooltip"
          style={{
            left: `${hoveredTooltip.x}px`,
            top: `${Math.max(8, hoveredTooltip.y - 44)}px`,
          }}
          className="pointer-events-none absolute z-30 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#18181b] border border-white/15 px-2.5 py-1.5 shadow-xl text-[11px] font-mono-code text-white transition-opacity duration-100"
        >
          <span className={`font-semibold tabular-nums ${accentTextClass}`}>
            {hoveredTooltip.day.count}{' '}
            {hoveredTooltip.day.count === 1 ? 'contribution' : 'contributions'}
          </span>
          <span className="text-white/40 mx-1.5">·</span>
          <span className="text-white/80">{formatFullDate(hoveredTooltip.day.date)}</span>
        </div>
      )}

      {/* Header Row: Title + Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#FF5C00] shrink-0" />
            <h3 className="font-grotesk font-semibold text-base text-white tracking-tight">
              Contribution Activity Heatmap
            </h3>
          </div>
          <p className="mt-1 text-xs font-mono-code text-white/50 tabular-nums">
            <span className="text-white font-semibold">{totalCount}</span> contributions in{' '}
            {getPeriodHeading(selectedPeriod)}
            <span className="mx-2 text-white/25" aria-hidden="true">
              ·
            </span>
            <span>@{username}</span>
          </p>
        </div>

        {/* Interactive Controls: Period Selector & Palette Switch */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period Segmented Control */}
          <div
            role="group"
            aria-label="Select contribution period"
            className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#141414] border border-white/[0.08]"
          >
            {availablePeriods.map((period) => {
              const isSelected = selectedPeriod === period;
              return (
                <button
                  key={period}
                  type="button"
                  onClick={() => onSelectPeriod(period)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono-code tabular-nums whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF5C00] ${
                    isSelected
                      ? 'bg-[#FF5C00] text-black font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {getPeriodLabel(period)}
                </button>
              );
            })}
          </div>

          {/* Palette Switch */}
          <div
            role="group"
            aria-label="Heatmap color theme"
            className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#141414] border border-white/[0.08]"
          >
            <button
              type="button"
              onClick={() => setTheme('github')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono-code whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 ${
                theme === 'github'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              GitHub
            </button>
            <button
              type="button"
              onClick={() => setTheme('ember')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono-code whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF5C00] ${
                theme === 'ember'
                  ? 'bg-[#FF5C00]/20 text-[#FF5C00] font-semibold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Ember
            </button>
          </div>
        </div>
      </div>

      {/* Heatmap Matrix */}
      <div className="overflow-x-auto pb-2">
        {isLoading && weeks.length === 0 ? (
          <div
            aria-label="Loading contribution heatmap"
            className="min-w-[820px] flex gap-[3px] pl-9 pt-5 pb-1 animate-pulse"
          >
            {Array.from({ length: 53 }).map((_, wIdx) => (
              <div key={`skel-w-${wIdx}`} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((__, dIdx) => (
                  <span
                    key={`skel-d-${wIdx}-${dIdx}`}
                    className="w-[12px] h-[12px] rounded-[2px] bg-white/[0.05]"
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="min-w-[820px] flex items-start gap-2.5">
            {/* Weekday Axis Labels (Sun=0 .. Sat=6; display Mon, Wed, Fri) */}
            <div
              aria-hidden="true"
              className="flex flex-col gap-[3px] pt-5 pr-1 font-mono-code text-[10px] text-white/35 select-none shrink-0"
            >
              {Array.from({ length: 7 }).map((_, rowIdx) => {
                const match = WEEKDAY_LABELS.find((item) => item.row === rowIdx);
                return (
                  <span
                    key={`wd-${rowIdx}`}
                    className="h-[12px] leading-[12px] flex items-center justify-end w-6"
                  >
                    {match ? match.label : ''}
                  </span>
                );
              })}
            </div>

            {/* Weeks Columns with Exact Month Headers */}
            <div
              role="region"
              aria-label={`GitHub contribution heatmap for ${username} during ${getPeriodHeading(
                selectedPeriod
              )}`}
              className="flex gap-[3px] flex-1"
            >
              {weeks.map((week, wIdx) => (
                <div key={`week-${wIdx}`} className="flex flex-col gap-[3px]">
                  {/* Exact Month Label Slot */}
                  <div className="h-4 relative mb-0.5 select-none">
                    {monthLabels[wIdx] && (
                      <span className="absolute left-0 top-0 font-mono-code text-[10px] text-white/45 whitespace-nowrap">
                        {monthLabels[wIdx]}
                      </span>
                    )}
                  </div>

                  {/* 7 Daily Squares */}
                  {week.map((day, dIdx) => {
                    const isRealDay = day.level >= 0;
                    const isPinned = isRealDay && pinnedDay?.date === day.date;
                    const isDimmed =
                      isRealDay &&
                      activeLevelFilter !== null &&
                      day.level !== activeLevelFilter;

                    return (
                      <button
                        key={`day-${wIdx}-${dIdx}`}
                        type="button"
                        disabled={!isRealDay}
                        aria-pressed={isPinned}
                        aria-label={
                          isRealDay
                            ? `${formatFullDate(day.date)}: ${day.count} ${
                                day.count === 1 ? 'contribution' : 'contributions'
                              }, ${LEVEL_LABELS[day.level] || 'Activity'}`
                            : undefined
                        }
                        onMouseEnter={(e) => showTooltipForElement(day, e.currentTarget)}
                        onMouseLeave={() => setHoveredTooltip(null)}
                        onFocus={(e) => showTooltipForElement(day, e.currentTarget)}
                        onBlur={() => setHoveredTooltip(null)}
                        onClick={() => handleTogglePinDay(day)}
                        className={`w-[12px] h-[12px] rounded-[2px] border transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                          cellPalette[day.level] ?? cellPalette[0]
                        } ${
                          isRealDay ? 'cursor-pointer hover:scale-125' : 'cursor-default'
                        } ${
                          isPinned ? 'ring-1 ring-white scale-110 z-10' : ''
                        } ${isDimmed ? 'opacity-20' : 'opacity-100'}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Row: Active Readout, Summary Stats, & Interactive Intensity Legend */}
      <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono-code">
        {/* Left: Live Inspected Day or Summary Stats */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-white/55 tabular-nums">
          {inspectedDay ? (
            <div className="flex items-center gap-2 text-white">
              <span
                className={`w-2.5 h-2.5 rounded-[2px] border shrink-0 ${
                  cellPalette[inspectedDay.level] ?? cellPalette[0]
                }`}
              />
              <span className={`font-semibold ${accentTextClass}`}>
                {inspectedDay.count}{' '}
                {inspectedDay.count === 1 ? 'contribution' : 'contributions'}
              </span>
              <span className="text-white/30" aria-hidden="true">
                ·
              </span>
              <span className="text-white/80">{formatFullDate(inspectedDay.date)}</span>
              <span className="text-white/30" aria-hidden="true">
                ·
              </span>
              <span className="text-white/50">{LEVEL_LABELS[inspectedDay.level]}</span>
              {pinnedDay && (
                <button
                  type="button"
                  onClick={() => {
                    setPinnedDay(null);
                    onSelectDay?.(null);
                  }}
                  className="ml-1 inline-flex items-center gap-1 text-white/45 hover:text-white transition-colors cursor-pointer"
                  aria-label="Clear selected date"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : (
            <>
              <span className="inline-flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-white/35" />
                <span>
                  <strong className="text-white font-semibold">{stats.activeDays}</strong> active
                  days
                </span>
              </span>
              <span className="text-white/20" aria-hidden="true">
                ·
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#FF5C00]" />
                <span>
                  <strong className="text-white font-semibold">{stats.longestStreak}d</strong>{' '}
                  longest streak
                </span>
              </span>
              {stats.peakDay && (
                <>
                  <span className="text-white/20" aria-hidden="true">
                    ·
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-white/35" />
                    <span>
                      Peak:{' '}
                      <strong className="text-white font-semibold">{stats.peakDay.count}</strong> on{' '}
                      {formatShortDate(stats.peakDay.date)}
                    </span>
                  </span>
                </>
              )}
            </>
          )}
        </div>

        {/* Right: Interactive Intensity Legend (Click swatch to filter squares by intensity) */}
        <div className="flex items-center gap-2 text-[11px] text-white/45 shrink-0">
          {activeLevelFilter !== null && (
            <button
              type="button"
              onClick={() => setActiveLevelFilter(null)}
              className="text-white/60 hover:text-white underline underline-offset-2 mr-1 cursor-pointer whitespace-nowrap"
            >
              Reset filter
            </button>
          )}
          <span className="select-none">Less</span>
          <div className="flex items-center gap-1" role="group" aria-label="Filter by activity intensity">
            {[0, 1, 2, 3, 4].map((level) => {
              const isSelected = activeLevelFilter === level;
              return (
                <button
                  key={`legend-${level}`}
                  type="button"
                  onClick={() => handleToggleLevelFilter(level)}
                  title={`Highlight ${LEVEL_LABELS[level]} days`}
                  aria-label={`Highlight ${LEVEL_LABELS[level]} days`}
                  aria-pressed={isSelected}
                  className={`w-[11px] h-[11px] rounded-[2px] border transition-transform duration-150 cursor-pointer hover:scale-125 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                    cellPalette[level]
                  } ${isSelected ? 'ring-1 ring-white scale-125' : ''}`}
                />
              );
            })}
          </div>
          <span className="select-none">More</span>
        </div>
      </div>
    </div>
  );
}
