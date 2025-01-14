import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-metal-dealers-business-information',
	template: `
		<app-step-section title="Business Information" subtitle="Provide the business owner and manager information">
			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="businessOwnerFormGroup" novalidate>
						<div class="row">
							<div class="text-minor-heading mb-3">Business Owner</div>
							<div class="col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Owner's Given Name <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
								</mat-form-field>
							</div>

							<div class="col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Owner's Middle Name <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="middleName" maxlength="40" />
								</mat-form-field>
							</div>

							<div class="col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Owner's Surname</mat-label>
									<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="businessOwnerFormGroup.get('surname')?.hasError('required')">
										This is required
									</mat-error>
								</mat-form-field>
							</div>

							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Legal Business Name</mat-label>
									<input matInput formControlName="legalBusinessName" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="businessOwnerFormGroup.get('legalBusinessName')?.hasError('required')">
										This is required
									</mat-error>
								</mat-form-field>
							</div>
							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Trade Name or "doing business as" Name</mat-label>
									<input matInput formControlName="tradeName" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="businessOwnerFormGroup.get('tradeName')?.hasError('required')">
										This is required
									</mat-error>
								</mat-form-field>
							</div>
						</div>
					</form>
					<mat-divider class="mb-4 mt-3 mat-divider-primary"></mat-divider>

					<form [formGroup]="businessManagerFormGroup" novalidate>
						<div class="row">
							<div class="text-minor-heading mb-3">Business Manager</div>
							<div class="fw-semibold fs-6 mb-3">
								The Business Manager is the person responsible for the day to day management of the business.
							</div>

							<div class="col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Manager's Given Name <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
								</mat-form-field>
							</div>

							<div class="col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Manager's Middle Name <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="middleName" maxlength="40" />
								</mat-form-field>
							</div>

							<div class="col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Manager's Surname</mat-label>
									<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="businessManagerFormGroup.get('surname')?.hasError('required')">
										This is required
									</mat-error>
								</mat-form-field>
							</div>

							<div class="col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Manager's Phone Number</mat-label>
									<input
										matInput
										formControlName="phoneNumber"
										[errorStateMatcher]="matcher"
										[mask]="phoneMask"
										[showMaskTyped]="false"
									/>
									<mat-error *ngIf="businessManagerFormGroup.get('phoneNumber')?.hasError('required')"
										>This is required</mat-error
									>
									<mat-error *ngIf="businessManagerFormGroup.get('phoneNumber')?.hasError('mask')"
										>This must be 10 digits</mat-error
									>
								</mat-form-field>
							</div>

							<div class="col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Manager's Email Address <span class="optional-label">(if any)</span></mat-label>
									<input
										matInput
										formControlName="emailAddress"
										[errorStateMatcher]="matcher"
										placeholder="name@domain.com"
										maxlength="75"
									/>
									<mat-error *ngIf="businessManagerFormGroup.get('emailAddress')?.hasError('email')">
										Must be a valid email address
									</mat-error>
								</mat-form-field>
							</div>
						</div>
					</form>
					<mat-divider class="mb-4 mt-3 mat-divider-primary"></mat-divider>

					<div class="text-minor-heading my-2">Upload your valid business licence documents</div>

					<div class="my-2">
						<app-file-upload
							(fileUploaded)="onFileUploaded($event)"
							(fileRemoved)="onFileRemoved()"
							[control]="attachments"
							[maxNumberOfFiles]="10"
							[files]="attachments.value"
						></app-file-upload>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(businessOwnerFormGroup.get('attachments')?.dirty ||
									businessOwnerFormGroup.get('attachments')?.touched) &&
								businessOwnerFormGroup.get('attachments')?.invalid &&
								businessOwnerFormGroup.get('attachments')?.hasError('required')
							"
							>This is required</mat-error
						>
					</div>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepMetalDealersBusinessInformationComponent implements LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	phoneMask = SPD_CONSTANTS.phone.displayMask;

	businessOwnerFormGroup = this.metalDealersApplicationService.businessOwnerFormGroup;
	businessManagerFormGroup = this.metalDealersApplicationService.businessManagerFormGroup;

	constructor(private metalDealersApplicationService: MetalDealersApplicationService) {}

	isFormValid(): boolean {
		this.businessOwnerFormGroup.markAllAsTouched();
		this.businessManagerFormGroup.markAllAsTouched();
		return this.businessOwnerFormGroup.valid && this.businessManagerFormGroup.valid;
	}

	onFileUploaded(_file: File): void {
		// this.metalDealersApplicationService.hasValueChanged = true;
	}

	onFileRemoved(): void {
		// this.metalDealersApplicationService.hasValueChanged = true;
	}

	get attachments(): FormControl {
		return this.businessOwnerFormGroup.get('attachments') as FormControl;
	}
}
