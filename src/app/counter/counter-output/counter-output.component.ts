import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { getCounter } from '../state/counter.selectors';

@Component({
  selector: 'app-counter-output',
  templateUrl: './counter-output.component.html',
  styleUrls: ['./counter-output.component.css']
})
export class CounterOutputComponent implements OnInit{
  // counter: number | undefined;
  // counterSubscription: Subscription | undefined;

  counter$: Observable<number> | undefined;
  constructor(private store: Store<AppState>) { }


  ngOnInit(): void {
    this.counter$ = this.store.select(getCounter);

    // this.counterSubscription = this.store
    //   .select(getCounter)
    //   .subscribe(counter => {
    //     this.counter = counter;
    //   })
  }

  // ngOnDestroy(): void {
  //   if (this.counterSubscription) {
  //     this.counterSubscription.unsubscribe();
  //   }
  // }

}
