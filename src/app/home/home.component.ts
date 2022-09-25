import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { Video } from '../search.interface';
import { SearchService } from '../shared/services/search.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  constructor(
    private searchService: SearchService,
    private ref: ChangeDetectorRef
  ) {}
  @Input('miniSidebar') miniSidebar = false;
  videos$: Observable<Video[]> = of([]);
  ngOnInit() {
    this.videos$ = this.searchService.getSource();
    this.ref.detectChanges();
  }
}
