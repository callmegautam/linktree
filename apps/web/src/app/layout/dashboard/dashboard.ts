import { HomeService } from '@/app/core/services/home-service';
import { ProfileService } from '@/app/core/services/profile-service';
import { RefreshService } from '@/app/core/services/refresh';
import { IconsModule } from '@/app/shared/components/icons';
import { AuthStore } from '@/app/store/auth';
import { environment } from '@/environment/environment';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Route,
  Router,
  RouterLink,
  RouterOutlet,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { filter, map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, RouterOutlet, CommonModule, IconsModule, RouterModule],
  templateUrl: './dashboard.html',
})
export class dashboardLayout {
  pageName = '';
  showRightSidebar = false;
  avatarUrl: string = '';
  name: string = '';
  username: string = '';
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
    private router: Router,
    private route: ActivatedRoute,
    private authStore: AuthStore,
    private profileService: ProfileService,
    private homeService: HomeService,
    private cd: ChangeDetectorRef,
    private refreshService: RefreshService,
  ) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      let currentRoute = this.route;

      while (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;
      }

      this.showRightSidebar = currentRoute.snapshot.data?.['rightSidebar'] || false;
    });
  }

  loadData() {
    this.profileService.getProfile().subscribe((res) => {
      console.log('res', res);

      if (res && res.data) {
        this.name = res.data.display_name ?? 'checkin';
        this.username = res.data.username ?? '';

        if (res.data.avatar_url) {
          this.avatarUrl = `${environment.backend}${res.data.avatar_url}`;
        } else {
          this.avatarUrl = '';
        }

        this.homeService.getHomePage(this.username).subscribe((homeRes) => {
          if (homeRes && homeRes.data) {
            this.name = homeRes.data.profile.display_name ?? this.name;
            this.username = homeRes.data.user.username ?? this.username;

            if (homeRes.data.profile.avatar_url) {
              this.avatarUrl = `${environment.backend}${homeRes.data.profile.avatar_url}`;
            }

            this.links = homeRes.data.links.map((link: any) => {
              const iconItem = this.socialItems.find(
                (item) => item.platform === link.platform.toLowerCase(),
              );

              return {
                ...link,
                icon: iconItem ? iconItem.icon : '',
              };
            });

            this.theme = homeRes.data.theme;
          }
          console.log('THEME: ', this.theme);
          this.cd.detectChanges();
        });
      }
    });
  }

  ngOnInit(): void {
    this.refreshService.refresh$.subscribe(() => {
      // Put your re-render logic here
      // For example, reload data or trigger change detection
      this.loadData();
    });
  }

  openLinkInTab(link: string | undefined) {
    if (!link) return;

    if (link) {
      window.open(link, '_blank');
    }
  }

  logout() {
    this.authStore.clear();
    this.router.navigate(['/login']);
  }
}
