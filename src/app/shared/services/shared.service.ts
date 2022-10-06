import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  errorMsg: BehaviorSubject<any> = new BehaviorSubject(null);
  errorMsg$ = this.errorMsg.asObservable();

  sidebarTriggerBtn: BehaviorSubject<boolean> = new BehaviorSubject(true);
  sidebarTriggerBtn$ = this.sidebarTriggerBtn.asObservable();

  triggerSidebar() {
    this.sidebarTriggerBtn.next(!this.sidebarTriggerBtn.value);
  }
}
