import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private toast: ToastrService) {}

  handleStatus(status: number): string {
    let message: string;

    switch (status) {
      case 400:
        message = 'Something went wrong';
        break;

      case 401:
        message = 'Invalid credentials';
        break;

      case 403:
        message = 'Account blocked/suspended';
        break;

      case 404:
        message = 'Not Found';
        break;

      case 409:
        message = 'Already Exists';
        break;

      case 422:
        message = 'Validation error';
        break;

      case 500:
        message = 'Internal server error';
        break;

      default:
        message = 'Unexpected error';
    }

    this.toast.error(message);

    return message;
  }
}
