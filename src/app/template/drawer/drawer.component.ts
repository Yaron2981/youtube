import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import {
  MatDrawerToggleResult,
  MatDrawer,
  MatDrawerContainer,
} from '@angular/material/sidenav';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnInit, AfterViewInit {
  constructor(private sharedService: SharedService) {}
  drawerModeSubscription$ = this.sharedService.resizedWindowWidth$;
  @ViewChild('sidenav') sidenav: any;
  showHideSTBtn$ = this.sharedService.showHideSTBtn$;
  menuTriggerBtn$ = this.sharedService.menuTriggerBtn$;
  menuTriggerBtn = this.sharedService.menuTriggerBtn;
  sidebarBtn$ = this.sharedService.sidebarTriggerBtn$;
  sidebarBtn = this.sharedService.sidebarTriggerBtn;
  ngOnInit() {
    this.drawerModeSubscription$.subscribe((x: any) => {
      if (x < 1310) this.sidebarBtn.next(false);
      else this.sidebarBtn.next(true);
    });
  }
  onActivate(event: Event) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  ngAfterViewInit(): void {
    let timeoutNum = 250;
    setTimeout(() => {
      timeoutNum = 10;
    }, 250);
    this.sidebarBtn.subscribe((x) => {
      //adding setTimeout fix margin bug
      setTimeout(() => {
        this.sidenav.open();
      }, timeoutNum);
    });
  }
}
