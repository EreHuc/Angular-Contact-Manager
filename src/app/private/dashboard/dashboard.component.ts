import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AppState } from '../../shared/service/app.service';
import { DaoService } from '../../shared/service/dao.service';
import { USERS } from './mock-users';
import { MatDialog } from '@angular/material';
import { AddContactComponent } from '../add-contact/add-contact.component';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { UserInfo } from '../../user-info';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, AfterViewInit {
    public users:UserInfo[] = USERS;
    @ViewChild("placesRef") placesRef : GooglePlaceDirective;

    constructor(public appState: AppState, private daoService: DaoService, private dialog: MatDialog) {

    }

    public ngOnInit() {
        this.daoService.getContactList(this.appState.get('userId')).subscribe((users) => {
            this.users = users;
        })
    }

    public ngAfterViewInit() {

    }

    public openAddContactDialog() {
        const addContactDialog = this.dialog.open(AddContactComponent, {
            width: '50%',
        });

        addContactDialog.afterClosed().subscribe(contactInfo => {
            if (contactInfo) {
                console.log('dashboard.component.ts:39 -', contactInfo);
                const currentUserId = this.appState.get('userId');
                this.daoService.addContact(contactInfo, currentUserId).subscribe(data => {
                    console.log('dashboard.component.ts:41 -', data);
                }, err => {
                    // TODO: Notify on error
                    console.error(err);
                })
            }
        })
    }
}
