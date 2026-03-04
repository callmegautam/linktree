import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-link',
  imports: [CommonModule],
  templateUrl: './link.html',
})
export class LinkComponent {
  filter: 'all' | 'active' | 'blocked' = 'all';

  links = [
    {
      title: 'Personal Blog',
      url: 'https://blog.com',
      owner: 'johndoe',
      clicks: 120,
      status: 'Active',
      showMenu: false,
    },
    {
      title: 'Portfolio',
      url: 'https://portfolio.com',
      owner: 'janesmith',
      clicks: 90,
      status: 'Blocked',
      showMenu: false,
    },
    {
      title: 'Music Page',
      url: 'https://music.com',
      owner: 'marktaylor',
      clicks: 45,
      status: 'Active',
      showMenu: false,
    },
  ];

  get filteredLinks() {
    if (this.filter === 'all') return this.links;
    if (this.filter === 'active') return this.links.filter((l) => l.status === 'Active');
    if (this.filter === 'blocked') return this.links.filter((l) => l.status === 'Blocked');
    return this.links;
  }

  get totalClicks() {
    return this.links.reduce((sum, link) => sum + link.clicks, 0);
  }

  get activeLinks() {
    return this.links.filter((l) => l.status === 'Active').length;
  }

  toggleMenu(link: any) {
    this.links.forEach((l) => {
      if (l !== link) l.showMenu = false;
    });
    link.showMenu = !link.showMenu;
  }

  blockUnblockLink(link: any) {
    link.status = link.status === 'Active' ? 'Blocked' : 'Active';
    link.showMenu = false;
  }

  deleteLink(link: any) {
    this.links = this.links.filter((l) => l !== link);
  }
}
