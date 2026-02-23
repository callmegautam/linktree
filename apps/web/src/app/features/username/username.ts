import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-username',
  imports: [ReactiveFormsModule],
  templateUrl: './username.html',
})
export class Username {
  usernameForm = new FormGroup({
    username: new FormControl(''),
  });

  handleUsername() {}
}
