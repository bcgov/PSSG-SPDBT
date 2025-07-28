import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-mdra-business-owner',
	template: `
		<app-step-section heading="Business owner" [subheading]="subtitle">
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
									@if (form.get('bizOwnerSurname')?.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
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
									@if (form.get('bizEmailAddress')?.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
									@if (form.get('bizEmailAddress')?.hasError('email')) {
										<mat-error>Must be a valid email address</mat-error>
									}
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
									@if (form.get('bizPhoneNumber')?.hasError('mask')) {
										<mat-error>This must be 10 digits</mat-error>
									}
								</mat-form-field>
							</div>

							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Legal Business Name</mat-label>
									<input matInput formControlName="bizLegalName" [errorStateMatcher]="matcher" maxlength="40" />
									@if (form.get('bizLegalName')?.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
								</mat-form-field>
							</div>

							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Trade or 'Doing Business As' Name</mat-label>
									<input matInput formControlName="bizTradeName" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-hint>This is the name commonly used to refer to your business</mat-hint>
									@if (form.get('bizTradeName')?.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
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
						@if (
							(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
							form.get('attachments')?.invalid &&
							form.get('attachments')?.hasError('required')
						) {
							<mat-error class="mat-option-error">This is required</mat-error>
						}
					</div>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepMdraBusinessOwnerComponent implements OnInit, LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	phoneMask = SPD_CONSTANTS.phone.displayMask;

	subtitle = '';
	form = this.metalDealersApplicationService.businessOwnerFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private metalDealersApplicationService: MetalDealersApplicationService) {}

	ngOnInit(): void {
		const isRenewalOrUpdate = this.metalDealersApplicationService.isRenewalOrUpdate();
		this.subtitle = isRenewalOrUpdate
			? 'Confirm your business owner information'
			: 'Provide the business owner information';
	}
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
