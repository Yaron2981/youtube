import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoHolderComponent } from './video-holder.component';

describe('VideoHolderComponent', () => {
  let component: VideoHolderComponent;
  let fixture: ComponentFixture<VideoHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoHolderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
