import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-mdra-business-owner',
	template: `
		<app-step-section title="Business owner" subtitle="Provide the business owner information.">
			<div class="row">
				<div class="col-xxl-9 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Given Name(s)</mat-label>
									<input matInput formControlName="bizOwnerGivenNames" maxlength="100" />
								</mat-form-field>
							</div>

							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Surname</mat-label>
									<input matInput formControlName="bizOwnerSurname" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="form.get('bizOwnerSurname')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>

							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Email Address</mat-label>
									<input
										matInput
										formControlName="bizEmailAddress"
										[errorStateMatcher]="matcher"
										placeholder="name@domain.com"
										maxlength="75"
									/>
									<mat-error *ngIf="form.get('bizEmailAddress')?.hasError('required')"> This is required </mat-error>
									<mat-error *ngIf="form.get('bizEmailAddress')?.hasError('email')">
										Must be a valid email address
									</mat-error>
								</mat-form-field>
							</div>

							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Phone Number <span class="optional-label">(optional)</span></mat-label>
									<input
										matInput
										formControlName="bizPhoneNumber"
										[mask]="phoneMask"
										[showMaskTyped]="false"
										[errorStateMatcher]="matcher"
									/>
									<mat-error *ngIf="form.get('bizPhoneNumber')?.hasError('mask')">This must be 10 digits</mat-error>
								</mat-form-field>
							</div>

							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Legal Business Name</mat-label>
									<input matInput formControlName="bizLegalName" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="form.get('bizLegalName')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>

							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label
										>Trade or 'Doing Business As' Name <span class="optional-label">(optional)</span></mat-label
									>
									<input matInput formControlName="bizTradeName" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-hint>This is the name commonly used to refer to your business</mat-hint>
								</mat-form-field>
							</div>
						</div>
					</form>
					<mat-divider class="mb-4 mt-3"></mat-divider>

					<div class="text-minor-heading my-2">Upload valid business licence documents</div>

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
								(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
								form.get('attachments')?.invalid &&
								form.get('attachments')?.hasError('required')
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
export class StepMdraBusinessOwnerComponent implements LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	phoneMask = SPD_CONSTANTS.phone.displayMask;

	form = this.metalDealersApplicationService.businessOwnerFormGroup;

	constructor(private metalDealersApplicationService: MetalDealersApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFileUploaded(_file: File): void {
		this.metalDealersApplicationService.hasValueChanged = true;
	}

	onFileRemoved(): void {
		this.metalDealersApplicationService.hasValueChanged = true;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
