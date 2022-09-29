import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CategoriesService } from './categories.service';
import { SearchService } from '../shared/services/search.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements AfterViewInit {
  @ViewChild('widgetsContent', { read: ElementRef })
  widgetsContent!: ElementRef<any>;
  scrollLeftBtn: boolean = false;
  scrollRightBtn: boolean = true;
  videoCategoryId: number = 0;
  constructor(
    private categoriesService: CategoriesService,
    private searchService: SearchService
  ) {}
  $categories = this.categoriesService.categories$;
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
