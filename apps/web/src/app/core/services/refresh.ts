import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RefreshService {
  // BehaviorSubject holds current state; you can emit anything (boolean, object, etc.)
  private refreshSubject = new BehaviorSubject<boolean>(false);
  refresh$ = this.refreshSubject.asObservable();

  triggerRefresh() {
    this.refreshSubject.next(true);
  }
}
