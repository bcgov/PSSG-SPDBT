import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-dt-training-school-info',
	template: `
		<app-step-section [heading]="title">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-7 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<app-form-gdsd-accredited-school
							schoolLabel="Name of Assistance Dogs International or International Guide Dog Federation Accredited School"
							[accreditedSchoolIdControl]="accreditedSchoolId"
							[accreditedSchoolNameControl]="accreditedSchoolName"
							[applicationTypeCode]="applicationTypeCode"
						></app-form-gdsd-accredited-school>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepDtTrainingSchoolInfoComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';

	form: FormGroup = this.dogTrainerApplicationService.trainingSchoolInfoFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private dogTrainerApplicationService: DogTrainerApplicationService) {}

	ngOnInit(): void {
		this.title = this.isRenewal
			? 'Confirm accredited training school information'
			: 'Information about the accredited training school';
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isRenewal(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Renewal;
	}

	get accreditedSchoolId(): FormControl {
		return this.form.get('accreditedSchoolId') as FormControl;
	}
	get accreditedSchoolName(): FormControl {
		return this.form.get('accreditedSchoolName') as FormControl;
	}
}
