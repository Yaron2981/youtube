import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
})
export class TemplateComponent {
  constructor(
    private sharedService: SharedService,
    private snackBar: MatSnackBar
  ) {}
  miniSidebar: boolean = true;
  errorMsg$ = this.sharedService.errorMsg$.subscribe((err) => {
    if (err) this.snackBar.open(err.message, '', { duration: 5000 });
  });

  miniSideTriggerEvent(trigger: boolean) {
    this.miniSidebar = !trigger;
  }
}
