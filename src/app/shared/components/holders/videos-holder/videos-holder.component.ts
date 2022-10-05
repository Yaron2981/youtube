import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-videos-holder',
  templateUrl: './videos-holder.component.html',
  styleUrls: ['./videos-holder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosHolderComponent {
  @Input('posType') posType: string = 'vertical';
  @Input('miniSidebar') miniSidebar: boolean = false;
  @Input('videoFlexSize') videoFlexSize: number = 80;
  @Input('loading') loading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
}
