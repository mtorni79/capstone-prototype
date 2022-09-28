import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Group } from '../models/group.model';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'fc-sponsor',
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.css']
})
export class SponsorComponent implements OnInit {
  groups!: Array<Group>;

  subscription!: Subscription;
  errorMessage!: string;
  isLoading: boolean = false;

  constructor(private groupService: GroupService) { }

  ngOnInit(): void {
    this.subscription = this.groupService.getAllGroups().subscribe({
      next: (res: any) => {
        this.groups = res;
      },
      error: (err) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err.message));
      },
      complete: () => {
        console.log(`called getAllGroups()`);
        this.isLoading = false;
      },
    });
  }

}
