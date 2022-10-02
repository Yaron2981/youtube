import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosHolderComponent } from './videos-holder.component';

describe('VideosHolderComponent', () => {
  let component: VideosHolderComponent;
  let fixture: ComponentFixture<VideosHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideosHolderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VideosHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
