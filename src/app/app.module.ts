import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SafePipe } from './shared/pipes/safe.pipe';
import { DateAgoPipe } from './shared/pipes/date-ago.pipe';
import { ShortNumberPipe } from './shared/pipes/short-number.pipe';
import { VideoComponent } from './shared/components/videos/video/video.component';
import { PlayerComponent } from './shared/components/videos/video/pop-over-video/player/player.component';
import { PopOverVideoComponent } from './shared/components/videos/video/pop-over-video/pop-over-video.component';
import { TemplateComponent } from './template/template.component';
import { HomeComponent } from './home/home.component';
import { CategoriesComponent } from './categories/categories.component';
import { VideosComponent } from './shared/components/videos/videos.component';
import { HeaderComponent } from './template/header/header.component';
import { FotterComponent } from './template/fotter/fotter.component';
import { DrawerComponent } from './template/drawer/drawer.component';
import { ResultsComponent } from './results/results.component';
import { WatchComponent } from './watch/watch.component';
import { TruncatePipe } from './shared/pipes/truncate.pipe';
import { CategoriesHolderComponent } from './shared/components/holders/categories-holder/categories-holder.component';
import { ErrorCatchingInterceptor } from './interceptors/error-catching.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { dbConfig } from './localDB/DBConfig';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { ChunkPipe } from './shared/pipes/chunk.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
    DateAgoPipe,
    ShortNumberPipe,
    VideoComponent,
    PlayerComponent,
    PopOverVideoComponent,
    TemplateComponent,
    HomeComponent,
    CategoriesComponent,
    VideosComponent,
    HeaderComponent,
    FotterComponent,
    DrawerComponent,
    ResultsComponent,
    WatchComponent,
    TruncatePipe,
    CategoriesHolderComponent,
    ChunkPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    FlexLayoutModule,
    MatButtonModule,
    MatProgressBarModule,
    MatChipsModule,
    MatDividerModule,
    CommonModule,
    MatSnackBarModule,
    NgxIndexedDBModule.forRoot(dbConfig),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorCatchingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
