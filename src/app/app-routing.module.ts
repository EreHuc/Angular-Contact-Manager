import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivateRouterService } from './shared/service/authGardService/private-guard.service';
import { PublicRouterService } from './shared/service/authGardService/public-gard.service';
import { SignupComponent } from './home/signup/signup.component';
import { VerifyComponent } from './auth/verify/verify.component';
import { CongratComponent } from './auth/congrat/congrat.component';
import { NoContentComponent } from './no-content/no-content.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
	{path: 'verify/:hash', component: VerifyComponent},
	// public routes
	{path: '', component: SignupComponent, canActivate: [PublicRouterService]},
	{path: 'home', component: SignupComponent, canActivate: [PublicRouterService]},
	{path: 'congrat', component: CongratComponent, canActivate: [PublicRouterService]},
	{path: 'login', component: LoginComponent, canActivate: [PublicRouterService]},
	// private routes
	{path: 'dashboard/:username', component: DashboardComponent, canActivate: [PrivateRouterService]},
	{path: 'profile/:username', component: ProfileComponent, canActivate: [PrivateRouterService]},
	// 404 error
	{path: '**', component: NoContentComponent}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
	providers: [PublicRouterService, PrivateRouterService]
})
export class AppRoutingModule {
}
