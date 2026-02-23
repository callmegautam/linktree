import { AuthStore } from '@/app/store/auth';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-username',
  imports: [ReactiveFormsModule],
  templateUrl: './username.html',
})
export class Username {
  constructor(private authStore: AuthStore) {}

  usernameForm = new FormGroup({
    username: new FormControl(''),
  });

  ngOnInit(): void {
    const user = this.authStore.snapshot;

    if (user?.username) {
      this.usernameForm.patchValue({
        username: user.username,
      });
    }
  }

  handleUsername() {}
}
