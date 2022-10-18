import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent {
  constructor(private ref: ChangeDetectorRef) {}
  @Input('videoId') videoId: string | null = null;
  @Input('posType') posType = 'vertical';
}
