import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeVideoListComponent } from './home-video-list.component';

describe('HomeVideoListComponent', () => {
  let component: HomeVideoListComponent;
  let fixture: ComponentFixture<HomeVideoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeVideoListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeVideoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
