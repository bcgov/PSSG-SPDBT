import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import {
	LicenceApplicationService,
	LicenceFormStepComponent,
	LicenceModelSubject,
} from '../licence-application.service';

@Component({
	selector: 'app-contact-information',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="Provide your contact Information"></app-step-title>
				<div class="step-container row">
					<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<div class="row">
								<div class="col-md-6 col-sm-12">
									<mat-form-field>
										<mat-label>Email Address</mat-label>
										<input
											matInput
											formControlName="contactEmailAddress"
											placeholder="name@domain.com"
											maxlength="75"
										/>
										<mat-error *ngIf="form.get('contactEmailAddress')?.hasError('required')">
											This is required
										</mat-error>
										<mat-error *ngIf="form.get('contactEmailAddress')?.hasError('email')">
											Must be a valid email address
										</mat-error>
									</mat-form-field>
								</div>
								<div class="col-md-6 col-sm-12">
									<mat-form-field>
										<mat-label>Phone Number</mat-label>
										<input matInput formControlName="contactPhoneNumber" [mask]="phoneMask" [showMaskTyped]="true" />
										<mat-error *ngIf="form.get('contactPhoneNumber')?.hasError('required')">This is required</mat-error>
										<mat-error *ngIf="form.get('contactPhoneNumber')?.hasError('mask')"
											>This must be 10 digits</mat-error
										>
									</mat-form-field>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class ContactInformationComponent implements OnInit, OnDestroy, LicenceFormStepComponent {
	private licenceModelLoadedSubscription!: Subscription;

	// matcher = new FormErrorStateMatcher();
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	form: FormGroup = this.formBuilder.group({
		contactEmailAddress: new FormControl('', [Validators.required, FormControlValidators.email]),
		contactPhoneNumber: new FormControl('', [Validators.required]),
	});

	constructor(private formBuilder: FormBuilder, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: LicenceModelSubject) => {
				if (loaded.isLoaded) {
					this.form.patchValue({
						contactEmailAddress: this.licenceApplicationService.licenceModel.contactEmailAddress,
						contactPhoneNumber: this.licenceApplicationService.licenceModel.contactPhoneNumber,
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
}
