import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Video } from '../search.interface';
import { SearchService } from '../shared/services/search.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private searchService: SearchService) {}
  @Input('miniSidebar') miniSidebar = false;
  videos$: Observable<Video[]> = this.searchService.getSource();
}
