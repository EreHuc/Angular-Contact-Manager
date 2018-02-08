import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PushNotificationsModule, PushNotificationsService } from 'ng-push';
import { HomeModule } from './home/home.module';
import { AuthModule } from './auth/auth.module';
import { NoContentComponent } from './no-content/no-content.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WaveDirective, WaveRippleDirective } from './shared/directive/wave.directive';
import { FocusedDirective } from './shared/directive/focused.directive';
import { AppState } from './shared/service/app.service';
import { DaoService } from './shared/service/dao.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SlimScroll } from './shared/directive/slim-scroll.directive';


@NgModule({
	declarations: [
		AppComponent,
		NoContentComponent,
		ProfileComponent,
		DashboardComponent,
		WaveDirective,
		WaveRippleDirective,
		FocusedDirective,
		SlimScroll
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HomeModule,
		AuthModule,
		PushNotificationsModule,
		HttpClientModule
	],
	providers: [PushNotificationsService, AppState, DaoService, HttpClient],
	bootstrap: [AppComponent]
})
export class AppModule {
}
