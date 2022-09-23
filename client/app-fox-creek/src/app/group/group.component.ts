import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  groupForm!: FormGroup;

  eventId!: string;
  eventName!: string;
  groups!: Array<Group>;
  group!: Group;

  showDetails: boolean = false;
  isEditMode: boolean = false;
  isAddMode: boolean = false;

  groupSubscription!: Subscription;
  groupUpdateSubscription!: Subscription;
  groupAddSubscription!: Subscription;
  errorMessage!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private fb: FormBuilder
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

  goToDetails(groupId: number): void {
    this.group = this.groups.find(
      (element) => element.GroupId == groupId
    ) as Group;

    this.showDetails = true;
  }

  goToEditMode(groupId: number): void {
    this.group = this.groups.find(
      (element) => element.GroupId == groupId
    ) as Group;

    this.createEditForm();

    this.showDetails = true;
    this.isEditMode = true;
  }

  goToAddMode(): void {
    this.createAddForm();

    this.showDetails = true;
    this.isAddMode = true;
  }

  backToEvents(): void {
    this.router.navigate([''], {
      relativeTo: this.route,
    });
  }

  backToGroups(): void {
    this.showDetails = false;
    this.isEditMode = false;
    this.isAddMode = false;
  }

  createEditForm() {
    this.groupForm = this.fb.group({
      GroupName: [this.group.GroupName, [Validators.required]],
      OrganizationName: [this.group.OrganizationName, [Validators.required]],
      SponsorName: [this.group.SponsorName, [Validators.required]],
      SponsorPhone: [
        this.group.SponsorPhone,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      SponsorEmail: [
        this.group.SponsorEmail,
        [Validators.required, Validators.email],
      ],
      MaxGroupSize: [
        this.group.MaxGroupSize,
        [Validators.required, Validators.min(1)],
      ],
    });
  }

  createAddForm() {
    this.group = new Group();
    this.groupForm = this.fb.group({
      GroupName: [this.group.GroupName, [Validators.required]],
      OrganizationName: [this.group.OrganizationName, [Validators.required]],
      SponsorName: [this.group.SponsorName, [Validators.required]],
      SponsorPhone: [
        this.group.SponsorPhone,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      SponsorEmail: [
        this.group.SponsorEmail,
        [Validators.required, Validators.email],
      ],
      MaxGroupSize: [
        this.group.MaxGroupSize,
        [Validators.required, Validators.min(1)],
      ],
    });
  }

  saveEditForm() {
    this.group.GroupName = this.groupForm.value.GroupName;
    this.group.OrganizationName = this.groupForm.value.OrganizationName;
    this.group.SponsorName = this.groupForm.value.SponsorName;
    this.group.SponsorPhone = this.groupForm.value.SponsorPhone;
    this.group.SponsorEmail = this.groupForm.value.SponsorEmail;
    this.group.MaxGroupSize = this.groupForm.value.MaxGroupSize;

    this.groupUpdateSubscription = this.groupService
      .updateGroup(this.group)
      .subscribe({
        next: (res: any) => {
          console.log(this.groups);
        },
        error: (err) => {
          this.errorMessage = err;
          console.log((this.errorMessage = err.message));
        },
        complete: () => {
          console.log(`called updateGroupCalled()`);
          this.setGroups(this.eventId);
          alert('saved');
        },
      });
  }

  saveAddForm() {
    this.group.GroupName = this.groupForm.value.GroupName;
    this.group.OrganizationName = this.groupForm.value.OrganizationName;
    this.group.SponsorName = this.groupForm.value.SponsorName;
    this.group.SponsorPhone = this.groupForm.value.SponsorPhone;
    this.group.SponsorEmail = this.groupForm.value.SponsorEmail;
    this.group.MaxGroupSize = this.groupForm.value.MaxGroupSize;

    this.groupUpdateSubscription = this.groupService
      .updateGroup(this.group)
      .subscribe({
        next: (res: any) => {
          console.log(this.groups);
        },
        error: (err) => {
          this.errorMessage = err;
          console.log((this.errorMessage = err.message));
        },
        complete: () => {
          console.log(`called updateGroupCalled()`);
          this.setGroups(this.eventId);
          alert('saved');
        },
      });
  }

  ngOnDestroy(): void {
    if (this.groupSubscription) {
      this.groupSubscription.unsubscribe();
    }
    if (this.groupUpdateSubscription) {
      this.groupUpdateSubscription.unsubscribe();
    }
    if (this.groupAddSubscription) {
      this.groupAddSubscription.unsubscribe();
    }
  }
}
