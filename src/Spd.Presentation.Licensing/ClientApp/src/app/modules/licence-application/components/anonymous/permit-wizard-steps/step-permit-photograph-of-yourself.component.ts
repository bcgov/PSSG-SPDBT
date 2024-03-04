import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { HotToastService } from '@ngneat/hot-toast';
import { CommonPhotographOfYourselfComponent } from '../../shared/step-components/common-photograph-of-yourself.component';

@Component({
	selector: 'app-step-permit-photograph-of-yourself',
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
					title="Upload a photograph of yourself"
					subtitle="I accept using this BC Services Card photo on my permit."
				></app-step-title>

				<app-step-title
					class="fs-7"
					*ngIf="isCalledFromModal"
					title="Did you want to use your BC Services Card photo on your permit?"
					subtitle="If not, you will be allowed upload a new photo."
				></app-step-title>

				<div class="row mb-2">
					<div class="col-12 text-center">
						<img src="/assets/sample-photo.svg" alt="Photograph of yourself" />
					</div>
				</div>

				<app-common-photograph-of-yourself
					[form]="form"
					name="permit"
					[isAnonymous]="false"
					[isCalledFromModal]="isCalledFromModal"
					(fileUploaded)="onFileUploaded($event)"
					(fileRemoved)="onFileRemoved()"
				></app-common-photograph-of-yourself>
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitPhotographOfYourselfComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.permitApplicationService.photographOfYourselfFormGroup;

	@Input() isCalledFromModal = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(CommonPhotographOfYourselfComponent)
	commonPhotographOfYourselfComponent!: CommonPhotographOfYourselfComponent;

	constructor(private permitApplicationService: PermitApplicationService, private hotToastService: HotToastService) {}

	onFileUploaded(file: File): void {
		this.permitApplicationService.addUploadDocument(LicenceDocumentTypeCode.PhotoOfYourself, file).subscribe({
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

	onFileRemoved(): void {
		this.permitApplicationService.hasValueChanged = true;
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
