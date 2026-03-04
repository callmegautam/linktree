import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-user',
  imports: [CommonModule],
  templateUrl: './user.html',
})
export class User {
  filter: 'all' | 'active' | 'blocked' = 'all';

  users = [
    {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      linkTitle: 'Personal Blog',
      clicks: 120,
      status: 'Active',
    },
    {
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane@example.com',
      linkTitle: 'Portfolio',
      clicks: 90,
      status: 'Blocked',
    },
    {
      name: 'Mark Taylor',
      username: 'marktaylor',
      email: 'mark@example.com',
      linkTitle: 'Music Page',
      clicks: 45,
      status: 'Active',
    },
  ];

  get filteredUsers() {
    if (this.filter === 'all') return this.users;
    if (this.filter === 'active') return this.users.filter((u) => u.status === 'Active');
    if (this.filter === 'blocked') return this.users.filter((u) => u.status === 'Blocked');
    return this.users;
  }

  blockUnblockUser(user: any) {
    user.status = user.status === 'Active' ? 'Blocked' : 'Active';
  }
}
