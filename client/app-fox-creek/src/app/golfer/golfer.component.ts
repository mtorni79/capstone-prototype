import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Group } from '../models/group.model';
import { Member } from '../models/member.model';
import { GolferService } from '../services/golfer.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'fc-golfer',
  templateUrl: './golfer.component.html',
  styleUrls: ['./golfer.component.css'],
})
export class GolferComponent implements OnInit {
  eventId!: string;

  group!: Group;
  groupName!: string;
  golfers!: Array<Member>;
  golfer!: Member;

  golferForm!: FormGroup;

  isEditMode: boolean = false;
  isAddMode: boolean = false;

  subscription!: Subscription;
  errorMessage!: string;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private golferService: GolferService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.eventId = params['eventId'];
      this.setGroup(params['groupId']);
    });
  }

  setGroup(groupId: number): void {
    this.subscription = this.golferService.getGroupById(groupId).subscribe({
      next: (res: any) => {
        this.group = res;
        this.groupName = this.group.GroupName;
        this.golfers = res.Members;
        console.log(this.golfers);
      },
      error: (err) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err.message));
      },
      complete: () => {
        console.log(`called getGroupById()`);
        this.isLoading = false;
      },
    });
  }

  goToEditMode(golferId: number): void {
    this.golfer = this.golfers.find(
      (element) => element.MemberId == golferId
    ) as Member;

    this.createForm();
    this.isEditMode = true;
  }

  goToAddMode(): void {
    this.golfer = new Member();
    this.createForm();
    this.isAddMode = true;
  }

  deleteGolfer(golferId: number): void {
    alert('delete: ' + golferId);
    this.subscription = this.golferService
      .deleteGolfer(this.group.GroupId, golferId)
      .subscribe({
        next: (res: any) => {
          this.golfer = res;
          console.log('deleteGolfer: ' + this.golfer);
        },
        error: (err) => {
          this.errorMessage = err;
          console.log((this.errorMessage = err.message));
        },
        complete: () => {
          console.log(`called deleteGolfer()`);
          this.setGroup(this.group.GroupId);
          alert('deleted');
        },
      });
  }

  backToGolfers(): void {
    this.isEditMode = false;
    this.isAddMode = false;
  }

  backToGroups(): void {
    this.router.navigate(['../groups'], {
      relativeTo: this.route,
      queryParams: { eventId: `${this.eventId}` },
    });
  }

  createForm(): void {
    this.golferForm = this.fb.group({
      MemberName: [this.golfer.MemberName, [Validators.required]],
      MemberEmail: [
        this.golfer.MemberEmail,
        [Validators.required, Validators.email],
      ],
      MemberPhone: [
        this.golfer.MemberPhone,
        [
          Validators.required,
          //Validators.pattern('^[0-9]'),
          Validators.minLength(12),
          Validators.maxLength(12),
        ],
      ],
    });
  }

  saveForm(isAddMode: boolean): void {
    this.golfer.MemberName = this.golferForm.value.MemberName;
    this.golfer.MemberEmail = this.golferForm.value.MemberEmail;
    this.golfer.MemberPhone = this.golferForm.value.MemberPhone;

    if (!isAddMode) {
      this.updateGolfer();
    } else {
      this.addGolfer();
    }

    this.isEditMode = false;
    this.isAddMode = false;
  }

  updateGolfer() {
    this.subscription = this.golferService
      .updateGolfer(this.group.GroupId, this.golfer)
      .subscribe({
        next: (res: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Golfer Updated',
          });
        },
        error: (err) => {
          this.errorMessage = err;
          this.messageService.add({
            severity: 'error',
            summary: 'Error While Updating Golfer',
          });
        },
        complete: () => {
          console.log(`called updateGolfer()`);
          this.setGroup(this.group.GroupId);
        },
      });
  }

  addGolfer() {
    this.subscription = this.golferService
      .addGolfer(this.group.GroupId, this.golfer)
      .subscribe({
        next: (res: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Golfer Added',
          });
        },
        error: (err) => {
          this.errorMessage = err;
          this.messageService.add({
            severity: 'error',
            summary: 'Error While Adding Golfer',
          });
        },
        complete: () => {
          this.setGroup(this.group.GroupId);
        },
      });
  }

  isInputError(field: string): boolean {
    return (
      !this.golferForm.controls[field].valid &&
      this.golferForm.controls[field].touched
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
