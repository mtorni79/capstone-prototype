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
import { ConfirmationService, MessageService } from 'primeng/api';

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
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.eventId = params['eventId'];
      this.eventName = params['eventName'];
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
    this.setGroups(this.eventId);
  }

  goToGolfers(groupId: number): void {
    this.router.navigate(['../golfers'], {
      relativeTo: this.route,
      queryParams: { groupId: `${groupId}`, eventId: `${this.eventId}` },
    });
  }

  createEditForm() {
    this.groupForm = this.fb.group({
      GroupName: [this.group.GroupName, [Validators.required]],
      SponsorName: [this.group.SponsorName, [Validators.required]],
      SponsorPhone: [
        this.group.SponsorPhone,
        [
          Validators.required,
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
    this.group.GroupName = this.groupForm.value.GroupName;
    this.group.SponsorName = this.groupForm.value.SponsorName;
    this.group.SponsorPhone = this.groupForm.value.SponsorPhone;
    this.group.SponsorEmail = this.groupForm.value.SponsorEmail;
    this.group.MaxGroupSize = this.groupForm.value.MaxGroupSize;

    this.subscription = this.groupService.updateGroup(this.group).subscribe({
      next: (res: any) => {
        console.log(this.groups);
        this.messageService.add({
          severity: 'success',
          summary: 'Group Updated',
        });
      },
      error: (err) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err.message));
        this.messageService.add({
          severity: 'error',
          summary: 'Error Updating Group',
          detail: this.errorMessage,
        });
      },
      complete: () => {
        this.backToGroups();
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
        this.messageService.add({
          severity: 'success',
          summary: 'Group Added',
        });
      },
      error: (err) => {
        this.errorMessage = err;
        this.messageService.add({
          severity: 'error',
          summary: 'Error Adding Group',
          detail: this.errorMessage,
        });
      },
      complete: () => {
        this.backToGroups();
      },
    });
  }

  confirmDelete(groupId: number, groupName: string) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete this group: ${groupName}?`,
      accept: () => {
        this.deleteGroup(groupId);
      },
    });
  }

  deleteGroup(groupId: number): void {
    this.subscription = this.groupService.deleteGroup(groupId).subscribe({
      next: (res: any) => {
        console.log(this.groups);
        this.messageService.add({
          severity: 'success',
          summary: 'Golfer Deleted',
        });
      },
      error: (err) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err.message));
        this.messageService.add({
          severity: 'error',
          summary: 'Error Deleting Group',
          detail: this.errorMessage,
        });
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

  isInputError(field: string): boolean {
    return (
      !this.groupForm.controls[field].valid &&
      this.groupForm.controls[field].touched
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
