import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { CommonEmployeesComponent } from './common-employees.component';

@Component({
	selector: 'app-step-business-licence-employees',
	template: `
		<app-step-section [heading]="title" [subheading]="subtitle">
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<app-common-employees [defaultExpanded]="true"></app-common-employees>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepBusinessLicenceEmployeesComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() isBusinessLicenceSoleProprietor!: boolean;

	@ViewChild(CommonEmployeesComponent) employeesComponent!: CommonEmployeesComponent;

	ngOnInit(): void {
		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.New: {
				this.title = 'Add all employees to your application';
				if (this.isBusinessLicenceSoleProprietor) {
					this.subtitle =
						'Your business must have valid licence holders in B.C. for the licence categories you need. If your current security worker licence do not meet these requirements, add employees who do.';
				} else {
					this.subtitle =
						'Your business must have valid licence holders in B.C. for the licence categories you need. If your current controlling members do not meet these requirements, add employees who do.';
				}
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
