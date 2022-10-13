import { animate, style, transition, trigger } from '@angular/animations';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, fromEvent, map, Observable, of } from 'rxjs';
import { Video } from 'src/app/search.interface';
import { EventEmitter } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
  // animations: [
  //   trigger('fade', [
  //     transition('void => *', [
  //       style({ opacity: 0 }),
  //       animate(500, style({ opacity: 1 })),
  //     ]),
  //   ]),
  // ],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosComponent implements OnInit {
  constructor(
    private ref: ChangeDetectorRef,
    private sharedService: SharedService
  ) {}
  @Input('videos') videos$: Observable<Video[]> = new BehaviorSubject<Video[]>(
    []
  );
  sidebarBtn$ = this.sharedService.sidebarTriggerBtn$;
  @Input() miniSidebar: boolean = false;
  @Input() posType: string = 'vertical';
  @Input('loading') loading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  @Output('nextPage') nextPage = new EventEmitter<boolean>();
  videoFlexSize: number | null =
    this.posType == 'horizontal' ? 80 : this.miniSidebar ? 18.5 : 22.5;
  onScroll(e: any) {
    if (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight) {
      this.nextPage.emit(false);
    }
  }
  ngOnInit() {
    this.videoFlexSize =
      this.posType == 'horizontal' ? 80 : this.miniSidebar ? 18.5 : 22.5;
    this.ref.detectChanges();
  }
}
