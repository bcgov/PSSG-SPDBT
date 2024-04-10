import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';

@Component({
	selector: 'app-step-permit-physical-characteristics',
	template: `
		<section class="step-section">
			<div class="step">
				<ng-container *ngIf="isRenewalOrUpdate">
					<app-common-update-renewal-alert
						[applicationTypeCode]="applicationTypeCode"
					></app-common-update-renewal-alert>
				</ng-container>

				<app-step-title [title]="title"></app-step-title>

				<app-common-physical-characteristics [form]="form"></app-common-physical-characteristics>
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitPhysicalCharacteristicsComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	form: FormGroup = this.permitApplicationService.characteristicsFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private permitApplicationService: PermitApplicationService) {}

	ngOnInit(): void {
		if (
			this.applicationTypeCode === ApplicationTypeCode.Update ||
			this.applicationTypeCode === ApplicationTypeCode.Renewal
		) {
			this.title = 'Confirm identifying information';
		} else {
			this.title = 'Provide identifying information';
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isRenewalOrUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal ||
			this.applicationTypeCode === ApplicationTypeCode.Update
		);
	}
}
