import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
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

				<div class="row mb-3" *ngIf="isRenewalOrUpdate && photographOfYourself">
					<div class="col-12 text-center">
						<div class="fs-5 mb-2">Current licence photo:</div>
						<img
							[src]="photographOfYourself"
							alt="Photograph of yourself"
							style="max-height: 200px;max-width: 200px;"
						/>
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
	originalPhotoOfYourselfExpired = false;
	photographOfYourself = this.licenceApplicationService.photographOfYourself;

	form: FormGroup = this.licenceApplicationService.photographOfYourselfFormGroup;

	@Input() isCalledFromModal = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

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
