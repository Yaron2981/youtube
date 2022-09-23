import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Observable, pipe } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Video } from './search.interface';
import { SearchService } from './search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private searchService: SearchService) {}
  PBCounter: number = 0;
  showFiller: boolean = true;
  drawer: boolean = true;
  title = 'youtube';
  control = new UntypedFormControl('');
  timeout: any = null;
  streets: string[] = [
    'Champs-Élysées',
    'Lombard Street',
    'Abbey Road',
    'Fifth Avenue',
  ];
  filteredStreets: Observable<string[]> | null = null;
  videos$: Observable<Video[]> = this.searchService.getSource();
  ngOnInit() {
    this.filteredStreets = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
    console.log(
      `https://www.googleapis.com/youtube/v3/search?q=&key=AIzaSyAihzHStyDE_PYGqEGNQjXTdmvDb2LCgdE&part=snippet&type=video&type=channel&maxResults=16`
    );
    setInterval(() => {
      this.PBCounter += 1;
    }, 1000);
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.streets.filter((street) =>
      this._normalizeValue(street).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
  onMouseEnter(video: Video) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      video.showPop = true;
    }, 1500);
  }
  onMouseLeave(video: Video) {
    video.showPop = false;
    clearTimeout(this.timeout);
  }
}
