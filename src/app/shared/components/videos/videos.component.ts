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
import {
  BehaviorSubject,
  Subject,
  Observable,
  takeUntil,
  Subscription,
} from 'rxjs';
import { Video } from 'src/app/search.interface';
import { EventEmitter } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { RESULTS } from '../../constants/yt';
import { mathFloor } from 'src/utils/utils';

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
  @Input() videosInRow: number = 1;

  @Input() posType: string = 'vertical';
  @Input('loading') loading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  @Output('nextPage') nextPage = new EventEmitter<boolean>();
  popPos: number = -50;
  subscription: Subscription = new Subscription();
  remainder: number = 0;
  get Math() {
    return Math;
  }
  onScroll(e: any, resLength: number) {
    e.preventDefault();
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
    this.ref.detectChanges();
  }
  ngAfterViewInit() {
    /*
      fix pop-over window position. For ex if got 4/5 videos in a row do remainder of 4/5 and if got 1 so pos window to right else 0 pos to left all the rest in the middle "transform: 'translate(4/5 %, -45%)'"
    */
    // this.subscription = this.sharedService.sidebarTriggerBtn$.pipe().subscribe(
    //   (sb) => {
    //     const rim = sb ? 4 : 5;
    //     this.remainder =
    //       (this.videoIndex + 1) % rim == 0
    //         ? -53
    //         : (this.videoIndex + 1) % rim == 1
    //         ? -47
    //         : -50;
    //     this.ref.detectChanges();
    //   }
    // );
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
