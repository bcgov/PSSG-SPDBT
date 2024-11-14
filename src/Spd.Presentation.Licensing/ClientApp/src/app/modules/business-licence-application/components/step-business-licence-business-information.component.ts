import { Component, Input } from '@angular/core';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-business-licence-business-information',
	template: `
		<app-step-section title="Do you need to update any of the following contact information?">
			<div class="row">
				<div class="col-xxl-8 col-xl-8 col-lg-12 mx-auto">
					<app-common-business-information
						[form]="form"
						[isReadonly]="false"
						[isSoleProprietorCombinedFlow]="isSoleProprietorCombinedFlow"
					></app-common-business-information>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
})
export class StepBusinessLicenceBusinessInformationComponent implements LicenceChildStepperStepComponent {
	form = this.businessApplicationService.businessInformationFormGroup;

	@Input() isSoleProprietorCombinedFlow = false;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();

		const valid1 = this.form.get('soleProprietorSwlEmailAddress')?.valid ?? false;
		const valid2 = this.form.get('soleProprietorSwlPhoneNumber')?.valid ?? false;
		return valid1 && valid2;
	}
}
