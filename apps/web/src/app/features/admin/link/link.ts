import { AnalyticsService } from '@/app/core/services/admin/analytics-service';
import { AdminLinksService } from '@/app/core/services/admin/links-service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { AdminLinksResponse } from '@linktree/validation';

@Component({
  selector: 'app-link',
  imports: [CommonModule],
  templateUrl: './link.html',
})
export class LinkComponent implements OnDestroy {
  filter: 'all' | 'active' | 'blocked' = 'all';
  links: AdminLinksResponse[] = [];
  loading = true;
  error: string | null = null;
  togglingId: string | null = null;
  deletingId: string | null = null;
  /** Same source as dashboard (analytics API) so stats match */
  public totalLinksCount: number = 0;
  public totalClicksCount: number = 0;
  /** Map key = title + url so we can show per-link clicks from analytics (topPerformingLinks) */
  private clicksByLinkKey: Map<string, number> = new Map();
  private refreshInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private adminLinksService: AdminLinksService,
    private analyticsService: AnalyticsService,
    private cd: ChangeDetectorRef,
  ) {}

  loadAnalytics(): void {
    this.analyticsService.getAnalytics().subscribe((res) => {
      if (res?.data?.analytics) {
        this.totalLinksCount = res.data.analytics.totalLinks ?? 0;
        this.totalClicksCount = res.data.analytics.totalClicks ?? 0;
        this.cd.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    this.loadLinks();
    this.loadAnalytics();
    this.refreshInterval = setInterval(() => {
      this.loadLinks();
      this.loadAnalytics();
    }, 30_000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  loadLinks(): void {
    this.loading = true;
    this.error = null;
    this.adminLinksService.getLinks().subscribe({
      next: (res) => {
        this.links = res.data ?? [];
        this.loading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load links';
        this.loading = false;
        this.cd.detectChanges();
      },
    });
  }

  get filteredLinks(): AdminLinksResponse[] {
    if (this.filter === 'all') return this.links;
    if (this.filter === 'active') return this.links.filter((l) => !l.isBlocked);
    if (this.filter === 'blocked') return this.links.filter((l) => l.isBlocked);
    return this.links;
  }

  get totalClicks(): number {
    return this.links.reduce((sum, link) => sum + link.clicks, 0);
  }

  get activeLinksCount(): number {
    return this.links.filter((l) => !l.isBlocked).length;
  }

  /** Per-link clicks: prefer analytics (topPerformingLinks) when available, else link.clicks from API */
  getLinkClicks(link: AdminLinksResponse): number {
    const key = `${(link.title ?? '').trim()}|${(link.link ?? '').trim()}`;
    if (this.clicksByLinkKey.has(key)) return this.clicksByLinkKey.get(key)!;
    return link.clicks ?? 0;
  }

  blockUnblockLink(link: AdminLinksResponse): void {
    const status = link.isBlocked ? 'unblock' : 'block';
    this.togglingId = link.id;
    this.adminLinksService.toggleLinkStatus(link.id, status).subscribe({
      next: () => {
        this.loadLinks();
        this.togglingId = null;
        this.cd.detectChanges();
      },
      error: () => {
        this.error = 'Failed to update link status';
        this.togglingId = null;
        this.cd.detectChanges();
      },
    });
  }

  deleteLink(link: AdminLinksResponse): void {
    this.deletingId = link.id;
    this.adminLinksService.deleteLink(link.id).subscribe({
      next: () => {
        this.loadLinks();
        this.deletingId = null;
        this.cd.detectChanges();
      },
      error: () => {
        this.error = 'Failed to delete link';
        this.deletingId = null;
        this.cd.detectChanges();
      },
    });
  }
}
