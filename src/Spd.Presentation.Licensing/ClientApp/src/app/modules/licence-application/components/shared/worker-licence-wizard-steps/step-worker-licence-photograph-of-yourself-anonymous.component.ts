import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { CommonPhotographOfYourselfComponent } from '@app/modules/licence-application/components/shared/step-components/common-photograph-of-yourself.component';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

@Component({
	selector: 'app-step-worker-licence-photograph-of-yourself-anonymous',
	template: `
		<section class="step-section">
			<div class="step">
				<ng-container *ngIf="isRenewalOrUpdate">
					<app-common-update-renewal-alert
						[applicationTypeCode]="applicationTypeCode"
					></app-common-update-renewal-alert>
				</ng-container>

				<app-step-title
					class="fs-7"
					title="Upload a photograph of yourself"
					subtitle="This will appear on your licence. It must be a passport-quality photo of your face looking straight at the camera against a plain, white background. It must be from within the last year."
				></app-step-title>

				<div class="row mb-3" *ngIf="isRenewalOrUpdate">
					<div class="col-12 text-center">
						<div class="fs-5 mb-2">Current licence photo:</div>
						<img src="/assets/sample-photo.svg" alt="Photograph of yourself" />
					</div>
				</div>

				<app-common-photograph-of-yourself
					[form]="form"
					[isAnonymous]="true"
					[originalPhotoOfYourselfExpired]="originalPhotoOfYourselfExpired"
					[isCalledFromModal]="isCalledFromModal"
					(fileRemoved)="onFileRemoved()"
				></app-common-photograph-of-yourself>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicencePhotographOfYourselfAnonymousComponent
	implements OnInit, LicenceChildStepperStepComponent
{
	applicationTypeCodes = ApplicationTypeCode;
	originalPhotoOfYourselfExpired = false;

	form: FormGroup = this.licenceApplicationService.photographOfYourselfFormGroup;

	@Input() isCalledFromModal = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(CommonPhotographOfYourselfComponent)
	commonPhotographOfYourselfComponent!: CommonPhotographOfYourselfComponent;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.originalPhotoOfYourselfExpired = this.licenceApplicationService.licenceModelFormGroup.get(
			'originalPhotoOfYourselfExpired'
		)?.value;
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
