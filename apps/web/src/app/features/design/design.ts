import { ProfileService } from '@/app/core/services/profile-service';
import { RefreshService } from '@/app/core/services/refresh';
import { ThemeService } from '@/app/core/services/theme-service';
import { IconsModule } from '@/app/shared/components/icons';
import { AuthStore } from '@/app/store/auth';
import { environment } from '@/environment/environment';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpdateProfileBody, UpdateThemeBody } from '@linktree/validation';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

type PageType = 'main' | 'header' | 'wallpaper' | 'buttons' | 'text' | 'colors';

@Component({
  selector: 'app-design',
  imports: [CommonModule, IconsModule, FormsModule],
  templateUrl: './design.html',
})
export class Design {
  selectedStyle: string = 'fill';
  backgroundColor: string = '#ECEEF1';
  gradientColor1: string = '#8B5CF6';
  gradientColor2: string = '#60A5FA';
  imagePreview: string | ArrayBuffer | null = null;

  buttonStyle: string = 'solid';
  buttonRadius: string = 'rounded';
  buttonColor: string = '#FFFFFF';
  buttonTextColor: string = '#000000';

  pageTextColor = '#000000';
  titleColor = '#000000';

  currentPage: PageType = 'main';

  avatarUrl: string = '';
  name: string = '';
  selectedFile: File | null = null;
  theme: any = null;

  constructor(
    private authStore: AuthStore,
    private profileService: ProfileService,
    private themeService: ThemeService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private refreshService: RefreshService,
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

  fonts = [
    { name: 'Inter', value: 'font-inter' },
    { name: 'Sans', value: 'font-sans' },
    { name: 'Poppins', value: 'font-poppins' },
    { name: 'Roboto', value: 'font-roboto' },
    { name: 'Montserrat', value: 'font-montserrat' },
    { name: 'Lato', value: 'font-lato' },
    { name: 'Link Sans', value: 'font-link-sans' },
    { name: 'Serif', value: 'font-serif' },
    { name: 'Mono', value: 'font-mono' },
  ];

  selectedFont: string = 'font-sans';

  fontMap: Record<string, string> = this.fonts.reduce(
    (acc, f) => ({ ...acc, [f.name]: f.value }),
    {},
  );

  ngOnInit(): void {
    forkJoin({
      profile: this.profileService.getProfile(),
      theme: this.themeService.getTheme(),
    }).subscribe({
      next: ({ profile, theme }) => {
        // profile
        if (profile?.data) {
          this.name = profile.data.display_name ?? 'checkin';

          this.avatarUrl = profile.data.avatar_url
            ? `${environment.backend}${profile.data.avatar_url}`
            : '';
        }

        // theme
        if (theme?.data) {
          this.theme = theme.data;

          const bg = this.theme.background;
          const button = this.theme.button;
          const text = this.theme.text;

          // background
          if (bg?.type === 'solid') {
            this.selectedStyle = 'fill';
            this.backgroundColor = bg.value ?? this.backgroundColor;
          } else if (bg?.type === 'gradient') {
            this.selectedStyle = 'gradient';

            if (bg.value) {
              const colors = bg.value.match(/#[a-fA-F0-9]{6}/g);

              if (colors?.length >= 2) {
                this.gradientColor1 = colors[0];
                this.gradientColor2 = colors[1];
              }
            }
          } else if (bg?.type === 'image') {
            this.selectedStyle = 'image';

            this.imagePreview = bg.value ? `${environment.backend}${bg.value}` : null;
          }

          // button
          if (button) {
            this.buttonStyle = button.variant ?? this.buttonStyle;
            this.buttonRadius = button.radius ?? this.buttonRadius;
            this.buttonColor = button.color ?? this.buttonColor;
            this.buttonTextColor = button.textColor ?? this.buttonTextColor;
          }

          // text
          if (text) {
            this.pageTextColor = text.pageColor ?? this.pageTextColor;
            this.titleColor = text.titleColor ?? this.titleColor;
            this.selectedFont =
              text?.font && this.fontMap[text.font] ? this.fontMap[text.font] : 'font-sans';
          }
        }
        this.refreshService.triggerRefresh();
        this.cd.detectChanges();
      },

      error: (err) => {
        console.error('Failed to load profile/theme', err);
      },
    });
  }

  // avatar
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
        this.avatarUrl = `${environment.backend}${res?.data?.path}`;

        this.cd.detectChanges();
      },

      error: (err) => {
        console.error('Upload failed', err);
      },
    });
  }

  /* ---------------- SAVE PROFILE ---------------- */

  saveProfile() {
    const payload: UpdateProfileBody = {
      display_name: this.name,

      avatar_url: this.avatarUrl.includes(environment.backend)
        ? this.avatarUrl.replace(environment.backend, '')
        : (this.avatarUrl ?? ''),
    };

    this.profileService.UpdateProfile(payload).subscribe({
      next: () => {
        this.toastr.success('Profile updated');
        this.refreshService.triggerRefresh();
      },

      error: (err) => {
        console.error('Profile update failed', err);
      },
    });
  }

  /* ---------------- SAVE THEME ---------------- */

  saveTheme() {
    type BackgroundType = 'solid' | 'gradient' | 'image';

    const bgType: BackgroundType =
      this.selectedStyle === 'fill' ? 'solid' : (this.selectedStyle as BackgroundType);

    const bgValue: string =
      this.selectedStyle === 'fill'
        ? this.backgroundColor
        : this.selectedStyle === 'gradient'
          ? `linear-gradient(to right, ${this.gradientColor1}, ${this.gradientColor2})`
          : (this.imagePreview as string) || '';

    const payload: UpdateThemeBody = {
      background: {
        type: bgType,
        value: bgValue,
      },

      button: {
        variant: this.buttonStyle as 'solid' | 'outline',
        radius: this.buttonRadius as 'square' | 'rounded',
        color: this.buttonColor,
        textColor: this.buttonTextColor,
      },

      text: {
        font: this.fonts.find((f) => f.value === this.selectedFont)?.name ?? 'Sans',
        pageColor: this.pageTextColor,
        titleColor: this.titleColor,
      },
    };

    this.themeService.updateTheme(payload).subscribe({
      next: () => {
        this.toastr.success('Theme updated successfully!');
        this.refreshService.triggerRefresh();
      },

      error: (err) => {
        console.error('Theme update failed', err);
        this.toastr.error('Theme update failed');
      },
    });
  }
}
