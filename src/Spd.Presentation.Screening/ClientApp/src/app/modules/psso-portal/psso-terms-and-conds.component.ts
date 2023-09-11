import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { AuthUserIdirService } from 'src/app/core/services/auth-user-idir.service';
import { UtilService } from 'src/app/core/services/util.service';
import { PssoRoutes } from './psso-routing.module';

@Component({
	selector: 'app-psso-terms-and-conds',
	template: `
		<div class="container" *ngIf="isAuthenticated | async">
			<section class="step-section my-4">
				<div class="row m-4">
					<div class="col-lg-8 mx-auto">
						<h3 class="subheading fw-normal my-3">IMPORTANT - PLEASE READ</h3>
						<form [formGroup]="form" novalidate>
							<div class="row mt-4">
								<div class="col-12">
									<div class="mb-3">
										<p>
											As a condition of using this service, I agree that I am responsible for all actions performed by
											my "username", and acknowledge that use of this service is solely for conducting one or more
											criminal record checks subject to the Public Service Agency Screening Policies, and/or usage
											agreement between my employer and the PSSO.
										</p>
										<p>
											PSSO will review audit reports and inappropriate use of this service will be investigated. Misuse
											is subject to disciplinary action, and may include dismissal, cancellation of contract, and/or
											other legal remedies.
										</p>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-12">
									<mat-checkbox formControlName="readTerms" (click)="onCheckboxChange()">
										I have read and accept the above Terms of Use.
									</mat-checkbox>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(form.get('readTerms')?.dirty || form.get('readTerms')?.touched) &&
											form.get('readTerms')?.invalid &&
											form.get('readTerms')?.hasError('required')
										"
										>This is required</mat-error
									>
								</div>
								<div class="col-12 mt-4">
									<mat-form-field class="w-auto" style="background-color: var(--color-grey-lightest);">
										<mat-label>Date Signed</mat-label>
										<input matInput formControlName="dateSigned" />
										<mat-error *ngIf="form.get('dateSigned')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>
							</div>

							<div class="row">
								<div class="col-12">
									<button
										mat-flat-button
										color="primary"
										class="large w-auto  float-end mx-2 my-2"
										(click)="onContinue()"
									>
										Continue
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</section>
		</div>
	`,
	styles: [
		`
			.subheading {
				color: grey;
			}
		`,
	],
})
export class PssoTermsAndCondsComponent implements OnInit {
	isAuthenticated = this.authProcessService.waitUntilAuthentication$;

	form: FormGroup = this.formBuilder.group({
		readTerms: new FormControl(null, [Validators.requiredTrue]),
		dateSigned: new FormControl({ value: null, disabled: true }),
	});

	constructor(
		private formBuilder: FormBuilder,
		protected authUserService: AuthUserIdirService,
		private authProcessService: AuthProcessService,
		private utilService: UtilService,
		private router: Router
	) {}

	ngOnInit(): void {
		if (!this.authUserService.idirUserWhoamiProfile) {
			// Force login
			this.router.navigateByUrl(PssoRoutes.path(PssoRoutes.SCREENING_STATUSES));
		}
	}

	onCheckboxChange(): void {
		const data = this.form.value;
		if (data.readTerms) {
			this.form.controls['dateSigned'].setValue(this.utilService.getDateString(new Date()));
		} else {
			this.form.controls['dateSigned'].setValue('');
		}
	}

	onContinue(): void {
		this.form.markAllAsTouched();
		if (this.form.valid) {
			this.router.navigateByUrl(PssoRoutes.path(PssoRoutes.SCREENING_CHECKS));
		}
	}
}
