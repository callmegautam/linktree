import { IconsModule } from '@/app/shared/components/icons';
import { AuthStore } from '@/app/store/auth';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { filter, map, Observable } from 'rxjs';

type PageType = 'main' | 'header' | 'wallpaper' | 'buttons' | 'text' | 'colors';
@Component({
  selector: 'app-design',
  imports: [CommonModule, IconsModule],
  templateUrl: './design.html',
})
export class Design {
  currentPage: PageType = 'main';
  userEmail$!: Observable<string>;

  constructor(private authStore: AuthStore) {
    this.userEmail$ = this.authStore.user$.pipe(
      filter((user): user is any => !!user),
      map((user) => user.email),
    );
  }

  selectedStyle: string = 'fill';
  backgroundColor: string = '#ECEEF1';

  styles = [
    { id: 'fill', label: 'Fill' },
    { id: 'gradient', label: 'Gradient' },
    { id: 'blur', label: 'Blur' },
    { id: 'pattern', label: 'Pattern' },
    { id: 'image', label: 'Image' },
    { id: 'video', label: 'Video' },
  ];

  selectStyle(id: string) {
    this.selectedStyle = id;
  }

  openPage(page: PageType) {
    this.currentPage = page;
  }

  goBack() {
    this.currentPage = 'main';
  }
}
