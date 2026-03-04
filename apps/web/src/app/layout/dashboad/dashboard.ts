import { ProfileService } from '@/app/core/services/profile-service';
import { IconsModule } from '@/app/shared/components/icons';
import { AuthStore } from '@/app/store/auth';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  userName$!: Observable<string>;
  showSave$!: Observable<boolean>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authStore: AuthStore,
    private profileService: ProfileService,
  ) {
    this.userName$ = this.authStore.user$.pipe(
      filter((user): user is any => !!user),
      map((user) => user.username),
    );

    console.log('username', this.userName$);
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      let currentRoute = this.route;

      while (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;
      }

      this.pageName = currentRoute.snapshot.data?.['name'] || '';
      this.showRightSidebar = currentRoute.snapshot.data?.['rightSidebar'] || false;
    });
  }

  ngOnInit() {
    // this.profileService.getProfile();
    // call here 
  }

  logout() {
    this.authStore.clear();
    this.router.navigate(['/login']);
  }
}
