import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SearchService } from '../shared/services/search.service';
import { VideosService } from '../shared/services/videos.service';
import { tap } from 'rxjs';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements AfterViewInit {
  @Input('categories') categories$!: Observable<any>;
  @ViewChild('widgetsContent', { read: ElementRef })
  widgetsContent!: ElementRef<any>;
  @Input('loading') loading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  scrollLeftBtn: boolean = false;
  scrollRightBtn: boolean = true;
  videoCategoryId: number = 0;
  rightScroll: number = 0;
  categoriesLen: number = 0;
  constructor(
    private videosService: VideosService,
    @Inject(DOCUMENT) private document: Document
  ) {}
  categoryClicked(categoryId: number) {
    this.document.querySelector('.videos-viewport')?.scroll(0, 0);
    this.videosService.emitCategoryChanged(categoryId);
  }
  ngAfterViewInit(): void {
    console.log(
      this.categories$.subscribe((x) => {
        let len = 0;
        x.forEach((r: any) => {
          len += r.title.length;
        });
        this.categoriesLen = x.length * 94 + len;
      })
    );
    if (this.widgetsContent) {
      const scroll = this.widgetsContent.nativeElement.scrollLeft + 150;
      if (scroll > 0) {
        this.scrollLeftBtn = true;
      }
    }
  }
  public scrollRight(): void {
    const scroll = this.widgetsContent.nativeElement.scrollLeft + 150;
    console.log(scroll, this.categoriesLen);
    if (scroll > 0 && scroll < this.categoriesLen - 136) {
      this.scrollRightBtn = true;
      this.scrollLeftBtn = true;
    } else this.scrollRightBtn = false;
    this.widgetsContent.nativeElement.scrollTo({
      left: scroll,
      behavior: 'smooth',
    });
  }
  public scrollLeft(): void {
    const scroll = this.widgetsContent.nativeElement.scrollLeft - 150;
    if (scroll < 100) {
      this.scrollRightBtn = true;
      this.scrollLeftBtn = false;
    }
    if (scroll > 0 && scroll < this.categoriesLen - 136) {
      this.scrollRightBtn = true;
      this.scrollLeftBtn = true;
    }

    this.widgetsContent.nativeElement.scrollTo({
      left: scroll,
      behavior: 'smooth',
    });
  }
}
