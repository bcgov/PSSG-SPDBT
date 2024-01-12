import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { CommonPhotographOfYourselfComponent } from '../step-components/common-photograph-of-yourself.component';

@Component({
	selector: 'app-step-photograph-of-yourself-anonymous',
	template: `
		<section class="step-section">
			<div class="step">
				<ng-container
					*ngIf="
						applicationTypeCode === applicationTypeCodes.Renewal || applicationTypeCode === applicationTypeCodes.Update
					"
				>
					<app-renewal-alert [applicationTypeCode]="applicationTypeCode"></app-renewal-alert>
				</ng-container>

				<app-step-title
					class="fs-7"
					title="Upload a photograph of yourself"
					subtitle="This will appear on your licence. It must be a passport-quality photo of your face looking straight at the camera against a plain, white background. It must be from within the last year."
				></app-step-title>

				<div class="row">
					<div class="col-md-8 col-sm-12 mx-auto">
						<app-alert type="warning" icon="warning">
							<strong>Warning</strong>: uploading a photo that is dissimilar from your submitted government-issued photo
							ID will delay your application's processing time.
						</app-alert>
					</div>
				</div>

				<div class="text-minor-heading mb-2">Upload your photo</div>

				<app-common-photograph-of-yourself
					[form]="form"
					[isCalledFromModal]="isCalledFromModal"
					(fileRemoved)="onFileRemoved()"
				></app-common-photograph-of-yourself>
			</div>
		</section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class StepPhotographOfYourselfAnonymousComponent implements LicenceChildStepperStepComponent {
	applicationTypeCodes = ApplicationTypeCode;

	form: FormGroup = this.licenceApplicationService.photographOfYourselfFormGroup;

	@Input() isCalledFromModal = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(CommonPhotographOfYourselfComponent)
	commonPhotographOfYourselfComponent!: CommonPhotographOfYourselfComponent;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

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
}
