import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ValidationToastService {
  constructor(private toastr: ToastrService) {}

  // Login validation
  validateLogin(form: FormGroup): boolean {
    const email = form.get('email');
    const password = form.get('password');

    if (email?.invalid) {
      if (email.errors?.['required']) {
        this.toastr.error('Email is required');
        return false;
      }
      if (email.errors?.['email']) {
        this.toastr.error('Please enter a valid email');
        return false;
      }
    }

    if (password?.invalid) {
      if (password.errors?.['required']) {
        this.toastr.error('Password is required');
        return false;
      }
      if (password.errors?.['minlength']) {
        this.toastr.error('Password must be at least 3 characters');
        return false;
      }
      if (password.errors?.['maxlength']) {
        this.toastr.error('Password cannot exceed 20 characters');
        return false;
      }
    }

    return true;
  }

  // Register validation
  validateRegister(form: FormGroup): boolean {
    const email = form.get('email');
    const username = form.get('username');
    const name = form.get('name');
    const password = form.get('password');

    if (email?.invalid) {
      if (email.errors?.['required']) {
        this.toastr.error('Email is required');
        return false;
      }
      if (email.errors?.['email']) {
        this.toastr.error('Invalid email format');
        return false;
      }
      if (email.errors?.['maxlength']) {
        this.toastr.error('Email must not exceed 120 characters');
        return false;
      }
    }

    if (username?.invalid) {
      if (username.errors?.['required']) {
        this.toastr.error('Username is required');
        return false;
      }
      if (username.errors?.['minlength']) {
        this.toastr.error('Username must be at least 3 characters');
        return false;
      }
      if (username.errors?.['maxlength']) {
        this.toastr.error('Username must not exceed 30 characters');
        return false;
      }
      if (username.errors?.['pattern']) {
        this.toastr.error(
          'Username can only contain lowercase letters, numbers, underscores and dots',
        );
        return false;
      }
    }

    if (name?.invalid) {
      if (name.errors?.['required']) {
        this.toastr.error('Name is required');
        return false;
      }
      if (name.errors?.['minlength']) {
        this.toastr.error('Name must contain at least 1 character');
        return false;
      }
      if (name.errors?.['maxlength']) {
        this.toastr.error('Name cannot exceed 50 characters');
        return false;
      }
    }

    if (password?.invalid) {
      if (password.errors?.['required']) {
        this.toastr.error('Password is required');
        return false;
      }
      if (password.errors?.['minlength']) {
        this.toastr.error('Password must be at least 8 characters');
        return false;
      }
      if (password.errors?.['pattern']) {
        this.toastr.error(
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        );
        return false;
      }
    }

    return true;
  }
}
