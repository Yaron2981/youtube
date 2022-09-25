import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopOverVideoComponent } from './pop-over-video.component';

describe('PopOverVideoComponent', () => {
  let component: PopOverVideoComponent;
  let fixture: ComponentFixture<PopOverVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopOverVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopOverVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
