import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';

@Component({
	selector: 'app-step-business-licence-controlling-member-invites',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Requests sent successfully"></app-step-title>

				<div class="row">
					<div class="col-xxl-8 col-xl-8 col-lg-12 mx-auto">
						<app-alert type="warning" icon="warning">
							Your business licence application will be on hold until we receive consent forms from all controlling
							members.
						</app-alert>
					</div>
				</div>

				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<div class="summary-heading mb-2">
								A link to the online criminal record check consent form has been sent to
							</div>
							<div class="row">
								<div class="col-6">Nav Singh</div>
								<div class="col-6">Nav.Singh&#64;hotmail.com</div>
								<div class="col-6">John Lee</div>
								<div class="col-6">John.Lee&#64;gmail.com</div>
							</div>
						</div>
					</div>

					<div class="row mb-3">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<mat-divider class="my-3 mat-divider-primary"></mat-divider>
							<div class="summary-heading mb-2">
								Download the Consent to Criminal Record Check form and provide it to the following member to fill out
							</div>
							<div class="row">
								<div class="col-6">Gerhart Lang</div>
								<div class="col-6">Manual Form</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceControllingMemberInvitesComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.businessApplicationService.membersConfirmationFormGroup;

	constructor(private formBuilder: FormBuilder, private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		// this.form.markAllAsTouched();
		// return this.form.valid;
		return true;
	}
}
