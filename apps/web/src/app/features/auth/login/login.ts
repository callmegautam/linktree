import { ValidationToastService } from '@/app/core/services/validation-toast';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormControlName,
  Validators,
  MaxValidator,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
})
export class Login {
  constructor(
    private toastr: ToastrService,
    private validator: ValidationToastService,
  ) {}
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
  });

  handleLogin() {
    if (!this.validator.validateLogin(this.loginForm)) return;

    this.toastr.success('Login successful!');
  }
}
