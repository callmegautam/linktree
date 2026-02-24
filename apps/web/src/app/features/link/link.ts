import { IconsModule } from '@/app/shared/components/icons';
import { AuthStore } from '@/app/store/auth';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-link',
  imports: [CommonModule, IconsModule],
  templateUrl: './link.html',
})
export class Link {
  userEmail$!: Observable<string>;
  showPopup = false;

  constructor(private authStore: AuthStore) {
    this.userEmail$ = this.authStore.user$.pipe(
      filter((user): user is any => !!user),
      map((user) => user.email),
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

  togglePopup() {
    this.showPopup = !this.showPopup;
  }
}
