import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: User;


  constructor() {
    this.user = new User();
    this.user.isAdmin = false;
   }

   getUser(): User {
    if (localStorage.getItem('currentUser')) {
      this.user = JSON.parse(localStorage.getItem('currentUser')!);
      return this.user;
    } else {
      return this.user;
    }
  }


  static storeUserLocal(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

}
