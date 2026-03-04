import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Navigation } from 'lucide-angular';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admindashboard',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './admindashboard.html',
})
export class admindashboardLayout {
  adminpage = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      let currentRoute = this.route;

      while (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;
      }

      this.adminpage = currentRoute.snapshot.data?.['name'] || '';
    });
  }
}
