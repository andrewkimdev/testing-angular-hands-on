import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

// Counter
import { CounterComponent } from './components/counter/counter.component';
import { HomeComponent } from './components/home/home.component';
import { ServiceCounterComponent } from './components/service-counter/service-counter.component';
import { NgrxCounterComponent } from './components/ngrx-counter/ngrx-counter.component';

// Form
import { SignupFormComponent } from './components/forms/signup-form/signup-form.component';
import { ControlErrorsComponent } from './components/forms/control-errors/control-errors.component';
import { ErrorMessageDirective } from './directives/error-message.directive';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot({}, {}),
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    CounterComponent,
    HomeComponent,
    ServiceCounterComponent,
    NgrxCounterComponent,
    SignupFormComponent,
    ControlErrorsComponent,
    ErrorMessageDirective,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
