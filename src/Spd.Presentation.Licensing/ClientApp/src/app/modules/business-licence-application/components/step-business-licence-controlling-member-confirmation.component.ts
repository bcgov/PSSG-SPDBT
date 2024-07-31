import { Component } from '@angular/core';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { BusinessApplicationService } from '@app/modules/business-licence-application/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-business-licence-controlling-member-confirmation',
	template: `
		<app-step-section title="Confirm the list of controlling members for this security business">
			<div class="row" *ngIf="membersWithSwlList.length > 0">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<div class="fs-5 mb-2">Current members with active security worker licences</div>
					<div class="row mb-3">
						<ng-container *ngFor="let empl of membersWithSwlList; let i = index">
							<div class="col-md-6 col-sm-12 summary-text-data mt-2">{{ empl.licenceHolderName }}</div>
							<div class="col-md-6 col-sm-12 summary-text-data mt-0 mt-md-2">{{ empl.licenceNumber }}</div>
						</ng-container>
					</div>
				</div>
			</div>

			<div class="row" *ngIf="membersWithoutSwlList.length > 0">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<mat-divider class="my-3 mat-divider-primary" *ngIf="membersWithSwlList.length > 0"></mat-divider>
					<div class="fs-5 mb-2">Members who require criminal record checks</div>
					<p>
						A link to an online application form will be sent to each controlling member via email. They must provide
						personal information and consent to a criminal record check. We must receive criminal record check consent
						forms from each individual listed here before the business licence application will be reviewed.
					</p>
					<div class="row mb-3">
						<ng-container *ngFor="let empl of membersWithoutSwlList; let i = index">
							<div class="col-md-6 col-sm-12 summary-text-data mt-2">{{ empl.givenName }} {{ empl.surname }}</div>
							<div class="col-md-6 col-sm-12 summary-text-data mt-0 mt-md-2">
								{{ empl.emailAddress }}
								<a
									*ngIf="!empl.emailAddress"
									color="primary"
									class="large"
									aria-label="Download Business Member Auth Consent"
									download="Business Member Auth Consent"
									[href]="downloadFilePath"
									>Manual Form</a
								>
							</div>
						</ng-container>
					</div>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
})
export class StepBusinessLicenceControllingMemberConfirmationComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	downloadFilePath = SPD_CONSTANTS.files.businessMemberAuthConsentManualForm;

	controllingMembersFormGroup = this.businessApplicationService.controllingMembersFormGroup;
	employeesFormGroup = this.businessApplicationService.employeesFormGroup;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		return true;
	}

	get membersWithSwlList(): Array<any> {
		return this.controllingMembersFormGroup.get('membersWithSwl')?.value ?? [];
	}
	get membersWithoutSwlList(): Array<any> {
		return this.controllingMembersFormGroup.get('membersWithoutSwl')?.value ?? [];
	}
}
