import { ProfileService } from '@/app/core/services/profile-service';
import { IconsModule } from '@/app/shared/components/icons';
import { AuthStore } from '@/app/store/auth';
import { environment } from '@/environment/environment';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpdateProfileBody } from '@linktree/validation';
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
  avatarUrl: string = '';
  name: string = '';
  selectedFile: File | null = null;

  constructor(
    private authStore: AuthStore,
    private profileService: ProfileService,
    private cd: ChangeDetectorRef,
  ) {}

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

  ngOnInit(): void {
    this.profileService.getProfile().subscribe((res) => {
      console.log('res', res);
      if (res && res.data) {
        this.name = res.data.display_name ?? 'checkin';

        if (res.data.avatar_url) {
          this.avatarUrl = `${environment.backend}${res?.data?.avatar_url}`;
        } else {
          this.avatarUrl = res.data.avatar_url ?? '';
        }

        console.log('Hello: ', this.avatarUrl);
        this.cd.detectChanges();
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarUrl = reader.result as string;
      this.cd.detectChanges();
    };
    reader.readAsDataURL(file);

    this.uploadFile(file);
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    this.profileService.uploadAvatar(formData).subscribe({
      next: (res: any) => {
        this.avatarUrl = `${environment.backend}${res?.data?.path}`; // returned from backend
        console.log('Image: ', { image: this.avatarUrl });
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Upload failed', err);
      },
    });
  }

  saveProfile() {
    const payload: UpdateProfileBody = {
      display_name: this.name,

      avatar_url: this.avatarUrl.includes(environment.backend)
        ? this.avatarUrl.replace(environment.backend, '')
        : (this.avatarUrl ?? ''), // Send the relative URL
    };

    console.log('payload', payload);

    this.profileService.UpdateProfile(payload).subscribe({
      next: (res) => {
        console.log('Profile updated:', res.data);
        this.cd.detectChanges();
      },
      error: (err) => console.error('Update failed:', err),
    });
  }
}
