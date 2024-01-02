import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription } from 'rxjs';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';

@Component({
	selector: 'app-step-access-code-authorized',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6">
							<h2 class="fs-3 mb-3">Link a Licence or Permit</h2>
						</div>

						<div class="col-xl-6 col-lg-4 col-md-4 col-sm-6">
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
					</div>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<app-alert type="info" icon="">
						<p>
							You need both <strong>your licence number</strong> as it appears on your current licence, plus the
							<strong>access code number</strong>
							provided following your initial security worker application or in your renewal letter from the Registrar,
							Security Services. Enter the two numbers below then click 'Link' to continue.
						</p>
						<p>
							If you do not know your access code, you may call Security Program's Licensing Unit during regular office
							hours and answer identifying questions to get your access code: 1-855-587-0185.
						</p>
					</app-alert>

					<form [formGroup]="form" novalidate>
						<div class="row mt-4">
							<div class="offset-xxl-1 col-xxl-4 offset-xl-1 col-xl-4 col-lg-4 col-md-12">
								<mat-form-field>
									<mat-label>Current Licence Number</mat-label>
									<input matInput formControlName="currentLicenceNumber" [errorStateMatcher]="matcher" maxlength="10" />
									<mat-error *ngIf="form.get('currentLicenceNumber')?.hasError('required')">
										This is required
									</mat-error>
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-4 col-lg-4 col-md-12">
								<mat-form-field>
									<mat-label>Access Code</mat-label>
									<input matInput formControlName="accessCode" [errorStateMatcher]="matcher" />
									<mat-error *ngIf="form.get('accessCode')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>
							<div class="col-xxl-2 col-xl-2 col-lg-4 col-md-12">
								<button mat-flat-button color="primary" class="large mt-2" (click)="onLink()">
									<mat-icon>link</mat-icon>Link
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepAccessCodeAuthorizedComponent implements OnInit, OnDestroy, LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	isAuthenticated = this.authProcessService.waitUntilAuthentication$;
	authenticationSubscription!: Subscription;

	form: FormGroup = this.formBuilder.group({
		currentLicenceNumber: new FormControl(null, [FormControlValidators.required]),
		accessCode: new FormControl(null, [FormControlValidators.required]),
	});

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private authProcessService: AuthProcessService,
		private hotToastService: HotToastService
	) {}

	async ngOnInit(): Promise<void> {
		this.authProcessService.logoutBceid();

		await this.authProcessService.initializeLicencingBCSC();

		this.authenticationSubscription = this.authProcessService.waitUntilAuthentication$.subscribe();
	}

	ngOnDestroy() {
		if (this.authenticationSubscription) this.authenticationSubscription.unsubscribe();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onLink(): void {
		const isValid = this.isFormValid();
		if (!isValid) return;

		this.hotToastService.success('The licence or permit has been successfully linked to your account');
		this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
	}

	onBack(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
	}
}
