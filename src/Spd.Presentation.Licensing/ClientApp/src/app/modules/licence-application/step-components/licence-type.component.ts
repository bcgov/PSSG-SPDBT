import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-licence-type',
	template: `
		<div class="step">
			<app-step-title title="What type of Security Worker Licence are you applying for?"></app-step-title>
			<div class="step-container row">
				<div class="col-xl-6 col-lg-8 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<mat-radio-group aria-label="Select an option" formControlName="licenceType">
							<div class="row">
								<div class="col-lg-4">
									<mat-radio-button class="radio-label" value="N">New</mat-radio-button>
								</div>
								<div class="col-lg-8">
									<app-alert type="info" icon="">
										Apply for a new licence if you've never held this type of licence, or if your exisiting licence has
										expired.
									</app-alert>
								</div>
							</div>
							<mat-divider class="mb-3"></mat-divider>
							<div class="row">
								<div class="col-lg-4">
									<mat-radio-button class="radio-label" value="R">Renewal</mat-radio-button>
								</div>
								<div class="col-lg-8">
									<app-alert type="info" icon=""
										>Renew your existing licence before it expires, within 90 days of the expiry date.
									</app-alert>
								</div>
							</div>
							<mat-divider class="mb-3"></mat-divider>
							<div class="row">
								<div class="col-lg-4">
									<mat-radio-button class="radio-label" value="P">Replacement</mat-radio-button>
								</div>
								<div class="col-lg-8">
									<app-alert type="info" icon="">
										Lost your licence? Request a replacement card and we'll send you one in xx-xx business days.
									</app-alert>
								</div>
							</div>
							<mat-divider class="mb-3"></mat-divider>
							<div class="row">
								<div class="col-lg-4">
									<mat-radio-button class="radio-label" value="U">Update</mat-radio-button>
								</div>
								<div class="col-lg-8">
									<app-alert type="info" icon="">
										Update contact details, licence information, legal name, and more. Some updates require a processing
										fee.
									</app-alert>
								</div>
							</div>
						</mat-radio-group>
					</form>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.radio-label .mdc-label {
				font-size: 1.3em;
				color: var(--color-primary);
			}
		`,
	],
	encapsulation: ViewEncapsulation.None,
})
export class LicenceTypeComponent {
	form: FormGroup = this.formBuilder.group({
		licenceType: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}
}
