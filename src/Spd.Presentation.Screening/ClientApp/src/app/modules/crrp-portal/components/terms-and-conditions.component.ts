import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-terms-and-conditions',
	template: `
		<app-crrp-header></app-crrp-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-lg-8">
					<h2 class="fw-normal">Terms and Conditions</h2>
					<form [formGroup]="form" novalidate>
						<app-terms-text></app-terms-text>
						<div class="row">
							<div class="col-12">
								<mat-checkbox formControlName="readTerms">
									I have read and accept the above Terms of Use.
								</mat-checkbox>
							</div>
							<h3 class="subheading fw-normal my-3">
								Terms and Conditions for use of the Organization’s Online Service Portal (the “Site”) in an Authorized
								Contact Role:
							</h3>
							<div class="col-12">
								<mat-checkbox formControlName="check1">
									I understand that as an Authorized Contact, and on behalf of the Organization I represent, I am
									responsible for facilitating the criminal record check process for individuals working with or
									applying to work with children and/or vulnerable adults.
								</mat-checkbox>
							</div>
							<div class="col-12">
								<mat-checkbox formControlName="check2">
									I understand that as an Authorized Contact, and on behalf of the Organization I represent, I am
									responsible for verifying and confirming the identity of every applicant who submits a consent to a
									criminal record check manually or via webform.
								</mat-checkbox>
							</div>
							<div class="col-12">
								<mat-checkbox formControlName="check3">
									I understand that as an Authorized Contact, and on behalf of the Organization I represent, I am
									responsible for retaining all originally signed criminal record check consent forms that are submitted
									manually, for a minimum of 5 (five) years after their submission. The Criminal Records Review Program
									may request a copy of the signed consent form(s) at any time.
								</mat-checkbox>
							</div>
							<div class="col-12">
								<mat-checkbox formControlName="check4">
									I understand that should I leave the Organization I represent, my access to the Site as an Authorized
									Contact is immediately terminated.
								</mat-checkbox>
							</div>
							<div class="col-12">
								<mat-checkbox formControlName="check5">
									I understand that my misuse of the Site, or disregard for any of these Terms and Conditions, may
									result in suspension or cancellation of any or all services available to theOrganization I represent.
								</mat-checkbox>
							</div>
						</div>
					</form>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.mat-mdc-checkbox.mat-mdc-checkbox-disabled label {
				color: black;
			}
		`,
	],
	encapsulation: ViewEncapsulation.None,
})
export class TermsAndConditionsComponent {
	form: FormGroup = this.formBuilder.group({
		readTerms: new FormControl({ value: true, disabled: true }),
		check1: new FormControl({ value: true, disabled: true }),
		check2: new FormControl({ value: true, disabled: true }),
		check3: new FormControl({ value: true, disabled: true }),
		check4: new FormControl({ value: true, disabled: true }),
		check5: new FormControl({ value: true, disabled: true }),
	});

	constructor(private formBuilder: FormBuilder) {}
}
