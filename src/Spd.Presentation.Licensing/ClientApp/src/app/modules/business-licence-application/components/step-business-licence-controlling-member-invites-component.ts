import { Component } from '@angular/core';
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

			<div class="row mb-3" *ngIf="membersWithoutSwlArray.length > 0">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<div class="row">
						<ng-container *ngFor="let member of membersWithoutSwlArray; let i = index; last as isLast">
							<div class="col-md-4 col-sm-12 summary-text-data mt-2">{{ member.givenName }} {{ member.surname }}</div>
							<div class="col-md-4 col-sm-12 summary-text-data mt-0 mt-md-2">{{ member.emailAddress }}</div>
							<div class="col-md-4 col-sm-12 summary-text-data mt-0 mt-md-2">
								<span [ngClass]="getInviteStatusClass(member.inviteStatusCode)">
									{{ getInviteStatusText(member.inviteStatusCode, member.emailAddress) }}
								</span>
							</div>
							<mat-divider *ngIf="!isLast" class="my-2"></mat-divider>
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

	get membersWithoutSwlArray(): Array<any> {
		return this.controllingMembersFormGroup.get('membersWithoutSwl')?.value ?? [];
	}

	getInviteStatusText(inviteStatusCode: ApplicationInviteStatusCode | null, emailAddress: string | null): string {
		if (inviteStatusCode === ApplicationInviteStatusCode.Sent) {
			return 'Sent Invitation';
		}
		if (inviteStatusCode === ApplicationInviteStatusCode.Completed) {
			return 'Completed Form';
		}
		if (inviteStatusCode === ApplicationInviteStatusCode.Draft) {
			return 'Pending Invitation';
		}
		return emailAddress ? 'Missing Invitation' : 'Incomplete Invitation';
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
