import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'fc-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent implements OnInit, OnDestroy {
  logo: string = './assets/images/logo.jpg';
  logoAlt: string = 'Fox Creek Logo';

  eventSubscription!: Subscription;
  events!: any;
  errorMessage!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.eventSubscription = this.eventService.getEvents().subscribe({
      next: (res: any) => {
        this.events = res;
        console.log(this.events);
      },
      error: (err) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err.message));
      },
      complete: () => {
        console.log(`called getEvents()`);
      },
    });
  }

  goToGroups(eventId: string): void {
    this.router.navigate(['groups'], {
      relativeTo: this.route,
      queryParams: { eventId: `${eventId}` },
    });
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
