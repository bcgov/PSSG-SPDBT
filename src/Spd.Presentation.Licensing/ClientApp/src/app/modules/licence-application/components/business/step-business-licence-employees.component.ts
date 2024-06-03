import { Component, ViewChild } from '@angular/core';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { CommonEmployeesComponent } from './common-employees.component';

@Component({
	selector: 'app-step-business-licence-employees',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Add all employees to this application?"
					subtitle="Your business must have valid security worker licence holders in B.C. that support the various licence categories the business wishes to be licensed for. If your controlling members don't meet this requirement, add employees who do."
				></app-step-title>

				<div class="row">
					<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<app-common-employees [defaultExpanded]="true" [isWizard]="true"></app-common-employees>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceEmployeesComponent implements LicenceChildStepperStepComponent {
	@ViewChild(CommonEmployeesComponent) employeesComponent!: CommonEmployeesComponent;

	isFormValid(): boolean {
		return this.employeesComponent.isFormValid();
	}
}
