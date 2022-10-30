import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedVideoListComponent } from './related-video-list.component';

describe('RelatedVideoListComponent', () => {
  let component: RelatedVideoListComponent;
  let fixture: ComponentFixture<RelatedVideoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedVideoListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedVideoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
