import { AnalyticsService } from '@/app/core/services/admin/analytics-service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnDestroy } from '@angular/core';
import { AnalyticsResponse } from '@linktree/validation';

type ChartRange = 7 | 30 | 90;

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnDestroy {
  analytics: AnalyticsResponse | null = null;
  analyticsLoading = true;
  selectedRange: ChartRange = 7;
  private refreshInterval: ReturnType<typeof setInterval> | null = null;

  readonly chartWidth = 280;
  readonly chartHeight = 96;
  readonly padding = { top: 8, right: 12, bottom: 18, left: 32 };

  constructor(
    private analyticsService: AnalyticsService,
    private cd: ChangeDetectorRef,
  ) {}

  get chartRanges(): { label: string; value: ChartRange }[] {
    return [
      { label: '7 Days', value: 7 },
      { label: '30 Days', value: 30 },
      { label: '90 Days', value: 90 },
    ];
  }

  get chartData(): { date: string; clicks: number }[] {
    const recent = this.analytics?.recentActivity ?? [];
    const totalClicks = this.analytics?.analytics?.totalClicks ?? 0;
    const result: { date: string; clicks: number }[] = [];
    const now = new Date();
    for (let i = this.selectedRange - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      result.push({ date: d.toISOString().slice(0, 10), clicks: 0 });
    }
    const rangeEnd = result[result.length - 1]?.date ?? '';
    const rangeStart = result[0]?.date ?? '';
    const byDay = new Map<string, number>();
    for (const a of recent) {
      const dateStr =
        typeof a.date === 'string'
          ? (a.date as string).slice(0, 10)
          : new Date(a.date).toISOString().slice(0, 10);
      if (dateStr >= rangeStart && dateStr <= rangeEnd) {
        byDay.set(dateStr, (byDay.get(dateStr) ?? 0) + a.clicks);
      } else {
        byDay.set(rangeEnd, (byDay.get(rangeEnd) ?? 0) + a.clicks);
      }
    }
    let series = result.map((r) => ({ ...r, clicks: byDay.get(r.date) ?? r.clicks }));
    const sum = series.reduce((s, d) => s + d.clicks, 0);
    if (totalClicks > 0 && sum === 0 && series.length) {
      series = series.map((r, i) =>
        i === series.length - 1 ? { ...r, clicks: totalClicks } : r,
      );
    }
    return series;
  }

  get yScaleMax(): number {
    const data = this.chartData;
    const max = data.length ? Math.max(1, ...data.map((d) => d.clicks)) : 1;
    if (max <= 5) return Math.min(5, Math.ceil(max));
    if (max <= 20) return Math.ceil(max / 5) * 5;
    const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
    const n = max / magnitude;
    return magnitude * (n <= 2 ? 2 : n <= 5 ? 5 : 10);
  }

  get innerWidth(): number {
    return this.chartWidth - this.padding.left - this.padding.right;
  }
  get innerHeight(): number {
    return this.chartHeight - this.padding.top - this.padding.bottom;
  }

  get areaPath(): string {
    const data = this.chartData;
    if (!data.length) return '';
    const left = this.padding.left;
    const right = this.chartWidth - this.padding.right;
    const top = this.padding.top;
    const bottom = this.chartHeight - this.padding.bottom;
    const max = this.yScaleMax;
    const points: string[] = [];
    const n = data.length;
    for (let i = 0; i < n; i++) {
      const x = left + (i / (n - 1 || 1)) * this.innerWidth;
      const y = top + this.innerHeight - (data[i].clicks / max) * this.innerHeight;
      points.push(`${x},${y}`);
    }
    return `M ${left},${bottom} L ${points.join(' L ')} L ${right},${bottom} Z`;
  }

  get linePath(): string {
    const data = this.chartData;
    if (!data.length) return '';
    const left = this.padding.left;
    const top = this.padding.top;
    const max = this.yScaleMax;
    const n = data.length;
    const points: string[] = [];
    for (let i = 0; i < n; i++) {
      const x = left + (i / (n - 1 || 1)) * this.innerWidth;
      const y = top + this.innerHeight - (data[i].clicks / max) * this.innerHeight;
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')}`;
  }

  get yTicks(): { value: number; y: number }[] {
    const scaleMax = this.yScaleMax;
    const top = this.padding.top;
    const result: { value: number; y: number }[] = [];
    const step = scaleMax <= 5 ? 1 : scaleMax <= 20 ? 5 : Math.ceil(scaleMax / 5);
    for (let v = 0; v <= scaleMax; v += step) result.push({ value: v, y: top + this.innerHeight - (v / scaleMax) * this.innerHeight });
    if (result[result.length - 1]?.value !== scaleMax) result.push({ value: scaleMax, y: top });
    return [...new Map(result.map((t) => [t.value, t])).values()].sort((a, b) => a.y - b.y);
  }

  /** X-axis: one label per month in range (e.g. Jan, Feb, Mar) */
  get xLabels(): { label: string; x: number }[] {
    const data = this.chartData;
    if (!data.length) return [];
    const left = this.padding.left;
    const n = data.length;
    const byMonth = new Map<string, number[]>();
    for (let i = 0; i < n; i++) {
      const d = new Date(data[i].date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!byMonth.has(key)) byMonth.set(key, []);
      byMonth.get(key)!.push(i);
    }
    const out: { label: string; x: number }[] = [];
    for (const [, indices] of byMonth) {
      const midIdx = indices[Math.floor(indices.length / 2)];
      const d = new Date(data[midIdx].date);
      out.push({
        label: d.toLocaleDateString('en-US', { month: 'short' }),
        x: left + (midIdx / (n - 1 || 1)) * this.innerWidth,
      });
    }
    out.sort((a, b) => a.x - b.x);
    return out;
  }

  setRange(value: ChartRange): void {
    this.selectedRange = value;
    this.cd.detectChanges();
  }

  private donutSegment(cx: number, cy: number, innerR: number, outerR: number, startDeg: number, endDeg: number): string {
    const rad = (d: number) => (d * Math.PI) / 180;
    const x = (r: number, deg: number) => cx + r * Math.cos(rad(deg - 90));
    const y = (r: number, deg: number) => cy + r * Math.sin(rad(deg - 90));
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x(innerR, startDeg)} ${y(innerR, startDeg)} L ${x(outerR, startDeg)} ${y(outerR, startDeg)} A ${outerR} ${outerR} 0 ${large} 1 ${x(outerR, endDeg)} ${y(outerR, endDeg)} L ${x(innerR, endDeg)} ${y(innerR, endDeg)} A ${innerR} ${innerR} 0 ${large} 0 ${x(innerR, startDeg)} ${y(innerR, startDeg)} Z`;
  }

  get userStatsSegments(): { label: string; value: number; color: string; pathD: string }[] {
    const total = this.analytics?.analytics?.totalUsers ?? 0;
    const active = this.analytics?.analytics?.activeUsers ?? 0;
    const inactive = Math.max(0, total - active);
    const cx = 64;
    const cy = 64;
    const outerR = 52;
    const innerR = 28;
    const segments: { label: string; value: number; color: string; pathD: string }[] = [];
    if (total <= 0) {
      segments.push({ label: 'No users', value: 0, color: '#e5e7eb', pathD: this.donutSegment(cx, cy, innerR, outerR, 0, 360) });
      return segments;
    }
    const activeDeg = (active / total) * 360;
    segments.push({ label: 'Active', value: active, color: '#10b981', pathD: this.donutSegment(cx, cy, innerR, outerR, 0, activeDeg) });
    if (inactive > 0) {
      segments.push({ label: 'Inactive', value: inactive, color: '#e5e7eb', pathD: this.donutSegment(cx, cy, innerR, outerR, activeDeg, 360) });
    }
    return segments;
  }

  get userStatsTotal(): number {
    return this.analytics?.analytics?.totalUsers ?? 0;
  }
  get userStatsActive(): number {
    return this.analytics?.analytics?.activeUsers ?? 0;
  }

  private analyticsRetryCount = 0;

  loadAnalytics(): void {
    this.analyticsService.getAnalytics().subscribe({
      next: (res) => {
        if (res?.data) {
          this.analytics = res.data;
          this.analyticsLoading = false;
          this.analyticsRetryCount = 0;
          this.cd.detectChanges();
          // Run change detection again so pie chart / SVG paints after login navigation
          setTimeout(() => this.cd.detectChanges(), 0);
        }
      },
      error: () => {
        this.analyticsLoading = false;
        this.cd.detectChanges();
        if (this.analyticsRetryCount < 1) {
          this.analyticsRetryCount++;
          this.analyticsLoading = true;
          this.cd.detectChanges();
          setTimeout(() => this.loadAnalytics(), 400);
        }
      },
    });
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      this.loadAnalytics();
    }
  }

  ngOnInit(): void {
    this.loadAnalytics();
    this.refreshInterval = setInterval(() => this.loadAnalytics(), 15_000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }
}
