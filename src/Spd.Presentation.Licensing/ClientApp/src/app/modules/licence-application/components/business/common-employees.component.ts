import { Component, Input } from '@angular/core';
import { BusinessApplicationService } from '../../services/business-application.service';

@Component({
	selector: 'app-common-employees',
	template: `
		<mat-accordion multi="false">
			<!-- <ng-container *ngIf="isNewOrRenewal; else isUpdateTitle2"> -->
			<!-- <div class="fs-5 mb-2">Controlling members WITHOUT a security worker licence</div> -->
			<!-- <div class="my-3">
					<app-alert type="info" icon="info">
						Your business must have valid security worker licence holders in B.C. that support the various licence
						categories the business wishes to be licensed for. If your controlling members don't meet this requirement,
						add employees who do.
					</app-alert>
				</div> -->
			<!-- </ng-container>
			<ng-template #isUpdateTitle2>
				<div class="fs-5 mb-2">Employee Updates</div>
				<div>
					If your employees who are licence holders for the business change during the business licence term, update
					their information here.
				</div>
			</ng-template> -->

			<mat-expansion-panel class="mat-expansion-panel-border my-2 w-100" [expanded]="defaultExpanded">
				<mat-expansion-panel-header>
					<mat-panel-title>Employees</mat-panel-title>
				</mat-expansion-panel-header>

				<app-common-business-employees [form]="licenceHoldersFormGroup"></app-common-business-employees>
			</mat-expansion-panel>
		</mat-accordion>
	`,
	styles: [],
})
export class CommonEmployeesComponent {
	licenceHoldersFormGroup = this.businessApplicationService.employeesFormGroup;

	@Input() defaultExpanded = false;
	// @Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	// get isNewOrRenewal(): boolean {
	// 	return (
	// 		this.applicationTypeCode === ApplicationTypeCode.Renewal || this.applicationTypeCode === ApplicationTypeCode.New
	// 	);
	// }

	// get isUpdate(): boolean {
	// 	return this.applicationTypeCode === ApplicationTypeCode.Update;
	// }
}
