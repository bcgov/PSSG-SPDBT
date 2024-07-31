import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { CommonContactInformationComponent } from '@app/modules/personal-licence-application/components/shared/common-step-components/common-contact-information.component';
import { LicenceApplicationService } from '@app/modules/personal-licence-application/licence-application.service';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-worker-licence-contact-information',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<div class="row">
				<div class="col-12 mx-auto">
					<app-common-contact-information [form]="form"></app-common-contact-information>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
})
export class StepWorkerLicenceContactInformationComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	form: FormGroup = this.licenceApplicationService.contactInformationFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(CommonContactInformationComponent) contactInformationComponent!: CommonContactInformationComponent;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		if (this.isRenewalOrUpdate) {
			this.title = 'Confirm contact information';
			this.subtitle = 'Update any information that has changed since your last application';
		} else {
			this.title = 'Provide your contact information';
			this.subtitle = '';
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
