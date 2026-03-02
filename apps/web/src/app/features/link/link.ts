import { UiStateService } from '@/app/core/services/ui-state-service';
import { IconsModule } from '@/app/shared/components/icons';
import { AuthStore } from '@/app/store/auth';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-link',
  imports: [CommonModule, IconsModule, FormsModule],
  templateUrl: './link.html',
})
export class Link {
  UserName$!: Observable<string>;
  showPopup = false;
  selectedItems: any[] = [];
  isCardOpen = false;

  constructor(
    private authStore: AuthStore,
    private uiStatervice: UiStateService,
  ) {
    this.UserName$ = this.authStore.user$.pipe(
      filter((user): user is any => !!user),
      map((user) => user.username),
    );
  }

  socialItems = [
    { name: 'Instagram', icon: 'images/insta.png' },
    { name: 'Facebook', icon: 'images/facebook.png' },
    { name: 'YouTube', icon: 'images/youtube.png' },
    { name: 'Spotify', icon: 'images/spotify.png' },
    { name: 'Slack', icon: 'images/slack.png' },
    { name: 'X', icon: 'images/x.png' },
    { name: 'Snapchat', icon: 'images/snapchat.png' },
    { name: 'Github', icon: 'images/github.png' },
    { name: 'Linkedin', icon: 'images/linkedin.png' },
    { name: 'Discord', icon: 'images/discord.png' },
    { name: 'Telegram', icon: 'images/telegram.png' },
    { name: 'Substack', icon: 'images/substack.png' },
    { name: 'Pinterest', icon: 'images/pinterest.png' },
    { name: 'Twitch', icon: 'images/twitch.png' },
    { name: 'Whatsapp', icon: 'images/whatsapp.png' },
    { name: 'Threads', icon: 'images/threads.png' },
    { name: 'Reddit', icon: 'images/reddit.png' },
    { name: 'Mail', icon: 'images/mail.png' },
    { name: 'AppleMusic', icon: 'images/applemusic.png' },
  ];

  selectSocial(item: any) {
    this.selectedItems.push({
      ...item,
      title: '',
      url: '',
      enabled: true,
    });
    this.uiStatervice.setSaveState(this.selectedItems.length > 0);
    this.togglePopup();
  }

  deleteLink(index: number) {
    this.selectedItems.splice(index, 1);

    this.uiStatervice.setSaveState(this.selectedItems.length > 0);
  }

  ngOnDestroy() {
    this.uiStatervice.setSaveState(false);
  }

  togglePopup() {
    this.showPopup = !this.showPopup;
  }
  openCard() {
    this.isCardOpen = true;
  }

  openUrlInTab(url: string | undefined) {
    if (!url) return;

    if (url) {
      window.open(url, '_blank');
    }
  }
}
