import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormContactInformationComponent } from '@app/shared/components/form-contact-information.component';

@Component({
	selector: 'app-step-permit-contact-information',
	template: `
		<app-step-section [heading]="title" [subheading]="subtitle">
			<div class="row">
				<div class="col-12 mx-auto">
					<app-form-contact-information [form]="form"></app-form-contact-information>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepPermitContactInformationComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	form: FormGroup = this.permitApplicationService.contactInformationFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(FormContactInformationComponent) contactInformationComponent!: FormContactInformationComponent;

	constructor(private permitApplicationService: PermitApplicationService) {}

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
