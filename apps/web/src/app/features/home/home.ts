import { HomeService } from '@/app/core/services/home-service';
import { ProfileService } from '@/app/core/services/profile-service';
import { IconsModule } from '@/app/shared/components/icons';
import { AuthStore } from '@/app/store/auth';
import { environment } from '@/environment/environment';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule, IconsModule],
  templateUrl: './home.html',
})
export class Home {
  name: string = '';
  username: string = '';
  avatarUrl: string = '';

  links: any[] = [];

  theme: any;
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

  constructor(
    private authStore: AuthStore,
    private profileService: ProfileService,
    private cd: ChangeDetectorRef,
    private homeService: HomeService,
    private router: Router,
  ) {}

  // After fetching links, map each link to its icon

  ngOnInit(): void {
    const path = this.router.url;
    // console.log(path.slice(1));

    this.homeService.getHomePage(path.slice(1)).subscribe((res) => {
      // console.log('res', res);
      if (res && res.data) {
        // PROFILE

        this.name = res.data.profile.display_name ?? '';
        this.username = res.data.user.username ?? '';
        if (res.data.profile.avatar_url) {
          this.avatarUrl = `${environment.backend}${res?.data?.profile?.avatar_url}`;
        } else {
          this.avatarUrl = res.data.profile.avatar_url ?? '';
        }

        // LINKS

        this.links = res.data.links;
        this.links = res.data.links.map((link) => {
          const iconItem = this.socialItems.find(
            (item) => item.platform === link.platform.toLowerCase(),
          );
          return {
            ...link,
            icon: iconItem ? iconItem.icon : '', // add icon path
          };
        });

        // THEME

        this.theme = res.data.theme;
        // console.log(this.theme);

        // console.log('data: ', {
        //   name: this.name,
        //   username: this.username,
        //   avatarUrl: this.avatarUrl,
        //   links: this.links,
        //   theme: this.theme,
        // });

        this.cd.detectChanges();
      }
    });

    this.homeService.incrementHomePageClicks(path.slice(1)).subscribe((res) => {
      if (res && res.data) {
        console.log(res.data);
      }
    });
  }

  incrementLinkClicks(linkId: string) {
    this.homeService.incrementLinkClicks(linkId).subscribe((res) => {
      if (res && res.data) {
        console.log(res.data);
      }
    });
  }
}
