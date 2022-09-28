import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterGuardService implements CanActivate {
  currentUser!: User;

  constructor(private userService: UserService, public router: Router) {}

  canActivate(): boolean {
    this.currentUser = this.userService.getUser();
    console.log(this.currentUser);
    if (this.currentUser.isRegistered === false) {
      this.router.navigate(['register']);
      alert(
        `You are not a registered user! You will be redirected to the register page.`
      );
      return false;
    }
    return true;
  }
}
