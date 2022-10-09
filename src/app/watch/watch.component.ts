import { Component, OnInit } from '@angular/core';
// import { LocalDBService } from '../shared/services/local-db.service';
import { filter } from 'rxjs/operators';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss'],
})
export class WatchComponent implements OnInit {
  constructor(private localDB: NgxIndexedDBService) {}

  ngOnInit(): void {
    this.localDB.getByID('lists', 10).subscribe((x) => console.log(x));
    // this.localDB
    //   .bulkGet('videos', ['5odH45KGUWE', '7cWjBCl2daU'])
    //   .subscribe((x: any) => console.log(x));
  }
}
