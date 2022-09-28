import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'fc-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  username!: string;
  password!: string;
  errorMessage!: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}
  user!: User;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    this.username = this.registerForm.value.username;
    this.password = this.registerForm.value.password;

    if (this.username === 'admin' && this.password === '123') {
      this.user = new User();
      this.user.name = 'Michael Torni';
      this.user.isAdmin = true;
      this.user.isRegistered = true;
      UserService.storeUserLocal(this.user);
      this.router.navigate(['']);
    } else if (this.username === 'user' && this.password === '123') {
      this.user = new User();
      this.user.name = 'Dan Reynolds';
      this.user.isAdmin = false;
      this.user.isRegistered = true;
      UserService.storeUserLocal(this.user);
      this.router.navigate(['']);
    } else {
      this.errorMessage = 'Username or password is incorrect';
    }
  }

  isInputError(field: string): boolean {
    return (
      !this.registerForm.controls[field].valid &&
      this.registerForm.controls[field].touched
    );
  }
}
