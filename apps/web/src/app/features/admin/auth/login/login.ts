import { IconsModule } from '@/app/shared/components/icons';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconsModule],
  templateUrl: './login.html',
})
export class AdminLogin {
  submitted: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  handleLogin() {
    this.submitted = true;
    if (this.loginForm.invalid) return;
    // Add your login logic here when ready
  }
}
