import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Group } from '../models/group';
import { Member } from '../models/member';
import { GolferService } from '../services/golfer.service';

@Component({
  selector: 'fc-golfer',
  templateUrl: './golfer.component.html',
  styleUrls: ['./golfer.component.css'],
})
export class GolferComponent implements OnInit {
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
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
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

  goToEditMode(golferId: number) {
    this.golfer = this.golfers.find(
      (element) => element.MemberId == golferId
    ) as Member;

    this.createForm();
    this.isEditMode = true;
  }

  goToAddMode(golferId: number) {
    alert('delete: ' + golferId);
  }

  deleteGolfer(golferId: number) {
    alert('delete: ' + golferId);
  }

  createForm() {
    this.golferForm = this.fb.group({
      MemberName: [this.golfer.MemberName, [Validators.required]],
      MemberEmail: [this.golfer.MemberEmail, [Validators.required, Validators.email],],
      MemberPhone: [
        this.golfer.MemberPhone,
        [
          Validators.required,
          //Validators.pattern('^[0-9]'),
          Validators.minLength(12),
          Validators.maxLength(12),
        ],
      ]
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
