import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { HotToastService } from '@ngneat/hot-toast';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { GovernmentIssuedPhotoIdTypes } from '@app/core/code-types/model-desc.models';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';

@Component({
	selector: 'app-step-worker-licence-additional-gov-id',
	template: `
		<section class="step-section">
			<div class="step">
				<!-- <ng-container
					*ngIf="
						applicationTypeCode === applicationTypeCodes.Renewal || applicationTypeCode === applicationTypeCodes.Update
					"
				>
					<app-common-update-renewal-alert [applicationTypeCode]="applicationTypeCode"></app-common-update-renewal-alert>
				</ng-container> -->

				<app-step-title title="Provide an additional piece of government-issued photo ID"></app-step-title>

				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<div class="row my-2">
								<div class="col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Select other ID</mat-label>
										<mat-select formControlName="governmentIssuedPhotoTypeCode" [errorStateMatcher]="matcher">
											<mat-option *ngFor="let item of governmentIssuedPhotoIdTypes" [value]="item.code">
												{{ item.desc }}
											</mat-option>
										</mat-select>
										<mat-hint>Other ID can be from another country</mat-hint>
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
											formControlName="expiryDate"
											[errorStateMatcher]="matcher"
										/>
										<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
										<mat-datepicker #picker startView="multi-year"></mat-datepicker>
										<mat-error *ngIf="form.get('expiryDate')?.hasError('required')"> This is required </mat-error>
									</mat-form-field>
								</div>
							</div>
							<div *ngIf="governmentIssuedPhotoTypeCode.value" @showHideTriggerSlideAnimation>
								<div class="row mb-2">
									<div class="col-12">
										<div class="text-minor-heading mb-2">Upload a photo of your ID:</div>
										<app-file-upload
											(fileUploaded)="onFileUploaded($event)"
											(fileRemoved)="onFileRemoved()"
											[maxNumberOfFiles]="10"
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
					</div>
				</form>
			</div>
		</section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class StepWorkerLicenceAdditionalGovIdComponent implements LicenceChildStepperStepComponent {
	governmentIssuedPhotoIdTypes = GovernmentIssuedPhotoIdTypes;

	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.licenceApplicationService.additionalGovIdFormGroup;

	applicationTypeCodes = ApplicationTypeCode;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(
		private authenticationService: AuthenticationService,
		private licenceApplicationService: LicenceApplicationService,
		private hotToastService: HotToastService
	) {}

	onFileUploaded(file: File): void {
		if (this.authenticationService.isLoggedIn()) {
			this.licenceApplicationService.addUploadDocument(this.governmentIssuedPhotoTypeCode.value, file).subscribe({
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

	get governmentIssuedPhotoTypeCode(): FormControl {
		return this.form.get('governmentIssuedPhotoTypeCode') as FormControl;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
