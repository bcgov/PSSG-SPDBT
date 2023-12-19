import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { LicenceDocumentTypeCode } from 'src/app/api/models';
import { showHideTriggerAnimation, showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { LicenceChildStepperStepComponent } from '../../../services/licence-application.helper';
import { LicenceApplicationService } from '../../../services/licence-application.service';

@Component({
	selector: 'app-step-dogs-authorization',
	template: `
		<section [ngClass]="isCalledFromModal ? 'step-section-modal' : 'step-section'">
			<div class="step">
				<app-step-title
					*ngIf="!isCalledFromModal"
					title="Do you want to request authorization to use dogs?"
				></app-step-title>
				<div class="step-container">
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

								<div class="row mt-2">
									<div class="col-12">
										<div class="form-group" formGroupName="dogsPurposeFormGroup">
											<div class="text-minor-heading my-2">I request authorization to use dogs for the purpose of:</div>
											<mat-checkbox formControlName="isDogsPurposeProtection"> Protection </mat-checkbox>
											<mat-checkbox formControlName="isDogsPurposeDetectionDrugs"> Detection - Drugs </mat-checkbox>
											<mat-checkbox formControlName="isDogsPurposeDetectionExplosives">
												Detection - Explosives
											</mat-checkbox>
											<mat-error
												class="mat-option-error"
												*ngIf="
													(form.get('dogsPurposeFormGroup')?.dirty || form.get('dogsPurposeFormGroup')?.touched) &&
													form.get('dogsPurposeFormGroup')?.invalid &&
													form.get('dogsPurposeFormGroup')?.hasError('atLeastOneCheckboxValidator')
												"
												>At least one option must be selected</mat-error
											>
										</div>
									</div>
								</div>

								<!-- Your Security Dog Validation Certificate has expired. Please upload your new proof of qualification. -->

								<div class="text-minor-heading mt-4 mb-2">Upload your proof of qualification:</div>

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
			</div>
		</section>
	`,
	styles: [],
	animations: [showHideTriggerAnimation, showHideTriggerSlideAnimation],
})
export class StepDogsAuthorizationComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.licenceApplicationService.dogsAuthorizationFormGroup;

	@Input() isCalledFromModal = false;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(
		private authenticationService: AuthenticationService,
		private hotToastService: HotToastService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		if (this.isCalledFromModal) {
			this.form.patchValue({
				useDogs: BooleanTypeCode.Yes,
			});
		}
	}

	onFileUploaded(file: File): void {
		if (this.authenticationService.isLoggedIn()) {
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

	get isDogPurposesGroup(): boolean {
		const dogsPurposeFormGroup = this.form.get('dogsPurposeFormGroup') as FormGroup;
		return (
			(dogsPurposeFormGroup.get('isDogsPurposeProtection') as FormControl).value ||
			(dogsPurposeFormGroup.get('isDogsPurposeDetectionDrugs') as FormControl).value ||
			(dogsPurposeFormGroup.get('isDogsPurposeDetectionExplosives') as FormControl).value
		);
	}
}
