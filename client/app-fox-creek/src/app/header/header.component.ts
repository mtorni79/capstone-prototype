import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'fc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  currentUser!: User;
  displayDialog!: boolean;
  dialogContent!: string;

  constructor(private userService: UserService) {}

  ngOnInit(): void {

  }

  showDialog(): void {
    this.currentUser = this.userService.getUser();
    if(this.currentUser.isRegistered) {
      this.dialogContent = `Welcome ${this.currentUser.name} admin status ${this.currentUser.isAdmin}`;
    } else{
      this.dialogContent = `Welcome public!`;
    }
    this.displayDialog = true;
  }
}
