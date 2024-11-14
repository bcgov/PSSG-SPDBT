import { Component } from '@angular/core';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-business-licence-application-on-hold',
	template: `
		<app-step-section title="Application on hold">
			<div class="hold-icon mx-auto">
				<mat-icon>schedule</mat-icon>
			</div>

			<div class="row">
				<div class="col-xxl-8 col-xl-8 col-lg-12 mx-auto">
					<div class="my-3">
						Your business licence application will be on hold until we receive consent forms from all controlling
						members.
					</div>

					<div class="my-3">
						You will receive an email with further instructions once all controlling members have submitted their
						criminal record check consent forms. You will be able to return to this application to review and pay the
						security business licence fee.
					</div>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [
		`
			.hold-icon {
				width: 80px !important;

				.mat-icon {
					color: var(--color-yellow);
					font-size: 80px !important;
					height: 80px !important;
					width: 80px !important;
				}
			}
		`,
	],
})
export class StepBusinessLicenceApplicationOnHoldComponent implements LicenceChildStepperStepComponent {
	isFormValid(): boolean {
		return true;
	}
}
