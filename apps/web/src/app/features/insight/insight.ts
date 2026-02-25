import { IconsModule } from '@/app/shared/components/icons';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-insight',
  imports: [CommonModule, IconsModule],
  templateUrl: './insight.html',
})
export class Insight {
  stats = [
    {
      icon: 'eye',
      value: 1,
      label: 'Views',
    },
    {
      icon: 'mouse-pointer-click',
      value: 0,
      label: 'Clicks',
    },
    {
      icon: 'percent',
      value: '0%',
      label: 'Click rate',
    },
  ];
}
