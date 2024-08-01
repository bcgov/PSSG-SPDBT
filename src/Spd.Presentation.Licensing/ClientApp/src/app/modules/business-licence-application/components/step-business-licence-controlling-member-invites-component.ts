import { Component } from '@angular/core';
import { FormArray } from '@angular/forms';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-business-licence-controlling-member-invites',
	template: `
		<app-step-section title="Requests sent successfully">
			<div class="row">
				<div class="col-xxl-8 col-xl-8 col-lg-12 mx-auto">
					<app-alert type="warning" icon="warning">
						Your business licence application will be on hold until we receive consent forms from all controlling
						members.
					</app-alert>
				</div>
			</div>

			<div class="row mb-3" *ngIf="membersWithoutSwlListWithEmail.length > 0">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<div class="summary-heading mb-2">
						A link to the online criminal record check consent form has been sent to:
					</div>
					<div class="row">
						<ng-container *ngFor="let empl of membersWithoutSwlListWithEmail; let i = index">
							<div class="col-md-6 col-sm-12 summary-text-data mt-2">{{ empl.givenName }} {{ empl.surname }}</div>
							<div class="col-md-6 col-sm-12 summary-text-data mt-0 mt-md-2">{{ empl.emailAddress }}</div>
						</ng-container>
					</div>
				</div>
			</div>

			<div class="row mb-3" *ngIf="membersWithoutSwlListWithoutEmail.length > 0">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<mat-divider class="my-3 mat-divider-primary" *ngIf="membersWithoutSwlListWithEmail.length > 0"></mat-divider>
					<div class="summary-heading mb-2">
						Download the Consent to Criminal Record Check form and provide it to the following member to fill out:
					</div>
					<div class="row">
						<ng-container *ngFor="let empl of membersWithoutSwlListWithoutEmail; let i = index">
							<div class="col-md-6 col-sm-12 summary-text-data mt-2">{{ empl.givenName }} {{ empl.surname }}</div>
							<div class="col-md-6 col-sm-12 summary-text-data mt-0 mt-md-2">
								<a
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
export class StepBusinessLicenceControllingMemberInvitesComponent implements LicenceChildStepperStepComponent {
	downloadFilePath = SPD_CONSTANTS.files.businessMemberAuthConsentManualForm;

	controllingMembersFormGroup = this.businessApplicationService.controllingMembersFormGroup;
	employeesFormGroup = this.businessApplicationService.employeesFormGroup;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		return true;
	}

	get membersWithoutSwlArray(): FormArray {
		return <FormArray>this.controllingMembersFormGroup.get('membersWithoutSwl');
	}
	get membersWithoutSwlListWithEmail(): Array<any> {
		const memberList = this.membersWithoutSwlArray.value ?? [];
		return memberList.filter((item: any) => !item.licenceNumber && !!item.emailAddress);
	}
	get membersWithoutSwlListWithoutEmail(): Array<any> {
		const memberList = this.membersWithoutSwlArray.value ?? [];
		return memberList.filter((item: any) => !item.licenceNumber && !item.emailAddress);
	}
}
