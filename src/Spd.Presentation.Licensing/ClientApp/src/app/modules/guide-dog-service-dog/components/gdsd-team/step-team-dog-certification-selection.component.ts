import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { ApplicationTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-team-dog-certification-selection',
	template: `
		<app-step-section title="Dog certification selection">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="fs-5 lh-base mt-3 mb-3">
								Is your dog trained by Assistance Dogs International or International Guide Dog Federation accredited
								schools?
							</div>

							<app-alert type="info" icon="info">
								Not sure if your dog was trained by an accredited school? You can check the
								<a href="https://www2.gov.bc.ca/gov/content/justice/human-rights/guide-and-service-dog" target="_blank"
									>Guide Dog and Service Dog Certification</a
								>.
							</app-alert>

							<div class="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group
									aria-label="Select an option"
									formControlName="isDogTrainedByAccreditedSchool"
									(change)="onChangeDocumentType($event)"
								>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('isDogTrainedByAccreditedSchool')?.dirty ||
											form.get('isDogTrainedByAccreditedSchool')?.touched) &&
										form.get('isDogTrainedByAccreditedSchool')?.invalid &&
										form.get('isDogTrainedByAccreditedSchool')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepTeamDogCertificationSelectionComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.gdsdTeamApplicationService.dogCertificationSelectionFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onChangeDocumentType(_event: MatRadioChange): void {
		this.gdsdTeamApplicationService.accreditedFlagChanged(_event.value === BooleanTypeCode.Yes);
	}
}
