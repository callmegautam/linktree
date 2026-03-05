import { AdminUsersService } from '@/app/core/services/admin/users-service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AdminUsersResponse } from '@linktree/validation';

@Component({
  selector: 'app-user',
  imports: [CommonModule],
  templateUrl: './user.html',
})
export class User {
  filter: 'all' | 'active' | 'blocked' = 'all';
  users: AdminUsersResponse[] = [];
  loading = true;
  error: string | null = null;
  togglingId: string | null = null;

  constructor(
    private adminUsersService: AdminUsersService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    this.adminUsersService.getUsers().subscribe({
      next: (res) => {
        this.users = res.data ?? [];
        this.loading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load users';
        this.loading = false;
      },
    });
  }

  get filteredUsers(): AdminUsersResponse[] {
    if (this.filter === 'all') return this.users;
    if (this.filter === 'active') return this.users.filter((u) => !u.isBlocked);
    if (this.filter === 'blocked') return this.users.filter((u) => u.isBlocked);
    return this.users;
  }

  blockUnblockUser(user: AdminUsersResponse): void {
    const status = user.isBlocked ? 'unblock' : 'block';
    this.togglingId = user.id;
    this.adminUsersService.toggleUserStatus(user.id, status).subscribe({
      next: () => {
        this.loadUsers();
        this.togglingId = null;
        this.cd.detectChanges();
      },
      error: () => {
        this.error = 'Failed to update user status';
        this.togglingId = null;
        this.cd.detectChanges();
      },
    });
  }
}
