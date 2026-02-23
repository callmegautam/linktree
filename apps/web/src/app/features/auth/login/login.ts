import { AuthService } from '@/app/core/services/auth';
import { ErrorHandlerService } from '@/app/core/services/error-handler';
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
import { Router, RouterLink } from '@angular/router';
import { LoginBody } from '@linktree/validation';
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
    private authService: AuthService,
    private errorHandleService: ErrorHandlerService,
    private router: Router,
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

    const data = this.loginForm.getRawValue() as LoginBody;

    this.authService.login(data).subscribe({
      next: (res) => {
        this.toastr.success('Successful Login!!!');

        this.router.navigate(['/']);
      },
      error: (err) => {
        const errorMessage = this.errorHandleService.handleStatus(err.status);
        this.toastr.error(errorMessage);
      },
    });
  }
}
