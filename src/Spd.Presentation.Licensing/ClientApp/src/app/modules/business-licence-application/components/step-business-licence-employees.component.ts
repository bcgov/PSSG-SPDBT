import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { CommonEmployeesComponent } from './common-employees.component';

@Component({
	selector: 'app-step-business-licence-employees',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<app-common-employees [defaultExpanded]="true" [isWizard]="true"></app-common-employees>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
})
export class StepBusinessLicenceEmployeesComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(CommonEmployeesComponent) employeesComponent!: CommonEmployeesComponent;

	ngOnInit(): void {
		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.New: {
				this.title = 'Add all employees to your application';
				this.subtitle =
					"Your business must have valid security worker licence holders in B.C. that support the various licence categories the business wishes to be licensed for. If your controlling members don't meet this requirement, add employees who do.";
				break;
			}
			default: {
				this.title = 'Confirm your existing employees';
				this.subtitle = '';
				break;
			}
		}
	}

	isFormValid(): boolean {
		return this.employeesComponent.isFormValid();
	}
}
