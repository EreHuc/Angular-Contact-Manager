import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { AddContactComponent } from './add-contact/add-contact.component';

import {
    MAT_DATE_LOCALE,
    MatButtonModule, MatCardModule, MatDatepickerModule, MatDialogModule, MatDividerModule,
    MatFormFieldModule, MatGridListModule, MatInputModule, MatNativeDateModule, MatPaginatorModule,
    MatProgressSpinnerModule, MatRadioModule,
    MatTableModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        MatTableModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatButtonModule,
        MatGridListModule,
        MatDividerModule,
        MatCardModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        GooglePlaceModule
    ],
    declarations: [
        DashboardComponent,
        ProfileComponent,
        AddContactComponent
    ],
    exports: [
        DashboardComponent,
        ProfileComponent,
        AddContactComponent
    ]
})
export class PrivateModule {
}
