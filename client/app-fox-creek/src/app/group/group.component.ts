import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'fc-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
})
export class GroupComponent implements OnInit {
  eventId!: string;
  groups!: any;

  groupSubscription!: Subscription;
  errorMessage!: string;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.eventId = params['eventId'];
      this.setGroups(this.eventId);
    });
  }

  setGroups(eventId: string): void {
    this.groupSubscription = this.groupService
      .getGroupsByEventId(eventId)
      .subscribe({
        next: (res: any) => {
          this.groups = res;
          console.log(this.groups);
        },
        error: (err) => {
          this.errorMessage = err;
          console.log((this.errorMessage = err.message));
        },
        complete: () => {
          console.log(`called getGroupsByEventId()`);
        },
      });
  }

  ngOnDestroy(): void {
    this.groupSubscription.unsubscribe();
  }
}
