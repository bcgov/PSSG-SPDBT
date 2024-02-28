import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { CommonPhotographOfYourselfComponent } from '../../shared/step-components/common-photograph-of-yourself.component';

@Component({
	selector: 'app-step-permit-photograph-of-yourself-anonymous',
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
					subtitle="This will appear on your permit. It must be a passport-quality photo of your face looking straight at the camera against a plain, white background. It must be from within the last year."
				></app-step-title>

				<app-common-photograph-of-yourself
					[form]="form"
					name="permit"
					[isAnonymous]="true"
					(fileRemoved)="onFileRemoved()"
				></app-common-photograph-of-yourself>
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitPhotographOfYourselfAnonymousComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.permitApplicationService.photographOfYourselfFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(CommonPhotographOfYourselfComponent)
	commonPhotographOfYourselfComponent!: CommonPhotographOfYourselfComponent;

	constructor(private permitApplicationService: PermitApplicationService) {}

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
