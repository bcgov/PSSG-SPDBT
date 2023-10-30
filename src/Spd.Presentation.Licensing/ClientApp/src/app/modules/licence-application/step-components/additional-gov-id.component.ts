import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GovernmentIssuedPhotoIdTypes } from 'src/app/core/code-types/model-desc.models';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { LicenceApplicationService, LicenceChildStepperStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-additional-gov-id',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="Provide an additional piece of government-issued photo ID"></app-step-title>
				<div class="step-container">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="offset-md-2 col-md-8 col-sm-12">
								<div class="row my-2">
									<div class="col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Select other ID (can be from another country)</mat-label>
											<mat-select formControlName="governmentIssuedPhotoTypeCode">
												<mat-option *ngFor="let item of governmentIssuedPhotoIdTypes" [value]="item.code">
													{{ item.desc }}
												</mat-option>
											</mat-select>
											<mat-error *ngIf="form.get('governmentIssuedPhotoTypeCode')?.hasError('required')">
												This is required
											</mat-error>
										</mat-form-field>
									</div>
									<div class="col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Document Expiry Date</mat-label>
											<input
												matInput
												[matDatepicker]="picker"
												formControlName="governmentIssuedPhotoExpiryDate"
												[errorStateMatcher]="matcher"
											/>
											<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
											<mat-datepicker #picker startView="multi-year"></mat-datepicker>
											<mat-error *ngIf="form.get('governmentIssuedPhotoExpiryDate')?.hasError('required')">
												This is required
											</mat-error>
										</mat-form-field>
									</div>
								</div>
								<div class="row mb-2">
									<div class="col-12">
										<div class="text-minor-heading fw-normal mb-2">Upload a photo of your ID:</div>
										<app-file-upload
											(filesChanged)="onFilesChanged()"
											[maxNumberOfFiles]="1"
											[control]="attachments"
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
						</div>
					</form>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class AdditionalGovIdComponent implements LicenceChildStepperStepComponent {
	governmentIssuedPhotoIdTypes = GovernmentIssuedPhotoIdTypes;

	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.licenceApplicationService.govIssuedIdFormGroup;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	onFilesChanged(): void {
		this.licenceApplicationService.hasDocumentsChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
