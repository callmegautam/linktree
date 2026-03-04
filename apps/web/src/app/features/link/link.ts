import { LinkService } from '@/app/core/services/link-service';
import { IconsModule } from '@/app/shared/components/icons';
import { AuthStore } from '@/app/store/auth';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateLinkBody, LinkResponse } from '@linktree/validation';
import { ToastrService } from 'ngx-toastr';
import { filter, map, Observable } from 'rxjs';
import { ChangeDetectorRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-link',
  imports: [CommonModule, IconsModule, FormsModule],
  templateUrl: './link.html',
})
export class Link implements OnInit {
  UserName$!: Observable<string>;
  showPopup = false;
  selectedItems: any[] = [];
  isCardOpen = false;
  links: LinkResponse[] = [];

  constructor(
    private authStore: AuthStore,
    private linkService: LinkService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
  ) {
    this.UserName$ = this.authStore.user$.pipe(
      filter((user): user is any => !!user),
      map((user) => user.username),
    );
  }

  socialItems = [
    { platform: 'instagram', icon: 'images/instagram.png' },
    { platform: 'facebook', icon: 'images/facebook.png' },
    { platform: 'youtube', icon: 'images/youtube.png' },
    { platform: 'spotify', icon: 'images/spotify.png' },
    { platform: 'slack', icon: 'images/slack.png' },
    { platform: 'x', icon: 'images/x.png' },
    { platform: 'snapchat', icon: 'images/snapchat.png' },
    { platform: 'github', icon: 'images/github.png' },
    { platform: 'linkedin', icon: 'images/linkedin.png' },
    { platform: 'discord', icon: 'images/discord.png' },
    { platform: 'telegram', icon: 'images/telegram.png' },
    { platform: 'substack', icon: 'images/substack.png' },
    { platform: 'pinterest', icon: 'images/pinterest.png' },
    { platform: 'twitch', icon: 'images/twitch.png' },
    { platform: 'whatsapp', icon: 'images/whatsapp.png' },
    { platform: 'threads', icon: 'images/threads.png' },
    { platform: 'reddit', icon: 'images/reddit.png' },
    { platform: 'mail', icon: 'images/mail.png' },
    { platform: 'applemusic', icon: 'images/applemusic.png' },
  ];

  selectSocial(item: any) {
    this.selectedItems.push({
      platform: item.platform,
      title: '',
      link: '',
      icon: item.icon,
      enabled: true,
    });
    this.togglePopup();
  }

  // create link

  saveSingleLink(index: number) {
    const item = this.selectedItems[index];

    if (!item.title || !item.link) {
      this.toastr.error('Please fill both Title and Link.');
      return;
    }

    const payload: CreateLinkBody = {
      platform: item.platform,
      title: item.title,
      link: item.link,
    };

    this.linkService.createLink(payload).subscribe({
      next: () => {
        this.toastr.success(`${item.platform} link saved successfully!`);
        this.selectedItems.splice(index, 1);
        this.loadLinks();
      },
      error: () => {
        this.toastr.error('Failed to save link.');
      },
    });
  }

  // get link

  loadLinks() {
    this.linkService.getLink().subscribe({
      next: (res) => {
        if (res.data) {
          this.links = res.data;
          this.cd.detectChanges();
        }
      },
    });
  }

  ngOnInit(): void {
    this.loadLinks();
  }

  // update link

  updateLink(link: LinkResponse) {
    const payload = {
      title: link.title,
      link: link.link,
    };

    this.linkService.updateLink(link._id, payload).subscribe({
      next: (res) => {
        if (!res.data) {
          this.toastr.error('Invalid response from server');
          return;
        }
        this.toastr.success('Link updated successfully');
        this.links = this.links.map((l) => (l._id === res.data!._id ? res.data! : l));
      },
      error: () => {
        this.toastr.error('Update failed');
      },
    });
  }

  //delete link

  deleteBackendLink(link: LinkResponse) {
    this.linkService.deleteLink(link._id).subscribe({
      next: () => {
        this.links = this.links.filter((l) => l._id !== link._id);
        this.cd.detectChanges();
        console.log('After delete:', this.links);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  deleteBlankLink(index: number) {
    this.selectedItems.splice(index, 1);
  }

  togglePopup() {
    this.showPopup = !this.showPopup;
  }
  openCard() {
    this.isCardOpen = true;
  }

  trackByLink(index: number, item: LinkResponse) {
    return item._id;
  }

  openLinkInTab(link: string | undefined) {
    if (!link) return;

    if (link) {
      window.open(link, '_blank');
    }
  }
}
