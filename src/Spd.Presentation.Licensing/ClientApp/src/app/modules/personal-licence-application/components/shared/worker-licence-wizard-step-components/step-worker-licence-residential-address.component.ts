import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-step-worker-licence-residential-address',
	template: `
		<app-step-section [heading]="title" [subheading]="subtitle">
			<div class="row">
				<div class="col-md-8 col-sm-12 mx-auto">
					<app-form-address [form]="form" [isWideView]="true"></app-form-address>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepWorkerLicenceResidentialAddressComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	form: FormGroup = this.workerApplicationService.residentialAddressFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	ngOnInit(): void {
		[this.title, this.subtitle] = this.workerApplicationService.getResidentialAddressTitle(this.applicationTypeCode);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
