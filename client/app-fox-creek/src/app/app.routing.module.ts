import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { Route, RouterModule, Routes } from '@angular/router';
import { GroupComponent } from './group/group.component';
import { EventComponent } from './event/event.component';
import { GolferComponent } from './golfer/golfer.component';

const fallbackRoute: Route = {
  path: '**',
  component: EventComponent,
};

const routes: Routes = [
  { path: 'groups', component: GroupComponent },
  { path: 'golfers', component: GolferComponent },
  fallbackRoute,
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
