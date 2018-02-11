import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { MatFormFieldModule, MatPaginatorModule, MatProgressSpinnerModule, MatTableModule } from '@angular/material';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		MatTableModule,
		MatFormFieldModule,
		MatPaginatorModule,
		MatProgressSpinnerModule
	],
	declarations: [
		DashboardComponent,
		ProfileComponent
	],
	exports: [
		DashboardComponent,
		ProfileComponent
	]
})
export class PrivateModule {
}
