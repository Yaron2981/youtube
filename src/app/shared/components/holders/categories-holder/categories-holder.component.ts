import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-categories-holder',
  templateUrl: './categories-holder.component.html',
  styleUrls: ['./categories-holder.component.scss'],
})
export class CategoriesHolderComponent {
  @Input('loading') loading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  randomSpace() {
    return [].constructor(Math.floor(Math.random() * 16 + 10)).join('&nbsp;');
  }
}
