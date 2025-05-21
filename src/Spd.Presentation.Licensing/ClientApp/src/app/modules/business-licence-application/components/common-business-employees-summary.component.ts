import { Component, Input } from '@angular/core';
import { BusinessApplicationService } from '@app/core/services/business-application.service';

@Component({
	selector: 'app-common-business-employees-summary',
	template: `
		<div class="text-minor-heading-small mb-2">Employees</div>
		<div class="row summary-text-data mt-0">
			<ng-container *ngIf="employeesList.length > 0; else NoEmployeesList">
				<ng-container *ngFor="let employee of employeesList; let i = index">
					<div class="col-xl-6 col-lg-12">
						<ul class="m-0">
							<li>{{ employee.licenceHolderName }} - {{ employee.licenceNumber }}</li>
						</ul>
					</div>
				</ng-container>
			</ng-container>
			<ng-template #NoEmployeesList> <div class="col-12">None</div> </ng-template>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class CommonBusinessEmployeesSummaryComponent {
	@Input() businessModelData: any;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	get employeesList(): Array<any> {
		return this.businessApplicationService.getSummaryemployeesList(this.businessModelData);
	}
}
