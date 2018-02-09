import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PushNotificationsModule, PushNotificationsService} from 'ng-push';
import {HomeModule} from './home/home.module';
import {AuthModule} from './auth/auth.module';
import {NoContentComponent} from './no-content/no-content.component';
import {ProfileComponent} from './profile/profile.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {SharedModule} from './shared/shared.module';


@NgModule({
    declarations: [
        NoContentComponent,
        ProfileComponent,
        DashboardComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HomeModule,
        AuthModule,
        PushNotificationsModule,
        HttpClientModule,
        SharedModule
    ],
    providers: [PushNotificationsService, HttpClient],
    bootstrap: [AppComponent]
})
export class AppModule {
}
