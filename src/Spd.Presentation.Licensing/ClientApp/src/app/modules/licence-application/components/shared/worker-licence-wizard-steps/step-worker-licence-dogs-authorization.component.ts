import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { showHideTriggerAnimation, showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
	selector: 'app-step-worker-licence-dogs-authorization',
	template: `
		<section [ngClass]="isCalledFromModal ? 'step-section-modal' : 'step-section'">
			<div class="step">
				<app-step-title
					*ngIf="!isCalledFromModal"
					title="Do you want to request authorization to use dogs?"
				></app-step-title>

				<form [formGroup]="form" novalidate>
					<div class="row" *ngIf="!isCalledFromModal">
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
						<div [ngClass]="isCalledFromModal ? 'col-12' : 'offset-md-2 col-md-8 col-sm-12'">
							<mat-divider class="mb-3 mt-4 mat-divider-primary" *ngIf="!isCalledFromModal"></mat-divider>

							<div class="row mt-2 mb-4">
								<div class="col-12">
									<div class="form-group" formGroupName="dogsPurposeFormGroup">
										<div class="text-minor-heading my-2">Purpose of using dogs</div>
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
											form.hasError('atLeastOneCheckboxWhenReqdValidator')
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
	originalDogAuthorizationExists = false;
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.licenceApplicationService.dogsAuthorizationFormGroup;

	@Input() isCalledFromModal = false;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private hotToastService: HotToastService, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.originalDogAuthorizationExists = this.licenceApplicationService.licenceModelFormGroup.get(
			'originalDogAuthorizationExists'
		)?.value;

		if (this.isCalledFromModal) {
			this.form.patchValue({
				useDogs: BooleanTypeCode.Yes,
			});
		}
	}

	onFileUploaded(file: File): void {
		if (this.licenceApplicationService.isAutoSave()) {
			this.licenceApplicationService
				.addUploadDocument(LicenceDocumentTypeCode.CategorySecurityGuardDogCertificate, file)
				.subscribe({
					next: (resp: any) => {
						const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
						matchingFile.documentUrlId = resp.body[0].documentUrlId;
					},
					error: (error: any) => {
						console.log('An error occurred during file upload', error);
						this.hotToastService.error('An error occurred during the file upload. Please try again.');
						this.fileUploadComponent.removeFailedFile(file);
					},
				});
		}
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

	// get isDogPurposesGroup(): boolean {
	// 	const dogsPurposeFormGroup = this.form.get('dogsPurposeFormGroup') as FormGroup;
	// 	return (
	// 		(dogsPurposeFormGroup.get('isDogsPurposeProtection') as FormControl).value ||
	// 		(dogsPurposeFormGroup.get('isDogsPurposeDetectionDrugs') as FormControl).value ||
	// 		(dogsPurposeFormGroup.get('isDogsPurposeDetectionExplosives') as FormControl).value
	// 	);
	// }
}
