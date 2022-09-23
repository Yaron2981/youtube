import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../categories.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
  videoCategoryId: number = 0;
  constructor(
    private categoriesService: CategoriesService,
    private searchService: SearchService
  ) {}
  $categories = this.categoriesService.categories$;
  categoryClicked(categoryId: number) {
    // this.searchService.qcid.next({ q: '', cid: categoryId });
    console.log('categoryId', categoryId);
    this.searchService.categoryIdChanged(categoryId);
  }
}
