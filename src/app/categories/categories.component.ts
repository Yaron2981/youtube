import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CategoriesService } from './categories.service';
import { SearchService } from '../shared/services/search.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent {
  videoCategoryId: number = 0;
  constructor(
    private categoriesService: CategoriesService,
    private searchService: SearchService
  ) {}
  $categories = this.categoriesService.categories$;
  categoryClicked(categoryId: number) {
    this.searchService.categoryIdChanged(categoryId);
  }
}
