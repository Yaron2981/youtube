import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject, Subject, Observable, takeUntil } from 'rxjs';
import { Video } from 'src/app/search.interface';
import { EventEmitter } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { RESULTS } from '../../constants/yt';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 })),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosComponent implements OnInit, OnDestroy {
  constructor(
    private ref: ChangeDetectorRef,
    private sharedService: SharedService
  ) {}
  @Input('videos') videos$: Observable<Video[]> = new BehaviorSubject<Video[]>(
    []
  );
  ngUnsubscribe = new Subject<void>();
  sidebarTriggerBtn: boolean = false;
  @Input() miniSidebar: boolean = false;
  @Input() allowScrolling: boolean = false;
  @Input() posType: string = 'vertical';
  @Input('loading') loading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  @Output('nextPage') nextPage = new EventEmitter<boolean>();
  videoFlexSize: number | null =
    this.posType == 'horizontal' ? 80 : this.miniSidebar ? 18.5 : 22.5;
  onScroll(e: any, resLength: number) {
    if (
      resLength < RESULTS.MAX_RESULTS &&
      e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight
    ) {
      this.nextPage.emit(false);
    }
  }
  ngOnInit() {
    this.sharedService.sidebarTriggerBtn$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (sidebarTriggerBtn) => (this.sidebarTriggerBtn = sidebarTriggerBtn)
      );
    this.videoFlexSize =
      this.posType == 'horizontal' ? 80 : this.miniSidebar ? 18.5 : 22.5;
    this.ref.detectChanges();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
