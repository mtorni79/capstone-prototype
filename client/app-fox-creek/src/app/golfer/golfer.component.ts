import { Component, OnInit } from '@angular/core';
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
   groupId!: number;
   //group!: Group;
   golfers!: Array<Member>;

  subscription!: Subscription;
  errorMessage!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private golferService: GolferService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.groupId = params['groupId'];
      this.setGroup(this.groupId);
    });
  }

  setGroup(groupId: number): void {
    this.subscription = this.golferService
      .getGroupById(groupId)
      .subscribe({
        next: (res: any) => {
          this.golfers = res.Members;
          console.log(this.golfers);
        },
        error: (err) => {
          this.errorMessage = err;
          console.log((this.errorMessage = err.message));
        },
        complete: () => {
          console.log(`called getGroupById()`);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
