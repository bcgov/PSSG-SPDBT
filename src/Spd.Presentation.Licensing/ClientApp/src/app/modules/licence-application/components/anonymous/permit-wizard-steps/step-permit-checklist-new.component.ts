import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';

@Component({
	selector: 'app-step-permit-checklist-new',
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
							<div class="fw-semibold fs-6">For all applicants:</div>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label">Proof of identity</span>
							</mat-checkbox>
							<p class="checklist-info">
								You will need to prove your identity by providing a valid piece of government-issued photo
								identification.
							</p>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label">Proof of citizenship or residence status</span>
							</mat-checkbox>
							<p class="checklist-info">
								You will need to prove your citizenship or residence status by providing a valid piece of
								government-issued identification, either from Canada or another country.
							</p>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label">Proof of fingerprinting request</span>
							</mat-checkbox>
							<p class="checklist-info">
								Applicants without a BC Service Card must submit a proof of fingerprinting request. Download the
								<a
									aria-label="Request for Fingerprinting form"
									download="Request For Fingerprinting Form"
									[href]="downloadFilePath"
									>Request for Fingerprinting form</a
								>, take it your local police department, and return to this application when you have this form
								completed.
							</p>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label">Photograph of yourself for the permit</span>
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
								<span class="checklist-label">Credit card</span>
							</mat-checkbox>
							<p class="checklist-info">All major credit cards accepted through our secure payment platform.</p>

							<mat-divider class="my-4"></mat-divider>
							<div class="fw-semibold fs-6">For some applicants:</div>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label">Expired permit (if applicable)</span>
							</mat-checkbox>
							<p class="checklist-info">
								If you have a Armoured Vehicle / Body Armour Permit that has expired, we can use the number and expiry
								date to connect this application to your file.
							</p>
						</form>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitChecklistNewComponent implements LicenceChildStepperStepComponent {
	downloadFilePath = SPD_CONSTANTS.files.requestForFingerprintingForm;

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

	// 	switch (workerLicenceTypeCode) {
	// 		case WorkerLicenceTypeCode.ArmouredVehiclePermit: {
	// 			this.subTitle = this.armoured_vehicle_subtitle;
	// 			this.viewExemptionsLink = SPD_CONSTANTS.urls.permitArmouredVehicleViewExemptions;
	// 			break;
	// 		}
	// 		case WorkerLicenceTypeCode.BodyArmourPermit: {
	// 			this.subTitle = this.body_armour_subtitle;
	// 			this.viewExemptionsLink = SPD_CONSTANTS.urls.permitBodyAmourViewExemptions;
	// 			break;
	// 		}
	// 	}
	// }

	isFormValid(): boolean {
		return true;
	}
}
