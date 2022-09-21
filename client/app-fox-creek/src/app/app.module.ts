import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { EventService } from './services/event.service';

@NgModule({
  declarations: [AppComponent, HeaderComponent, MainComponent, FooterComponent],
  imports: [BrowserModule, CommonModule, HttpClientModule],
  providers: [EventService],
  bootstrap: [AppComponent],
})
export class AppModule {}
