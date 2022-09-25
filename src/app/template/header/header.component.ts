import { Component, Input, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, startWith, Subject, switchMap } from 'rxjs';
import { SearchService } from '../../shared/services/search.service';
import { LocalService } from 'src/app/shared/services/local.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private searchService: SearchService, private ls: LocalService) {}
  @Input('miniSidebar') miniSidebar = false;
  @Output() miniSideTriggerEvent = new EventEmitter<boolean>();
  control = new UntypedFormControl('');
  fetchtitles$ = new Subject<void>();
  titles$ = this.fetchtitles$.pipe(
    switchMap(() => this.control.valueChanges),
    debounceTime(400),
    switchMap((val) => this.searchService.getVideosTitles(val)),
    startWith(this.ls.isExsist('search') ? this.ls.getData('search') : [])
  );
}
