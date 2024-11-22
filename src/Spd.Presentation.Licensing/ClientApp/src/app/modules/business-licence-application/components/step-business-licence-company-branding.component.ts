import { Component, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';

@Component({
	selector: 'app-step-business-licence-company-branding',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-8 col-xl-8 col-lg-12 mx-auto">
						<app-alert type="warning" icon="warning">
							{{ info }}
						</app-alert>

						<div *ngIf="!isNoLogoOrBranding" @showHideTriggerSlideAnimation>
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
						</div>
						<mat-divider class="my-4"></mat-divider>

						<mat-checkbox formControlName="noLogoOrBranding">I don’t have a logo or any branding</mat-checkbox>

						<div class="mt-3" *ngIf="isNoLogoOrBranding">
							<app-alert type="info" icon="info">SPD will follow-up</app-alert>
						</div>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class StepBusinessLicenceCompanyBrandingComponent implements LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';
	info = '';

	isRenewalOrUpdate!: boolean;

	form = this.businessApplicationService.companyBrandingFormGroup;

	accept = ['.jpeg', '.jpg', '.tif', '.tiff', '.png'].join(', ');

	private _applicationTypeCode: ApplicationTypeCode | null = null;
	@Input()
	set applicationTypeCode(data: ApplicationTypeCode) {
		if (data == null) {
			this._applicationTypeCode = null;
			return;
		}

		this._applicationTypeCode = data;

		this.isRenewalOrUpdate = this.businessApplicationService.isRenewalOrUpdate(this._applicationTypeCode);

		if (this.isRenewalOrUpdate) {
			this.title = "Confirm your business' branding";
			this.subtitle = 'Update any information that has changed since your last application';
			this.info =
				"If there been changes to your business' uniforms, insignia, logos, vehicle marking, or advertising, add and remove any examples of business branding that are no longer being used.";
		} else {
			this.title = 'Provide examples of company branding';
			this.subtitle =
				'Provide drawings or photos of any uniforms, insignia, logos, vehicle marking, or advertising you plan on using for your security business. Security Programs Division must review and approve these before your licence will be issued.';
			this.info =
				'We recommend you do not finalize any branding, marketing or advertising until your licence is approved.';
		}
	}
	get applicationTypeCode(): ApplicationTypeCode | null {
		return this._applicationTypeCode;
	}

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	onFileUploaded(file: File): void {
		this.businessApplicationService.hasValueChanged = true;

		if (!this.businessApplicationService.isAutoSave()) {
			return;
		}

		this.businessApplicationService.addUploadDocument(LicenceDocumentTypeCode.BizBranding, file).subscribe({
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
