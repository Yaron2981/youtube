import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-videos-holder',
  templateUrl: './videos-holder.component.html',
  styleUrls: ['./videos-holder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosHolderComponent {
  constructor(private sharedService: SharedService) {}
  sidebarBtn$ = this.sharedService.sidebarTriggerBtn$;
  @Input('posType') posType: string = 'vertical';
  @Input('miniSidebar') miniSidebar: boolean = false;
  @Input() videoFlex: number = 24;
  @Input('loading') loading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
}
