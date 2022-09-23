import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  @ViewChild('searchInput') searchInput!: ElementRef;

  logo: string = './assets/images/logo.jpg';
  logoAlt: string = 'Fox Creek Logo';

  groupForm!: FormGroup;

  eventId!: string;
  eventName!: string; //TODO: get from service
  groups!: Array<Group>;
  allGroups!: Array<Group>;
  group!: Group;

  showDetails: boolean = false;
  isEditMode: boolean = false;
  isAddMode: boolean = false;

  subscription!: Subscription;
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
    this.subscription = this.groupService
      .getGroupsByEventId(eventId)
      .subscribe({
        next: (res: any) => {
          this.groups = res;
          this.allGroups = res;
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
    this.groups = this.allGroups;
  }

  createEditForm() {
    this.groupForm = this.fb.group({
      GroupName: [this.group.GroupName, [Validators.required]],
      SponsorName: [this.group.SponsorName, [Validators.required]],
      SponsorPhone: [
        this.group.SponsorPhone,
        [
          Validators.required,
          //Validators.pattern('^[0-9]'),
          Validators.minLength(12),
          Validators.maxLength(12),
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
      SponsorName: [this.group.SponsorName, [Validators.required]],
      SponsorPhone: [
        this.group.SponsorPhone,
        [
          Validators.required,
          //Validators.pattern('^[0-9]'),
          Validators.minLength(12),
          Validators.maxLength(12),
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
    alert(this.group.SponsorPhone.length);
    this.group.GroupName = this.groupForm.value.GroupName;
    this.group.SponsorName = this.groupForm.value.SponsorName;
    this.group.SponsorPhone = this.groupForm.value.SponsorPhone;
    this.group.SponsorEmail = this.groupForm.value.SponsorEmail;
    this.group.MaxGroupSize = this.groupForm.value.MaxGroupSize;

    this.subscription = this.groupService.updateGroup(this.group).subscribe({
      next: (res: any) => {
        console.log(this.groups);
      },
      error: (err) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err.message));
      },
      complete: () => {
        console.log(`called updateGroup()`);
        this.setGroups(this.eventId);
        alert('saved');
      },
    });
  }

  saveAddForm() {
    this.group.GroupName = this.groupForm.value.GroupName;
    this.group.OrganizationName = this.eventName;
    this.group.SponsorName = this.groupForm.value.SponsorName;
    this.group.SponsorPhone = this.groupForm.value.SponsorPhone;
    this.group.SponsorEmail = this.groupForm.value.SponsorEmail;
    this.group.MaxGroupSize = this.groupForm.value.MaxGroupSize;

    this.subscription = this.groupService.addGroup(this.group).subscribe({
      next: (res: any) => {
        console.log(this.groups);
      },
      error: (err) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err.message));
      },
      complete: () => {
        console.log(`called addGroup()`);
        this.setGroups(this.eventId);
        alert('added');
      },
    });
  }

  deleteGroup(groupId: number): void {
    this.subscription = this.groupService.deleteGroup(groupId).subscribe({
      next: (res: any) => {
        console.log(this.groups);
      },
      error: (err) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err.message));
      },
      complete: () => {
        console.log(`called deleteGroup()`);
        this.setGroups(this.eventId);
        alert('delete');
      },
    });
  }

  search() {
    const searchValue = this.searchInput.nativeElement.value;
    this.groups = this.groups.filter((element) => {
      return element.GroupName.includes(searchValue);
    });
  }

  viewAll() {
    this.groups = this.allGroups;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
