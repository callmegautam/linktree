import { AuthStore } from '@/app/store/auth';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-username',
  imports: [ReactiveFormsModule],
  templateUrl: './username.html',
})
export class Username {
  constructor(
    private authStore: AuthStore,
    private router: Router,
  ) {}

  usernameForm = new FormGroup({
    username: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    const user = this.authStore.snapshot;

    if (user?.username) {
      this.usernameForm.patchValue({
        username: user.username,
      });
    }
  }

  handleUsername() {
    if (this.usernameForm.invalid) return;

    const username = this.usernameForm.value.username;
    console.log(username);

    this.router.navigate(['/dashboard']);
  }
}
