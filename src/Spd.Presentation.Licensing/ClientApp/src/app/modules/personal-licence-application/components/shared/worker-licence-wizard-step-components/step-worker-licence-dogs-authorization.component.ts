import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { showHideTriggerAnimation, showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { LicenceApplicationService } from '@app/modules/personal-licence-application/licence-application.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-worker-licence-dogs-authorization',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Do you want to request authorization to use dogs?"
					[subtitle]="subtitle"
				></app-step-title>

				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
							<mat-radio-group aria-label="Select an option" formControlName="useDogs">
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('useDogs')?.dirty || form.get('useDogs')?.touched) &&
									form.get('useDogs')?.invalid &&
									form.get('useDogs')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</div>

					<div class="row" *ngIf="useDogs.value === booleanTypeCodes.Yes" @showHideTriggerSlideAnimation>
						<div class="offset-md-2 col-md-8 col-sm-12">
							<mat-divider class="mb-3 mt-4 mat-divider-primary"></mat-divider>

							<div class="row mt-2 mb-4">
								<div class="col-12">
									<div class="form-group" formGroupName="dogsPurposeFormGroup">
										<div class="text-minor-heading mb-2">Purpose of using dogs</div>
										<mat-checkbox formControlName="isDogsPurposeProtection"> Protection </mat-checkbox>
										<mat-checkbox formControlName="isDogsPurposeDetectionDrugs"> Detection - Drugs </mat-checkbox>
										<mat-checkbox formControlName="isDogsPurposeDetectionExplosives">
											Detection - Explosives
										</mat-checkbox>
									</div>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(form.get('dogsPurposeFormGroup')?.dirty || form.get('dogsPurposeFormGroup')?.touched) &&
											form.hasError('atLeastOneCheckboxWhenReqd')
										"
										>At least one option must be selected</mat-error
									>
								</div>
							</div>

							<app-alert type="danger" icon="error" *ngIf="originalDogAuthorizationExists">
								Your Security Dog Validation Certificate has expired. Please upload your new proof of qualification.
							</app-alert>

							<div class="text-minor-heading my-2">Upload your Security Dog Validation Certificate</div>
							<div class="mb-2">
								<mat-icon style="vertical-align: bottom;">emergency</mat-icon> If you have more than one dog, you must
								submit a certificate for each dog
							</div>

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
				</form>
			</div>
		</section>
	`,
	styles: [],
	animations: [showHideTriggerAnimation, showHideTriggerSlideAnimation],
})
export class StepWorkerLicenceDogsAuthorizationComponent implements OnInit, LicenceChildStepperStepComponent {
	subtitle = '';

	originalDogAuthorizationExists = false;
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.licenceApplicationService.dogsAuthorizationFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.subtitle = this.isRenewalOrUpdate ? 'Update any information that has changed since your last application' : '';

		this.originalDogAuthorizationExists = this.licenceApplicationService.licenceModelFormGroup.get(
			'originalLicenceData.originalDogAuthorizationExists'
		)?.value;
	}

	onFileUploaded(file: File): void {
		this.licenceApplicationService.hasValueChanged = true;

		if (!this.licenceApplicationService.isAutoSave()) {
			return;
		}

		this.licenceApplicationService
			.addUploadDocument(LicenceDocumentTypeCode.CategorySecurityGuardDogCertificate, file)
			.subscribe({
				next: (resp: any) => {
					const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
					matchingFile.documentUrlId = resp.body[0].documentUrlId;
				},
				error: (error: any) => {
					console.log('An error occurred during file upload', error);

					this.fileUploadComponent.removeFailedFile(file);
				},
			});
	}

	onFileRemoved(): void {
		this.licenceApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get useDogs(): FormControl {
		return this.form.get('useDogs') as FormControl;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
	get isRenewalOrUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal ||
			this.applicationTypeCode === ApplicationTypeCode.Update
		);
	}
}
