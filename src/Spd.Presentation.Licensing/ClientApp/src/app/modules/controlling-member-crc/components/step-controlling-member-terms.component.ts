import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { FormBusinessTermsComponent } from '@app/shared/components/form-business-terms.component';

@Component({
	selector: 'app-step-controlling-member-terms',
	template: `
		<app-step-section
			heading="Terms and Conditions"
			subheading="Read, download, and accept the Terms of Use to continue"
		>
			<app-form-business-terms [form]="form" [applicationTypeCode]="applicationTypeCode"></app-form-business-terms>
		</app-step-section>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepControllingMemberTermsComponent {
	form = this.businessApplicationService.termsAndConditionsFormGroup;

	@ViewChild(FormBusinessTermsComponent) commonTermsComponent!: FormBusinessTermsComponent;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		return this.commonTermsComponent.isFormValid();
	}
}
