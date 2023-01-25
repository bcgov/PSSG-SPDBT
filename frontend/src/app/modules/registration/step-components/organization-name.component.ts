import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { RegistrationFormStepComponent } from '../registration.component';

export class OrganizationNameModel {
	organizationName: string = '';
}

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'app-organization-name',
	template: `
		<form [formGroup]="form">
			<div class="step">
				<div class="title mb-5">Please provide us with more organization information:</div>

				<div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<mat-form-field>
							<input matInput placeholder="Organization Name" formControlName="organizationName" />
							<mat-hint>Please enter your 'Doing Business As' name</mat-hint>
							<img class="icon-size" matPrefix src="/assets/organization-name.png" />
						</mat-form-field>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class OrganizationNameComponent implements OnInit, RegistrationFormStepComponent {
	form!: FormGroup;

	@Input() stepData!: OrganizationNameModel;
	@Output() formValidity: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			organizationName: new FormControl(''),
		});

		this.form.valueChanges.subscribe((_val: any) => {
			this.stepData = this.form.value;
			this.formValidity.emit(this.isFormValid());
		});
	}

	getDataToSave(): OrganizationNameModel {
		return this.stepData;
	}

	isFormValid(): boolean {
		return this.stepData.organizationName ? true : false;
	}
}
