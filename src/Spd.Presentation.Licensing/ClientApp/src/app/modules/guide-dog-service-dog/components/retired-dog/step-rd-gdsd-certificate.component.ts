import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-rd-gdsd-certificate',
	template: `
		<app-step-section title="Guide dog or service dog certification">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="text-minor-heading mb-2">Current Certificate #</div>
						<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Certificate #</mat-label>
								<input
									matInput
									formControlName="currentGDSDCertificateNumber"
									[errorStateMatcher]="matcher"
									maxlength="40"
								/>
								<mat-error *ngIf="form.get('currentGDSDCertificateNumber')?.hasError('required')"
									>This is required</mat-error
								>
							</mat-form-field>
						</div>

						<div class="text-minor-heading my-2">Attach your current Guide or Service Dog Certificate</div>
						<app-file-upload
							(fileUploaded)="onFileUploaded($event)"
							(fileRemoved)="onFileRemoved()"
							[control]="attachments"
							[maxNumberOfFiles]="10"
							[files]="attachments.value"
							[previewImage]="true"
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
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepRdGdsdCertficateComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.retiredDogApplicationService.dogGdsdCertificateFormGroup;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private retiredDogApplicationService: RetiredDogApplicationService) {}

	onFileUploaded(file: File): void {
		this.retiredDogApplicationService.fileUploaded(
			LicenceDocumentTypeCode.GdsdCertificate,
			file,
			this.attachments,
			this.fileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.retiredDogApplicationService.fileRemoved();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
