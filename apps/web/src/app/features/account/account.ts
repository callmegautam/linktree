import { AuthStore } from '@/app/store/auth';
import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-account',
  imports: [AsyncPipe],
  templateUrl: './account.html',
})
export class Account {
  userName$!: Observable<string>;
  Name$!: Observable<string>;
  constructor(private authStore: AuthStore) {
    this.userName$ = this.authStore.user$.pipe(
      filter((user): user is any => !!user),
      map((user) => user.username),
    );
    this.Name$ = this.authStore.user$.pipe(
      filter((user): user is any => !!user),
      map((user) => user.name),
    );
  }
}
