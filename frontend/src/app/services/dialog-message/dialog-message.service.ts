import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DialogMessageService {
  private messageSource = new Subject<{ message: string; isError: boolean }>();
  message$ = this.messageSource.asObservable();

  sendMessage(msg: { message: string; isError: boolean }) {
    this.messageSource.next(msg);
  }
}