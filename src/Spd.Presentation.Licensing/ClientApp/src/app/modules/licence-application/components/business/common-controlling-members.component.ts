import { Component, Input } from '@angular/core';
import { BusinessApplicationService } from '../../services/business-application.service';

@Component({
	selector: 'app-common-controlling-members',
	template: `
		<mat-accordion multi="false">
			<!-- <ng-container *ngIf="isNewOrRenewal; else isUpdateTitle1">
				<div class="fs-5 mb-2">Controlling members with valid security worker licences</div>
				<div class="my-3">
					<app-alert type="info" icon="info">
						<a
							class="large"
							href="https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/businesses/rules"
							target="_blank"
							>Controlling members</a
						>
						who are also licensed security workers must provide their licence number to the Registrar of Security
						Services when the business applies for a licence.
					</app-alert>
				</div>
			</ng-container>
			<ng-template #isUpdateTitle1>
				<div class="fs-5 mb-2">Controlling Members Updates</div>
				<div>If your controlling members change during the business licence term, update their information here.</div>
			</ng-template> -->

			<mat-expansion-panel class="mat-expansion-panel-border my-2 w-100" [expanded]="defaultExpanded">
				<mat-expansion-panel-header>
					<mat-panel-title>Controlling Members</mat-panel-title>
				</mat-expansion-panel-header>

				<app-common-business-controlling-members
					[form]="controllingMembersFormGroup"
				></app-common-business-controlling-members>
			</mat-expansion-panel>
		</mat-accordion>
	`,
	styles: [],
})
export class CommonControllingMembersComponent {
	controllingMembersFormGroup = this.businessApplicationService.controllingMembersFormGroup;

	@Input() defaultExpanded = false;

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
