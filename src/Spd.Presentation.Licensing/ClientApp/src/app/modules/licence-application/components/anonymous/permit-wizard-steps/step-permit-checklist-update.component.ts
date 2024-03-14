import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';

@Component({
	selector: 'app-step-permit-checklist-update',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Checklist"
					subtitle="Make sure you have the following items before you continue"
				></app-step-title>

				<div class="row">
					<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<!-- <app-alert type="info" icon="info">
							{{ subTitle }}
							<a class="large" [href]="viewExemptionsLink" target="_blank">View exemptions</a>
						</app-alert> -->

						<form [formGroup]="form" novalidate>
							<div class="fw-semibold fs-6">
								Required documents depend on what updates you need to make to your licence:
							</div>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label"
									>If you want to replace the photograph on your licence, provide a new photograph</span
								>
							</mat-checkbox>
							<p class="checklist-info">
								You will need to upload a passport-quality photo of your face looking straight at the camera against a
								plain, white background. Uploading a photo that does not meet the criteria will delay your application's
								processing time. For further information on Passport Quality Photographs, please review the Government
								of Canada’s
								<a
									aria-label="Request for Fingerprinting form"
									href="https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html"
									target="_blank"
									>passport photograph requirements</a
								>.
							</p>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label">If you have changed your name, proof of legal name change</span>
							</mat-checkbox>
							<p class="checklist-info">
								You must upload one of the following documents: marriage certificate, certificate of name change, or a
								copy of your driver's licence/BCID with new name.
							</p>
						</form>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitChecklistUpdateComponent implements LicenceChildStepperStepComponent {
	// subTitle = '';
	// viewExemptionsLink = '';

	form: FormGroup = this.formBuilder.group({
		checklistItem: new FormControl({ value: true, disabled: true }),
	});

	// readonly body_armour_subtitle =
	// 	'You may be exempt from a body armour permit depending on your job or if you have a valid firearms licence.';
	// readonly armoured_vehicle_subtitle =
	// 	'You may be allowed to operate an armoured vehicle without a permit while performing your job.';

	constructor(private formBuilder: FormBuilder, private permitApplicationService: PermitApplicationService) {}

	// ngOnInit(): void {
	// 	const workerLicenceTypeCode = this.permitApplicationService.permitModelFormGroup.get(
	// 		'workerLicenceTypeData.workerLicenceTypeCode'
	// 	)?.value;

	// 	console.debug('workerLicenceTypeCode', workerLicenceTypeCode);

	// switch (workerLicenceTypeCode) {
	// 	case WorkerLicenceTypeCode.ArmouredVehiclePermit: {
	// 		this.subTitle = this.armoured_vehicle_subtitle;
	// 		this.viewExemptionsLink = SPD_CONSTANTS.urls.permitArmouredVehicleViewExemptions;
	// 		break;
	// 	}
	// 	case WorkerLicenceTypeCode.BodyArmourPermit: {
	// 		this.subTitle = this.body_armour_subtitle;
	// 		this.viewExemptionsLink = SPD_CONSTANTS.urls.permitBodyAmourViewExemptions;
	// 		break;
	// 	}
	// }
	// }

	isFormValid(): boolean {
		return true;
	}
}
