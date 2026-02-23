import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormControlName,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ValidationToastService } from '@/app/core/services/validation-toast';
import { AuthService } from '@/app/core/services/auth';
import { RegisterBody } from '@linktree/validation';
import { ErrorHandlerService } from '@/app/core/services/error-handler';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
})
export class Register {
  constructor(
    private toastr: ToastrService,
    private validator: ValidationToastService,
    private router: Router,
    private authService: AuthService,
    private errorHandleService: ErrorHandlerService,
  ) {}
  registerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
  });

  handleRegister() {
    if (!this.validator.validateRegister(this.registerForm)) return;
    const data = this.registerForm.getRawValue() as RegisterBody;
    console.log(data);
    this.authService.register(data).subscribe({
      next: (res) => {
        console.log(res);
        this.toastr.success('Successful Login!!!');

        this.router.navigate(['username']);
      },
      error: (err) => {
        const errorMessage = this.errorHandleService.handleStatus(err.status);
        this.toastr.error(errorMessage);
        console.log(err.error);
      },
    });
  }
}
