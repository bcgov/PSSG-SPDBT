import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { ScreeningFormStepComponent } from '../scr-application.component';

@Component({
	selector: 'app-security-information',
	template: `
		<section class="step-section pt-4 pb-5 px-3">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<div class="title mb-5">Confirm the following information related to your security screening:</div>
					<div class="row">
						<div class="offset-lg-2 col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Requesting Organization</mat-label>
								<input matInput formControlName="organizationName" />
							</mat-form-field>
						</div>
						<div class="col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Organization Phone Number</mat-label>
								<input
									matInput
									formControlName="organizationPhoneNumber"
									mask="(000) 000-0000"
									[showMaskTyped]="true"
								/>
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="offset-lg-2 col-lg-8 col-md-8 col-sm-12">
							<mat-form-field>
								<mat-label>Organization Address</mat-label>
								<input matInput formControlName="organizationAddress" />
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="offset-lg-2 col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Job Title</mat-label>
								<input matInput formControlName="jobTitle" [errorStateMatcher]="matcher" />
								<mat-error *ngIf="form.get('jobTitle')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
						<div class="col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Vulnerable Sector Category</mat-label>
								<input matInput formControlName="vulnerableSectorCategory" />
							</mat-form-field>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [],
})
export class SecurityInformationComponent implements ScreeningFormStepComponent {
	form: FormGroup = this.formBuilder.group({
		organizationName: new FormControl({ value: 'Sunshine Daycare', disabled: true }),
		organizationPhoneNumber: new FormControl({ value: '2503859988', disabled: true }),
		organizationAddress: new FormControl({ value: '760 Vernon Ave, Victoria, BC V8X 2W6, Canada', disabled: true }),
		jobTitle: new FormControl('', [Validators.required]),
		vulnerableSectorCategory: new FormControl({ value: 'Division Pulled From Organization Type', disabled: true }),
	});
	matcher = new FormErrorStateMatcher();

	constructor(private formBuilder: FormBuilder) {}

	getDataToSave(): any {
		return this.form.value;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
