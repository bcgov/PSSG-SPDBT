import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { CommonPhotographOfYourselfComponent } from '@app/modules/licence-application/components/shared/step-components/common-photograph-of-yourself.component';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
	selector: 'app-step-worker-licence-photograph-of-yourself',
	template: `
		<section [ngClass]="isCalledFromModal ? 'step-section-modal' : 'step-section'">
			<div class="step">
				<ng-container *ngIf="isRenewalOrUpdate">
					<app-common-update-renewal-alert
						[applicationTypeCode]="applicationTypeCode"
					></app-common-update-renewal-alert>
				</ng-container>

				<app-step-title
					*ngIf="!isCalledFromModal"
					title="Your ID photograph"
					subtitle="I accept using this BC Services Card photo on my licence."
				></app-step-title>
				<app-step-title
					class="fs-7"
					*ngIf="isCalledFromModal"
					title="Did you want to use your BC Services Card photo on your licence?"
					subtitle="If not, you will be allowed upload a new photo."
				></app-step-title>

				<div class="row mb-2">
					<div class="col-12 text-center">
						<img src="/assets/sample-photo.svg" alt="Photograph of yourself" />
					</div>
				</div>

				<app-common-photograph-of-yourself
					[form]="form"
					[isAnonymous]="false"
					[originalPhotoOfYourselfExpired]="originalPhotoOfYourselfExpired"
					[isCalledFromModal]="isCalledFromModal"
					(fileUploaded)="onFileUploaded($event)"
					(fileRemoved)="onFileRemoved()"
				></app-common-photograph-of-yourself>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicencePhotographOfYourselfComponent implements OnInit, LicenceChildStepperStepComponent {
	originalPhotoOfYourselfExpired = false;

	form: FormGroup = this.licenceApplicationService.photographOfYourselfFormGroup;

	@Input() isCalledFromModal = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(CommonPhotographOfYourselfComponent)
	commonPhotographOfYourselfComponent!: CommonPhotographOfYourselfComponent;

	constructor(
		private authenticationService: AuthenticationService,
		private licenceApplicationService: LicenceApplicationService,
		private hotToastService: HotToastService
	) {}

	ngOnInit(): void {
		this.originalPhotoOfYourselfExpired = this.licenceApplicationService.licenceModelFormGroup.get(
			'originalPhotoOfYourselfExpired'
		)?.value;
	}

	onFileUploaded(file: File): void {
		if (this.authenticationService.isLoggedIn()) {
			this.licenceApplicationService.addUploadDocument(LicenceDocumentTypeCode.PhotoOfYourself, file).subscribe({
				next: (resp: any) => {
					const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
					matchingFile.documentUrlId = resp.body[0].documentUrlId;
				},
				error: (error: any) => {
					console.log('An error occurred during file upload', error);
					this.hotToastService.error('An error occurred during the file upload. Please try again.');
					this.commonPhotographOfYourselfComponent.fileUploadComponent.removeFailedFile(file);
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
