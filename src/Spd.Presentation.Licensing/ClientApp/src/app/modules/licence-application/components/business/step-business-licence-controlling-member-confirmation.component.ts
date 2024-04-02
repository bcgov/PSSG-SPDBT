import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';

@Component({
	selector: 'app-step-business-licence-controlling-member-confirmation',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Confirm the list of controlling members for this security business"></app-step-title>

				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<div class="summary-heading mb-2">Current members with active security worker licences</div>
							<div class="row">
								<div class="col-6">Nav Singh</div>
								<div class="col-6">E1234398</div>
								<div class="col-6">John Lee</div>
								<div class="col-6">E5627844</div>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<mat-divider class="my-3 mat-divider-primary"></mat-divider>
							<div class="summary-heading mb-2">Current members without active security worker licences</div>
							<div class="row">
								<div class="col-12">Sammy Jung</div>
								<div class="col-12">Gerhart Lang</div>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<mat-divider class="my-3 mat-divider-primary"></mat-divider>
							<div class="summary-heading mb-2">Members who require criminal record checks</div>
							<p>
								A link to an online application form will be sent to each controlling member via email. They must
								provide personal information and consent to a criminal record check. We must receive criminal record
								check consent forms from each individual listed here before the business licence application will be
								reviewed.
							</p>
							<div class="row">
								<div class="col-6">Sammy Jung</div>
								<div class="col-6">Sammy.Jung&#64;hotmail.com</div>
								<div class="col-6">Gerhart Lang</div>
								<div class="col-6">Manual Form</div>
							</div>
						</div>
					</div>

					<div class="row mt-2">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<mat-divider class="mat-divider-main my-3"></mat-divider>
							<div class="mb-2">
								Upload a copy of the corporate registry documents for your business in the province in which you are
								originally registered
							</div>
							<app-file-upload
								(fileUploaded)="onFileUploaded($event)"
								(fileRemoved)="onFileRemoved()"
								[control]="attachments"
								[maxNumberOfFiles]="5"
								[files]="attachments.value"
							></app-file-upload>
						</div>
					</div>
				</form>
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceControllingMemberConfirmationComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.businessApplicationService.membersConfirmationFormGroup;

	constructor(private formBuilder: FormBuilder, private businessApplicationService: BusinessApplicationService) {}

	onFileUploaded(_file: File): void {
		// 	this.permitApplicationService.addUploadDocument(LicenceDocumentTypeCode.ProofOfFingerprint, file).subscribe({
		// 		next: (resp: any) => {
		// 			const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
		// 			matchingFile.documentUrlId = resp.body[0].documentUrlId;
		// 		},
		// 		error: (error: any) => {
		// 			console.log('An error occurred during file upload', error);
		// 			this.hotToastService.error('An error occurred during the file upload. Please try again.');
		// 			this.fileUploadComponent.removeFailedFile(file);
		// 		},
		// 	});
	}

	onFileRemoved(): void {
		this.businessApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		// this.form.markAllAsTouched();
		// return this.form.valid;
		return true;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
