import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { LeftBarComponent } from './left-bar/left-bar.component';
import { SignupComponent } from './signup/signup.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { RightBarComponent } from './right-bar/right-bar.component';
import { AppRoutingModule } from '../app-routing.module';
import { AppComponent } from '../app.component';
import { LoginComponent } from './login/login.component';


import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		AppRoutingModule,
		SharedModule,
		ReactiveFormsModule
	],
	declarations: [
		AppComponent,
		SignupComponent,
		TopBarComponent,
		LeftBarComponent,
		RightBarComponent,
		LoginComponent
	],
	exports: [
		SignupComponent,
		TopBarComponent,
		LeftBarComponent,
		RightBarComponent,
		LoginComponent
	]
})
export class HomeModule {
}
