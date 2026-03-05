import { AdminLinksService } from '@/app/core/services/admin/links-service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AdminLinksResponse } from '@linktree/validation';

@Component({
  selector: 'app-link',
  imports: [CommonModule],
  templateUrl: './link.html',
})
export class LinkComponent {
  filter: 'all' | 'active' | 'blocked' = 'all';
  links: AdminLinksResponse[] = [];
  loading = true;
  error: string | null = null;
  togglingId: string | null = null;
  deletingId: string | null = null;

  constructor(
    private adminLinksService: AdminLinksService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadLinks();
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
