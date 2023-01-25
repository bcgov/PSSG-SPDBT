import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { RegistrationFormStepComponent } from '../registration.component';

export class AuthorizedContactModel {
	givenName: string = '';
	surname: string = '';
	jobTitle: string = '';
	email: string = '';
	day: string = '';
	month: string = '';
	year: string = '';
	areaCode: string = '';
	phoneNumber: string = '';
	ext: string = '';
}

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'app-authorized-contact-information',
	template: `
		<form [formGroup]="form">
			<div class="step">
				<div class="title mb-5">Please provide your work contact information:</div>
				<div class="row">
					<div class="offset-md-2 col-md-4 col-sm-12">
						<mat-form-field>
							<input matInput formControlName="givenName" placeholder="Given Name" />
						</mat-form-field>
					</div>
					<div class="col-md-4 col-sm-12">
						<mat-form-field>
							<input matInput formControlName="surname" placeholder="Surname" />
						</mat-form-field>
					</div>
				</div>
				<div class="row">
					<div class="offset-md-2 col-md-4 col-sm-12">
						<mat-form-field>
							<input matInput formControlName="jobTitle" placeholder="Job Title" />
						</mat-form-field>
					</div>
					<div class="col-md-4 col-sm-12">
						<mat-form-field>
							<input matInput formControlName="email" placeholder="Your Work Email Address" />
						</mat-form-field>
					</div>
				</div>
				<div class="row">
					<div class="offset-md-2 col-md-2 col-sm-12">
						<mat-form-field>
							<input matInput formControlName="day" placeholder="Day" />
						</mat-form-field>
					</div>
					<div class="col-md-3 col-sm-12">
						<mat-form-field>
							<input matInput formControlName="month" placeholder="Month" />
						</mat-form-field>
					</div>
					<div class="col-md-3 col-sm-12">
						<mat-form-field>
							<input matInput formControlName="year" placeholder="Year" />
						</mat-form-field>
					</div>
				</div>
				<div class="row">
					<div class="offset-md-2 col-md-2 col-sm-12">
						<mat-form-field>
							<input matInput formControlName="areaCode" placeholder="Area Code" />
						</mat-form-field>
					</div>
					<div class="col-md-3 col-sm-12">
						<mat-form-field>
							<input matInput formControlName="phoneNumber" placeholder="Direct Phone Number" />
							<mat-hint>XXX-XXX-XXXX</mat-hint>
						</mat-form-field>
					</div>
					<div class="col-md-3 col-sm-12">
						<mat-form-field>
							<input matInput formControlName="ext" placeholder="Ext." />
						</mat-form-field>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class AuthorizedContactInformationComponent implements OnInit, RegistrationFormStepComponent {
	form!: FormGroup;

	@Input() stepData!: AuthorizedContactModel;
	@Output() formValidity: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			givenName: new FormControl(''),
			surname: new FormControl(''),
			jobTitle: new FormControl(''),
			email: new FormControl(''),
			day: new FormControl(''),
			month: new FormControl(''),
			year: new FormControl(''),
			areaCode: new FormControl(''),
			phoneNumber: new FormControl(''),
			ext: new FormControl(''),
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
		return this.stepData.surname ? true : false;
	}
}
