import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-metal-dealers-business-owner',
	template: `
		<app-step-section title="Business Owner" subtitle="Provide the business owner information.">
			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Given Name <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="givenName" maxlength="40" />
								</mat-form-field>
							</div>

							<div class="col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Middle Name <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="middleName" maxlength="40" />
								</mat-form-field>
							</div>

							<div class="col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Surname</mat-label>
									<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="form.get('surname')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>

							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Legal Business Name</mat-label>
									<input matInput formControlName="legalBusinessName" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="form.get('legalBusinessName')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>
							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Trade or 'Doing Business As' Name</mat-label>
									<input matInput formControlName="tradeName" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-hint>This is the name commonly used to refer to your business</mat-hint>
									<mat-error *ngIf="form.get('tradeName')?.hasError('required')"> This is required </mat-error>
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
export class StepMetalDealersBusinessOwnerComponent implements LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	form = this.metalDealersApplicationService.businessOwnerFormGroup;

	constructor(private metalDealersApplicationService: MetalDealersApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFileUploaded(_file: File): void {
		// this.metalDealersApplicationService.hasValueChanged = true;
	}

	onFileRemoved(): void {
		// this.metalDealersApplicationService.hasValueChanged = true;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
