import { NgModule } from '@angular/core';
import { CanActivate, Route, RouterModule, Routes } from '@angular/router';
import { GroupComponent } from './group/group.component';
import { EventComponent } from './event/event.component';
import { GolferComponent } from './golfer/golfer.component';
import { RegisterComponent } from './register/register.component';
import { RegisterGuardService } from './services/register-guard.service';

class AllowFullAccessGuard implements CanActivate {
  canActivate(): boolean {
    console.log('AllowFullAccesss has been activated');
    return true;
  }
}

const fallbackRoute: Route = {
  path: '**',
  component: EventComponent,
};

const routes: Routes = [
  {
    path: 'groups',
    component: GroupComponent,
    canActivate: [AllowFullAccessGuard, RegisterGuardService],
  },
  { path: 'golfers', component: GolferComponent },
  { path: 'register', component: RegisterComponent },
  fallbackRoute,
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
  providers: [AllowFullAccessGuard, RegisterGuardService],
})
export class AppRoutingModule {}
