import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BusinessApplicationService } from '../../services/business-application.service';
import { LicenceChildStepperStepComponent } from '../../services/licence-application.helper';

@Component({
	selector: 'app-step-business-licence-company-branding',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Provide examples of company branding"
					subtitle="Provide drawings or photos of any uniforms, insignia, logos, vehicle marking, or advertising you plan on using for your security business. Security Program Division must review and approve these before your licence will be issued."
				></app-step-title>

				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="col-xxl-8 col-xl-8 col-lg-12 mx-auto">
							<app-alert type="warning" icon="warning">
								We recommend you do not finalize any branding, marketing or advertising until your licence is approved.
							</app-alert>

							<ng-container *ngIf="!isNoLogoOrBranding">
								<div class="text-minor-heading mb-2">Upload examples</div>

								<app-file-upload
									(fileUploaded)="onFileUploaded($event)"
									(fileRemoved)="onFileRemoved()"
									[control]="attachments"
									[maxNumberOfFiles]="10"
									[files]="attachments.value"
									[accept]="accept"
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

								<mat-divider class="my-4"></mat-divider>
							</ng-container>

							<mat-checkbox formControlName="noLogoOrBranding"> I don’t have a logo or any branding </mat-checkbox>
						</div>
					</div>
				</form>
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceCompanyBrandingComponent implements LicenceChildStepperStepComponent {
	form = this.businessApplicationService.companyBrandingFormGroup;

	accept = ['.jpeg', '.jpg', '.tif', '.tiff', '.png'].join(', ');

	constructor(private businessApplicationService: BusinessApplicationService) {}

	onFileUploaded(_file: File): void {
		// TODO upload file on partial save
		this.businessApplicationService.hasValueChanged = true;

		if (this.businessApplicationService.isAutoSave()) {
			// this.businessApplicationService.addUploadDocument(LicenceDocumentTypeCode.xxx, file).subscribe({
			// 	next: (resp: any) => {
			// 		const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
			// 		matchingFile.documentUrlId = resp.body[0].documentUrlId;
			// 	},
			// 	error: (error: any) => {
			// 		console.log('An error occurred during file upload', error);
			// 		this.hotToastService.error('An error occurred during the file upload. Please try again.');
			// 		this.fileUploadComponent.removeFailedFile(file);
			// 	},
			// });
		}
	}

	onFileRemoved(): void {
		// this.permitApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
	get isNoLogoOrBranding(): boolean {
		return this.form.get('noLogoOrBranding')?.value ?? false;
	}
}
