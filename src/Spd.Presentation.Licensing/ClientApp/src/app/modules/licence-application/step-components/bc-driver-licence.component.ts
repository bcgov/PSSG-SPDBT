import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BooleanTypeCode } from 'src/app/api/models';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import {
	LicenceApplicationService,
	LicenceFormStepComponent,
	LicenceModelSubject,
} from '../licence-application.service';

@Component({
	selector: 'app-bc-driver-licence',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title
					title="Do you have a BC Driver's Licence?"
					subtitle="Providing your driver's licence number will speed up processing times"
				></app-step-title>
				<div class="step-container">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group aria-label="Select an option" formControlName="hasBcDriversLicence">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-divider class="my-2"></mat-divider>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('hasBcDriversLicence')?.dirty || form.get('hasBcDriversLicence')?.touched) &&
										form.get('hasBcDriversLicence')?.invalid &&
										form.get('hasBcDriversLicence')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>

						<div
							class="row mt-4"
							*ngIf="hasBcDriversLicence.value == booleanTypeCodes.Yes"
							@showHideTriggerSlideAnimation
						>
							<div class="offset-md-2 col-md-8 col-sm-12">
								<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
								<div class="row mt-2">
									<div class="col-lg-6 col-md-12 col-sm-12 mx-auto">
										<mat-form-field>
											<mat-label>BC Drivers Licence <span class="optional-label">(optional)</span></mat-label>
											<input matInput formControlName="bcDriversLicenceNumber" mask="00000009" />
											<mat-error *ngIf="form.get('bcDriversLicenceNumber')?.hasError('mask')">
												This must be 7 or 8 digits
											</mat-error>
										</mat-form-field>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class BcDriverLicenceComponent implements OnInit, OnDestroy, LicenceFormStepComponent {
	private licenceModelLoadedSubscription!: Subscription;

	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.formBuilder.group({
		hasBcDriversLicence: new FormControl(null, [FormControlValidators.required]),
		bcDriversLicenceNumber: new FormControl(),
	});

	constructor(private formBuilder: FormBuilder, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: LicenceModelSubject) => {
				if (loaded.isLoaded) {
					this.form.patchValue({
						hasBcDriversLicence: this.licenceApplicationService.licenceModel.hasBcDriversLicence,
						bcDriversLicenceNumber: this.licenceApplicationService.licenceModel.bcDriversLicenceNumber,
					});
				}
			},
		});
	}

	ngOnDestroy() {
		this.licenceModelLoadedSubscription.unsubscribe();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	getDataToSave(): any {
		return this.form.value;
	}

	get hasBcDriversLicence(): FormControl {
		return this.form.get('hasBcDriversLicence') as FormControl;
	}
}
