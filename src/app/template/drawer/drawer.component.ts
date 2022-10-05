import { Component } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent {
  constructor(private sharedService: SharedService) {}
  sidebarBtn$ = this.sharedService.sidebarTriggerBtn$;
}
