import { HomeService } from '@/app/core/services/home-service';
import { ProfileService } from '@/app/core/services/profile-service';
import { AuthStore } from '@/app/store/auth';
import { environment } from '@/environment/environment';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
})
export class Home {
  name: string = '';
  username: string = '';
  avatarUrl: string = '';

  links: any[] = [];

  theme: any;

  constructor(
    private authStore: AuthStore,
    private profileService: ProfileService,
    private cd: ChangeDetectorRef,
    private homeService: HomeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const path = this.router.url;
    console.log(path.slice(1));

    this.homeService.getHomePage(path.slice(1)).subscribe((res) => {
      console.log('res', res);
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

        // THEME

        this.theme = res.data.theme;

        console.log('data: ', {
          name: this.name,
          username: this.username,
          avatarUrl: this.avatarUrl,
          links: this.links,
          theme: this.theme,
        });
        this.cd.detectChanges();
      }
    });
  }
}
