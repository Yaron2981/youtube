import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { MatDrawerToggleResult } from '@angular/material/sidenav';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnInit {
  constructor(private sharedService: SharedService) {}
  drawerModeSubscription$ = this.sharedService.resizedWindowWidth$;
  @ViewChild('drawer') drawer: any;

  menuTriggerBtn$ = this.sharedService.menuTriggerBtn$;
  menuTriggerBtn = this.sharedService.menuTriggerBtn;
  sidebarBtn$ = this.sharedService.sidebarTriggerBtn$;
  sidebarBtn = this.sharedService.sidebarTriggerBtn;
  ngOnInit() {
    this.drawerModeSubscription$.subscribe((x: any) => {
      if (x < 1310) this.sidebarBtn.next(false);
      else this.sidebarBtn.next(true);
    });
    this.sidebarBtn.subscribe((x) => {
      if (!x) this.drawer.updateContentMargins();
    });
  }

  ngAfterViewInit(): void {
    this.drawer.open();
  }
}
