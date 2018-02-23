import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validator, Validators } from '@angular/forms';

const emailRegexPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
    selector: 'app-add-contact',
    templateUrl: './add-contact.component.html',
    styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {

    public addContactForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<AddContactComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.addContactForm = this.buildForm();
    }

    ngOnInit() {
    }

    public handleAddressChange(event) {
        this.addContactForm.value.address = event.formatted_address;
    }

    private buildForm(): FormGroup {
        return new FormGroup({
            firstname: new FormControl('', Validators.required),
            lastname: new FormControl('', Validators.required),
            email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(emailRegexPattern)])),
            address: new FormControl(''),
            birthdate: new FormControl(''),
            sexe: new FormControl('')
        })
    }

}
