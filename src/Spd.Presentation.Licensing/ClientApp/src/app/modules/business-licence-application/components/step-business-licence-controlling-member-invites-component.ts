import { Component } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ApplicationInviteStatusCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-business-licence-controlling-member-invites',
	template: `
		<app-step-section title="Controlling members request summary">
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
					<div class="row">
						<ng-container *ngFor="let member of membersWithoutSwlListWithEmail; let i = index; last as isLast">
							<div class="col-md-4 col-sm-12 summary-text-data mt-2">{{ member.givenName }} {{ member.surname }}</div>
							<div class="col-md-4 col-sm-12 summary-text-data mt-0 mt-md-2">{{ member.emailAddress }}</div>
							<div class="col-md-4 col-sm-12 summary-text-data mt-0 mt-md-2">
								<span [ngClass]="getInviteStatusClass(member.inviteStatusCode)">
									{{ getInviteStatusText(member.inviteStatusCode) }}
								</span>
							</div>
							<mat-divider *ngIf="!isLast" class="my-2"></mat-divider>
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
	styles: [
		`
			.error-text {
				font-weight: bold;
				color: var(--color-red) !important;
			}

			.pending-text {
				color: var(--color-primary) !important;
			}

			.success-text {
				color: var(--color-green) !important;
			}
		`,
	],
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
		return memberList.filter((item: any) => !!item.emailAddress);
	}
	get membersWithoutSwlListWithoutEmail(): Array<any> {
		const memberList = this.membersWithoutSwlArray.value ?? [];
		return memberList.filter((item: any) => !item.emailAddress);
	}

	getInviteStatusText(inviteStatusCode: ApplicationInviteStatusCode | null): string {
		if (inviteStatusCode === ApplicationInviteStatusCode.Sent) {
			return 'Sent Invitation';
		}
		if (inviteStatusCode === ApplicationInviteStatusCode.Completed) {
			return 'Completed Form';
		}
		if (inviteStatusCode === ApplicationInviteStatusCode.Draft) {
			return 'Pending Invitation';
		}
		return 'Missing Invitation';
	}

	getInviteStatusClass(inviteStatusCode: ApplicationInviteStatusCode | null): string {
		if (inviteStatusCode === ApplicationInviteStatusCode.Completed) {
			return 'success-text';
		}
		if (
			inviteStatusCode === ApplicationInviteStatusCode.Sent ||
			inviteStatusCode === ApplicationInviteStatusCode.Draft
		) {
			return 'pending-text';
		}
		return 'error-text';
	}
}
