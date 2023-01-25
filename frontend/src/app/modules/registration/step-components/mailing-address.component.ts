import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { RegistrationFormStepComponent } from '../registration.component';

export class MailingAddressModel {
	mailingAddress: string = '';
	addressLine1: string = '';
	addressLine2: string = '';
	city: string = '';
	postalCode: string = '';
	province: string = '';
	country: string = '';
}

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'app-mailing-address',
	template: `
		<form [formGroup]="form">
			<div class="step">
				<div class="title mb-5">What is your organization's mailing address?</div>
				<div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12 mb-4">
						<mat-form-field>
							<input matInput formControlName="mailingAddress" placeholder="Mail Address" />
							<mat-hint>
								Start with unit number and street number. Address autocompleted by
								<a href="https://www.canadapost.ca/pca" target="_blank">Canada Post</a>.
							</mat-hint>
						</mat-form-field>
					</div>
				</div>
				<div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<mat-form-field>
							<input matInput formControlName="addressLine1" placeholder="Street Address 1" />
						</mat-form-field>
					</div>
				</div>
				<div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<mat-form-field>
							<input matInput formControlName="addressLine2" placeholder="Street Address 2" />
						</mat-form-field>
					</div>
				</div>
				<div class="row">
					<div class="offset-md-2 col-md-6 col-sm-12">
						<mat-form-field>
							<input matInput formControlName="city" placeholder="City" />
						</mat-form-field>
					</div>
					<div class="col-md-2 col-sm-12">
						<mat-form-field>
							<input matInput formControlName="postalCode" placeholder="Postal Code" />
						</mat-form-field>
					</div>
				</div>
				<div class="row">
					<div class="offset-md-2 col-md-4 col-sm-12">
						<mat-form-field>
							<input matInput formControlName="province" placeholder="Province" />
						</mat-form-field>
					</div>
					<div class="col-md-4 col-sm-12">
						<mat-form-field>
							<input matInput formControlName="country" placeholder="Country" />
						</mat-form-field>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class MailingAddressComponent implements OnInit, RegistrationFormStepComponent {
	form!: FormGroup;

	@Input() stepData!: MailingAddressModel;
	@Output() formValidity: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			mailingAddress: new FormControl(''),
			addressLine1: new FormControl(''),
			addressLine2: new FormControl(''),
			city: new FormControl(''),
			postalCode: new FormControl(''),
			province: new FormControl(''),
			country: new FormControl(''),
		});

		this.form.valueChanges.subscribe((_val: any) => {
			this.stepData = this.form.value;
			this.formValidity.emit(this.isFormValid());
		});
	}

	getDataToSave(): any {
		return this.stepData;
	}

	isFormValid(): boolean {
		return this.stepData.mailingAddress ? true : false;
	}
}
