import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-security-information',
	template: `
		<section class="step-section pt-4 pb-5">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<div class="title mb-5">Confirm the following information related to your security screening:</div>
					<div class="row">
						<div class="offset-md-2 col-md-4 col-sm-12">
							<mat-form-field>
								<mat-label>Requesting Organization</mat-label>
								<input matInput formControlName="organizationName" />
							</mat-form-field>
						</div>
						<div class="col-md-4 col-sm-12">
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
						<div class="offset-md-2 col-md-8 col-sm-12">
							<mat-form-field>
								<mat-label>Organization Address</mat-label>
								<input matInput formControlName="organizationAddress" />
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="offset-md-2 col-md-4 col-sm-12">
							<mat-form-field>
								<mat-label>Job Title</mat-label>
								<input matInput formControlName="jobTitle" />
							</mat-form-field>
						</div>
						<div class="col-md-4 col-sm-12">
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
export class SecurityInformationComponent {
	form: FormGroup = this.formBuilder.group({
		organizationName: new FormControl('Sunshine Daycare'),
		organizationPhoneNumber: new FormControl('2503859988'),
		organizationAddress: new FormControl('760 Vernon Ave, Victoria, BC V8X 2W6, Canada'),
		jobTitle: new FormControl('Teacher'),
		vulnerableSectorCategory: new FormControl('Division Pulled From Organization Type'),
	});

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form.disable();
	}
}
