import { IconsModule } from '@/app/shared/components/icons';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationToastService } from '@/app/core/services/validation-toast';
import { ErrorHandlerService } from '@/app/core/services/error-handler';
import { AdminAuthService } from '@/app/core/services/admin-auth.service';
import type { AdminLogin as AdminLoginBody } from '@linktree/validation';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconsModule],
  templateUrl: './login.html',
})
export class AdminLogin {
  submitted: boolean = false;

  constructor(
    private adminAuthService: AdminAuthService,
    private toastr: ToastrService,
    private validator: ValidationToastService,
    private errorHandleService: ErrorHandlerService,
    private router: Router,
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  handleLogin() {
    this.submitted = true;
    if (!this.validator.validateLogin(this.loginForm)) return;

    const data = this.loginForm.getRawValue() as AdminLoginBody;

    this.adminAuthService.login(data).subscribe({
      next: () => {
        this.toastr.success('Admin login successful');
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        const errorMessage = this.errorHandleService.handleStatus(err.status);
        this.toastr.error(errorMessage);
      },
    });
  }
}
