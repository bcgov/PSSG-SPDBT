import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SwlApplicationTypeCode } from 'src/app/core/code-types/model-desc.models';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { LicenceApplicationService } from '../licence-application.service';

@Component({
	selector: 'app-licence-type',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="What type of Security Worker Licence are you applying for?"></app-step-title>
				<div class="step-container row">
					<div class="col-xl-6 col-lg-8 col-md-12 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<mat-radio-group aria-label="Select an option" formControlName="licenceStatusTypeCode">
								<div class="row">
									<div class="col-lg-4">
										<mat-radio-button class="radio-label" [value]="licenceStatusTypeCodes.NewOrExpired"
											>New</mat-radio-button
										>
									</div>
									<div class="col-lg-8">
										<app-alert type="info" icon="">
											Apply for a new licence if you've never held this type of licence, or if your exisiting licence
											has expired.
										</app-alert>
									</div>
								</div>
								<mat-divider class="mb-3"></mat-divider>
								<div class="row">
									<div class="col-lg-4">
										<mat-radio-button class="radio-label" [value]="licenceStatusTypeCodes.Renewal"
											>Renewal</mat-radio-button
										>
									</div>
									<div class="col-lg-8">
										<app-alert type="info" icon="">
											Renew your existing licence before it expires, within 90 days of the expiry date.
										</app-alert>
									</div>
								</div>
								<mat-divider class="mb-3"></mat-divider>
								<div class="row">
									<div class="col-lg-4">
										<mat-radio-button class="radio-label" [value]="licenceStatusTypeCodes.Replacement">
											Replacement
										</mat-radio-button>
									</div>
									<div class="col-lg-8">
										<app-alert type="info" icon="">
											Lost your licence? Request a replacement card and we'll send you one.
										</app-alert>
									</div>
								</div>
								<mat-divider class="mb-3"></mat-divider>
								<div class="row">
									<div class="col-lg-4">
										<mat-radio-button class="radio-label" [value]="licenceStatusTypeCodes.Update"
											>Update</mat-radio-button
										>
									</div>
									<div class="col-lg-8">
										<app-alert type="info" icon="">
											Update contact details, legal name, report new criminal charges or convictions, and more. Some
											updates require a processing fee.
										</app-alert>
									</div>
								</div>
							</mat-radio-group>
						</form>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('licenceStatusTypeCode')?.dirty || form.get('licenceStatusTypeCode')?.touched) &&
								form.get('licenceStatusTypeCode')?.invalid &&
								form.get('licenceStatusTypeCode')?.hasError('required')
							"
							>An option must be selected</mat-error
						>
					</div>
				</div>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext()">Next</button>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class LicenceTypeComponent implements OnInit, OnDestroy {
	private licenceModelLoadedSubscription!: Subscription;

	licenceStatusTypeCodes = SwlApplicationTypeCode;
	isDirtyAndInvalid = false;

	form: FormGroup = this.formBuilder.group({
		licenceStatusTypeCode: new FormControl(null, [Validators.required]),
	});

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		console.log('initialized', this.licenceApplicationService.initialized);
		if (!this.licenceApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.APPLICATIONS_IN_PROGRESS));
		}

		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: boolean) => {
				console.log('loaded', loaded);
				if (loaded) {
					this.form.patchValue({
						licenceStatusTypeCode: this.licenceApplicationService.licenceModel.applicationTypeCode,
					});
				}
			},
		});
	}

	ngOnDestroy() {
		this.licenceModelLoadedSubscription.unsubscribe();
	}

	onStepPrevious(): void {
		this.updateDataToSave();
		this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.LICENCE_SELECTION));
	}

	onStepNext(): void {
		if (this.isFormValid()) {
			this.updateDataToSave();
			this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.APPLICATION));
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	updateDataToSave(): void {
		this.licenceApplicationService.licenceModel.applicationTypeCode = this.form.value.licenceStatusTypeCode;
	}
}
