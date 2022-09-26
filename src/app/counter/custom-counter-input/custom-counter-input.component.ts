import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { changeText, customIncrement } from '../state/counter.actions';
import { getText } from '../state/counter.selectors';

@Component({
  selector: 'app-custom-counter-input',
  templateUrl: './custom-counter-input.component.html',
  styleUrls: ['./custom-counter-input.component.css']
})
export class CustomCounterInputComponent implements OnInit {
  value!: number;
  text$: Observable<string> | undefined;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.text$ = this.store.select(getText);
  }

  onAdd() {
    this.store.dispatch(customIncrement({ count: +this.value }));
  }

  onChangeText() {
    this.store.dispatch(changeText())
  }
}
