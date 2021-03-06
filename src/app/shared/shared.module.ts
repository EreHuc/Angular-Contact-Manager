import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FocusedDirective } from './directive/focused.directive';
import { SlimScroll } from './directive/slim-scroll.directive';
import { WaveDirective, WaveRippleDirective } from './directive/wave.directive';

import { AppState } from './service/app.service';
import { DaoService } from './service/dao.service';
import { UtilsService } from './service/utils.service';

import { LoadingComponent } from './loading/loading.component';
import { SpinnerBtnComponent } from './spiner-btn/spinner-btn.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		FocusedDirective,
		SlimScroll,
		WaveDirective,
		WaveRippleDirective,
		LoadingComponent,
		SpinnerBtnComponent
	],
	providers: [
		AppState,
		DaoService,
		UtilsService
	],
	exports: [
		FocusedDirective,
		SlimScroll,
		WaveDirective,
		WaveRippleDirective,
		LoadingComponent,
		SpinnerBtnComponent
	]
})

export class SharedModule {
}
