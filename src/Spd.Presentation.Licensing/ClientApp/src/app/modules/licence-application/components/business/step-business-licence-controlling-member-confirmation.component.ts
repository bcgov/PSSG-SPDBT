import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
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
							<mat-divider class="my-3 mat-divider-primary"></mat-divider>
							<div class="fs-5 mb-2">Current members with active security worker licences</div>
							<div class="row">
								<ng-container *ngFor="let empl of membersWithSwlList; let i = index">
									<div class="col-md-6 col-sm-12 summary-text-data mt-2">{{ empl.licenceHolderName }}</div>
									<div class="col-md-6 col-sm-12 summary-text-data mt-0 mt-md-2">{{ empl.licenceNumber }}</div>
								</ng-container>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<mat-divider class="my-3 mat-divider-primary"></mat-divider>
							<div class="fs-5 mb-2">Members who require criminal record checks</div>
							<p>
								A link to an online application form will be sent to each controlling member via email. They must
								provide personal information and consent to a criminal record check. We must receive criminal record
								check consent forms from each individual listed here before the business licence application will be
								reviewed.
							</p>
							<div class="row">
								<ng-container *ngFor="let empl of membersWithoutSwlList; let i = index">
									<div class="col-md-6 col-sm-12 summary-text-data mt-2">{{ empl.givenName }} {{ empl.surname }}</div>
									<div class="col-md-6 col-sm-12 summary-text-data mt-0 mt-md-2">
										{{ empl.emailAddress }}
										<a
											*ngIf="!empl.emailAddress"
											color="primary"
											class="large"
											aria-label="Download Business Member Auth Consent"
											download="Business Member Auth Consent"
											[href]="downloadFilePath"
											>Manual Form</a
										>
									</div>
								</ng-container>
							</div>
						</div>
					</div>

					<div class="row mt-2">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<mat-divider class="mat-divider-main my-3"></mat-divider>
							<div class="text-minor-heading lh-base mb-2">
								Upload a copy of the corporate registry documents for your business in the province in which you are
								originally registered
							</div>
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
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceControllingMemberConfirmationComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	downloadFilePath = SPD_CONSTANTS.files.businessMemberAuthConsentManualForm;

	form: FormGroup = this.businessApplicationService.membersConfirmationFormGroup;

	controllingMembersFormGroup = this.businessApplicationService.controllingMembersFormGroup;
	employeesFormGroup = this.businessApplicationService.employeesFormGroup;

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
		this.businessApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
	get membersWithSwlList(): Array<any> {
		return this.form.get('membersWithSwl')?.value ?? [];
	}
	get membersWithoutSwlList(): Array<any> {
		return this.form.get('membersWithoutSwl')?.value ?? [];
	}
}
