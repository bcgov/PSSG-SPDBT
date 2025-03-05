import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';

@Component({
	selector: 'app-business-category-security-guard',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="text-minor-heading lh-base mt-3 mb-2">
					Do you want to request authorization to use dogs for the purpose of security work?
				</div>
				<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12">
					<mat-radio-group aria-label="Select an option" formControlName="useDogs">
						<div class="d-flex justify-content-start">
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
						</div>
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
				<mat-divider class="mb-3 mt-4 mat-divider-primary"></mat-divider>

				<div class="row mt-2 mb-4">
					<div class="col-12">
						<div class="form-group" formGroupName="dogsPurposeFormGroup">
							<div class="text-minor-heading mb-2">Purpose of using dogs</div>
							<mat-checkbox formControlName="isDogsPurposeProtection"> Protection </mat-checkbox>
							<mat-checkbox formControlName="isDogsPurposeDetectionDrugs"> Detection - Drugs </mat-checkbox>
							<mat-checkbox formControlName="isDogsPurposeDetectionExplosives"> Detection - Explosives </mat-checkbox>
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

				<div class="text-minor-heading my-2">Upload your Security Dog Validation Certificate</div>
				<div class="mb-2">
					<mat-icon style="vertical-align: bottom;">emergency</mat-icon> If you have more than one dog, you must submit
					a certificate for each dog
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
		</form>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class BusinessCategorySecurityGuardComponent implements LicenceChildStepperStepComponent {
	form = this.businessApplicationService.categorySecurityGuardFormGroup;

	booleanTypeCodes = BooleanTypeCode;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFileUploaded(file: File): void {
		this.businessApplicationService.hasValueChanged = true;

		if (!this.businessApplicationService.isAutoSave()) {
			return;
		}

		this.businessApplicationService
			.addUploadDocument(LicenceDocumentTypeCode.BizSecurityDogCertificate, file)
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
		this.businessApplicationService.hasValueChanged = true;
	}

	get useDogs(): FormControl {
		return this.form.get('useDogs') as FormControl;
	}
	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
