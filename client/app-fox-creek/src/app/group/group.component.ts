import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Group } from '../models/group';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'fc-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
})
export class GroupComponent implements OnInit, OnDestroy {
  logo: string = './assets/images/logo.jpg';
  logoAlt: string = 'Fox Creek Logo';

  eventId!: string;
  eventName!: string;
  groups!: Array<Group>;
  group!: Group;

  showForm: boolean = false;

  groupSubscription!: Subscription;
  errorMessage!: string;

  constructor(
    private router: Router,
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
          this.eventName = this.groups[0].OrganizationName;
        },
      });
  }

  showDetails(groupId: number): void {
    this.group = this.groups.find(
      (element) => element.GroupId == groupId
    ) as Group;

    this.showForm = true;
  }

  backToEvents(): void {
    this.router.navigate([''], {
      relativeTo: this.route,
    });
  }

  backToGroups(): void {
    this.showForm = false;
  }

  ngOnDestroy(): void {
    this.groupSubscription.unsubscribe();
  }
}
