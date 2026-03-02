import { UiStateService } from '@/app/core/services/ui-state-service';
import { IconsModule } from '@/app/shared/components/icons';
import { AuthStore } from '@/app/store/auth';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { filter, map, Observable } from 'rxjs';

type PageType = 'main' | 'header' | 'wallpaper' | 'buttons' | 'text' | 'colors';
@Component({
  selector: 'app-design',
  imports: [CommonModule, IconsModule, FormsModule],
  templateUrl: './design.html',
})
export class Design {
  selectedStyle: string = 'fill';
  backgroundColor: string = '#ECEEF1';
  currentPage: PageType = 'main';
  Name$!: Observable<string>;
  gradientColor1: string = '#8B5CF6';
  gradientColor2: string = '#60A5FA';
  buttonStyle: string = 'solid';
  buttonRadius: string = 'rounder';
  buttonShadow: string = 'none';
  buttonColor: string = '#FFFFFF';
  buttonTextColor: string = '#000000';
  imagePreview: string | ArrayBuffer | null = null;
  pageTextColor = '#000000';
  titleColor = '#000000';

  constructor(
    private authStore: AuthStore,
    private uiStateService: UiStateService,
  ) {
    this.Name$ = this.authStore.user$.pipe(
      filter((user): user is any => !!user),
      map((user) => user.name),
    );
  }

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
    this.uiStateService.setSaveState(true);
  }

  goBack() {
    this.currentPage = 'main';
    this.uiStateService.setSaveState(false);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(file);
  }
}
