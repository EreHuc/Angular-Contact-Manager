import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyComponent } from './verify/verify.component';
import { CongratComponent } from './congrat/congrat.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
	imports: [
		CommonModule,
		AppRoutingModule
	],
	declarations: [
		VerifyComponent,
		CongratComponent,
		LoginComponent
	],
	exports: [
		VerifyComponent,
		CongratComponent,
		LoginComponent
	]
})
export class AuthModule {
}
