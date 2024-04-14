import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public handleCountChange(count: number): void {
    console.log('countChange event from CounterComponent', count);
  }
}
