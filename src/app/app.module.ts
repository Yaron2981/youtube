import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SafePipe } from './shared/pipes/safe.pipe';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { ShortNumberPipe } from './pipes/short-number.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { VideoComponent } from './shared/components/videos/video/video.component';
import { PlayerComponent } from './shared/components/videos/video/pop-over-video/player/player.component';
import { PopOverVideoComponent } from './shared/components/videos/video/pop-over-video/pop-over-video.component';
import { TemplateComponent } from './template/template.component';
import { HomeComponent } from './home/home.component';
import { CategoriesComponent } from './categories/categories.component';
import { MatDividerModule } from '@angular/material/divider';
import { VideosComponent } from './shared/components/videos/videos.component';
import { HeaderComponent } from './template/header/header.component';
import { FotterComponent } from './template/fotter/fotter.component';
import { DrawerComponent } from './template/drawer/drawer.component';
import { ResultsComponent } from './results/results.component';
import { WatchComponent } from './watch/watch.component';
import { CommonModule } from '@angular/common';
import { VideosHolderComponent } from './shared/components/holders/videos-holder/videos-holder.component';
import { TruncatePipe } from './shared/pipes/truncate.pipe';
import { CategoriesHolderComponent } from './shared/components/holders/categories-holder/categories-holder.component';

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
    VideosHolderComponent,
    TruncatePipe,
    CategoriesHolderComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
