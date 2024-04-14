import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CounterState } from 'src/reducers/counter.reducer';
import { CounterService } from 'src/services/counter.service';

@Component({
  selector: 'app-service-counter',
  templateUrl: './service-counter.component.html',
  styleUrls: ['./service-counter.component.scss']
})
export class ServiceCounterComponent {
  public count$: Observable<CounterState>;

  constructor(private counterService: CounterService) {
    this.count$ = this.counterService.getCount();
  }

  public increment(): void {
    this.counterService.increment();
  }

  public decrement(): void {
    this.counterService.decrement();
  }

  public reset(newCount: string): void {
    const count = parseInt(newCount, 10);
    if (!Number.isNaN(count)) {
      this.counterService.reset(count);
    }
  }
}
