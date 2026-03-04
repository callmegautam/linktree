import { ProfileService } from '@/app/core/services/profile-service';
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
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, RouterOutlet, CommonModule, IconsModule],
  templateUrl: './dashboard.html',
})
export class dashboardLayout {
  pageName = '';
  showRightSidebar = false;
  avatarUrl: string = '';
  name: string = '';
  username: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authStore: AuthStore,
    private profileService: ProfileService,
    private cd: ChangeDetectorRef,
  ) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      let currentRoute = this.route;

      while (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;
      }

      this.pageName = currentRoute.snapshot.data?.['name'] || '';
      this.showRightSidebar = currentRoute.snapshot.data?.['rightSidebar'] || false;
    });
  }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe((res) => {
      console.log('res', res);
      if (res && res.data) {
        this.name = res.data.display_name ?? 'checkin';
        this.username = res.data.username ?? '';
        if (res.data.avatar_url) {
          this.avatarUrl = `${environment.backend}${res?.data?.avatar_url}`;
        } else {
          this.avatarUrl = res.data.avatar_url ?? '';
        }

        console.log('Hello: ', this.avatarUrl);
      }
    });
    this.cd.detectChanges();
  }

  logout() {
    this.authStore.clear();
    this.router.navigate(['/login']);
  }
}
