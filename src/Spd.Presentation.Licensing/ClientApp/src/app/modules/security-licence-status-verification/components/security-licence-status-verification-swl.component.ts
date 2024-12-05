import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { SecurityLicenceStatusVerificationRoutes } from '../security-licence-status-verification-routes';

@Component({
	selector: 'app-security-licence-status-verification-swl',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-11 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-8 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">Verify a Security Worker Licence</h2>
						</div>

						<div class="col-xl-4 col-lg-4 col-md-12">
							<div class="d-flex justify-content-end">
								<button
									mat-stroked-button
									color="primary"
									class="large w-auto mb-3"
									aria-label="Back"
									(click)="onBack()"
								>
									<mat-icon>arrow_back</mat-icon>Back
								</button>
							</div>
						</div>
						<div class="col-12 mb-3">
							<app-alert type="info" icon="">
								Enter a security worker licence number, or the full name as it appears on the licence, below. The
								results page will confirm if the licence number is valid and the name of the licensee.
							</app-alert>
						</div>
					</div>

					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Worker Licence Number</mat-label>
									<input matInput formControlName="workerLicenceNumber" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="form.get('workerLicenceNumber')?.hasError('required')">
										This is required
									</mat-error>
								</mat-form-field>
							</div>
						</div>

						<div class="text-minor-heading text-red mt-3 mb-4">OR</div>

						<div class="row">
							<div class="col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>First Name</mat-label>
									<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="form.get('givenName')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>

							<div class="col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Last Name</mat-label>
									<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="form.get('surname')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>
						</div>
					</form>

					<div class="row mb-4">
						<div class="offset-md-8 col-md-4 col-sm-12 text-end">
							<button mat-flat-button color="primary" class="large w-auto" (click)="onSubmit()">Submit</button>
						</div>
					</div>

					<mat-divider class="mat-divider-main mb-3"></mat-divider>
					<div class="text-minor-heading my-3">Search Results</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.text-red {
				color: var(--color-red) !important;
			}
		`,
	],
})
export class SecurityLicenceStatusVerificationSwlComponent {
	form = this.formBuilder.group({
		workerLicenceNumber: new FormControl('', [FormControlValidators.required]),
		givenName: new FormControl('', [FormControlValidators.required]),
		surname: new FormControl('', [FormControlValidators.required]),
	});

	matcher = new FormErrorStateMatcher();

	constructor(
		private router: Router,
		private formBuilder: FormBuilder
	) {}

	onBack(): void {
		this.router.navigateByUrl(SecurityLicenceStatusVerificationRoutes.path());
	}

	onSubmit() {
		this.form.markAllAsTouched();
	}
}
