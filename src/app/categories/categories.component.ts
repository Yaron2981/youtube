import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { SearchService } from '../shared/services/search.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements AfterViewInit {
  @Input('categories') $categories!: Observable<any>;
  @ViewChild('widgetsContent', { read: ElementRef })
  widgetsContent!: ElementRef<any>;
  scrollLeftBtn: boolean = false;
  scrollRightBtn: boolean = true;
  videoCategoryId: number = 0;
  constructor(private searchService: SearchService) {}
  categoryClicked(categoryId: number) {
    this.searchService.categoryIdChanged(categoryId);
  }
  ngAfterViewInit(): void {
    const scroll = this.widgetsContent.nativeElement.scrollLeft + 150;
    if (scroll > 0) {
      this.scrollLeftBtn = true;
    }
  }
  public scrollRight(): void {
    const scroll = this.widgetsContent.nativeElement.scrollLeft + 150;
    if (scroll > 0) {
      this.scrollLeftBtn = true;
    }
    this.widgetsContent.nativeElement.scrollTo({
      left: scroll,
      behavior: 'smooth',
    });
  }
  public scrollLeft(): void {
    const scroll = this.widgetsContent.nativeElement.scrollLeft - 150;
    if (scroll < 100) {
      this.scrollLeftBtn = false;
    }

    this.widgetsContent.nativeElement.scrollTo({
      left: scroll,
      behavior: 'smooth',
    });
  }
}
