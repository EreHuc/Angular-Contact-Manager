import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';


import { AppComponent } from './app.component';
import { NoContentComponent } from './no-content/no-content.component';

import { HomeModule } from './home/home.module';
import { AuthModule } from './auth/auth.module';
import { PrivateModule } from './private/private.module';
import { SharedModule } from './shared/shared.module';
import { MatInputModule, MatSnackBarModule } from '@angular/material';

@NgModule({
	declarations: [
		NoContentComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,
		AppRoutingModule,
		AuthModule,
		HomeModule,
		HttpClientModule,
		SharedModule,
		PrivateModule,
		MatSnackBarModule,
		MatInputModule
	],
	providers: [HttpClient, CookieService],
	bootstrap: [AppComponent]
})
export class AppModule {
}
