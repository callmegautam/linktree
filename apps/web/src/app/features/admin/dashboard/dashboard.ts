import { AnalyticsService } from '@/app/core/services/admin/analytics-service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AnalyticsResponse } from '@linktree/validation';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  analytics: AnalyticsResponse | null = null;

  constructor(
    private analyticsService: AnalyticsService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.analyticsService.getAnalytics().subscribe((res) => {
      if (res && res.data) {
        this.analytics = res.data;
        console.log(this.analytics);
        this.cd.detectChanges();
      }
    });
  }
}
