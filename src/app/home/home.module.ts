import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftBarComponent } from './left-bar/left-bar.component';
import { SignupComponent } from './signup/signup.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { RightBarComponent } from './right-bar/right-bar.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
	imports: [
		CommonModule,
		AppRoutingModule
	],
	declarations: [
		SignupComponent,
		TopBarComponent,
		LeftBarComponent,
		RightBarComponent
	],
	exports: [
		SignupComponent,
		TopBarComponent,
		LeftBarComponent,
		RightBarComponent
	]
})
export class HomeModule {
}
