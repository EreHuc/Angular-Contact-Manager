import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyComponent } from './verify/verify.component';
import { CongratComponent } from './congrat/congrat.component';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	imports: [
		CommonModule,
		AppRoutingModule,
		SharedModule,
		ReactiveFormsModule
	],
	declarations: [
		VerifyComponent,
		CongratComponent
	],
	exports: [
		VerifyComponent,
		CongratComponent
	]
})
export class AuthModule {
}
