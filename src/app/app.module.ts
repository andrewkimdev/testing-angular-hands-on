import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CounterComponent } from './components/counter/counter.component';
import { HomeComponent } from './components/home/home.component';
import { ServiceCounterComponent } from './components/service-counter/service-counter.component';
import { NgrxCounterComponent } from './components/ngrx-counter/ngrx-counter.component';

@NgModule({
  declarations: [
    AppComponent,
    CounterComponent,
    HomeComponent,
    ServiceCounterComponent,
    NgrxCounterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
