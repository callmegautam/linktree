import { AuthService } from '@/app/core/services/auth';
import { ProfileService } from '@/app/core/services/profile-service';
import { AuthStore } from '@/app/store/auth';
import { environment } from '@/environment/environment';
import { CommonModule } from '@angular/common';
// import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UpdateProfileBody } from '@linktree/validation';
// import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-account',
  imports: [FormsModule, CommonModule],
  templateUrl: './account.html',
})
export class Account implements OnInit {
  // userName$!: Observable<string>;
  // Name$!: Observable<string>;
  avatarUrl: string = '';
  name: string = '';
  username: string = '';
  bio: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private authStore: AuthStore,
    private profileService: ProfileService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe((res) => {
      console.log('res', res);
      if (res && res.data) {
        this.name = res.data.display_name ?? 'checkin';
        this.username = res.data.username ?? '';
        this.bio = res.data.bio ?? 'This is your default bio';
        if (res.data.avatar_url) {
          this.avatarUrl = `${environment.backend}${res?.data?.avatar_url}`;
        } else {
          this.avatarUrl = res.data.avatar_url ?? '';
        }

        console.log('NG On Init: ', this.avatarUrl);
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

  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.selectedFile = file;

  //     const reader = new FileReader();
  //     reader.onload = (e) => (this.avatarUrl = reader.result as string);
  //     reader.readAsDataURL(file);

  //     this.uploadFile(file);
  //   }
  // }

  // async uploadFile(file: File) {
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   try {
  //     const res: any = await this.profileService.uploadAvatar(formData).toPromise();
  //     this.avatarUrl = res.data.url;
  //   } catch (err) {
  //     console.error('Failed to upload avatar:', err);
  //   }
  // }

  saveProfile() {
    const payload: UpdateProfileBody = {
      display_name: this.name,
      username: this.username,
      bio: this.bio ?? '',
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
  showDeletePopup = false;

  openDeletePopup() {
    this.showDeletePopup = true;
  }

  closeDeletePopup() {
    this.showDeletePopup = false;
  }

  deleteAccount() {
    this.authService.deleteUser().subscribe({
      next: () => {
        this.closeDeletePopup();
        this.router.navigate(['/login']);
      },
    });
  }
}
