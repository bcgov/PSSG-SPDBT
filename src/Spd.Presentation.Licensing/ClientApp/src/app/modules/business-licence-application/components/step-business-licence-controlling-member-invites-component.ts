import { Component } from '@angular/core';
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
						Invitations to consent to a criminal record check will be sent to these controlling members when you submit
						your business licence application. Your application will not proceed until we receive consent forms from all
						controlling members.
					</app-alert>
				</div>
			</div>

			<div class="row mb-3" *ngIf="membersWithoutSwlArray.length > 0">
				<div class="offset-md-3 col-md-6 col-sm-12">
					<div class="row">
						<ng-container *ngFor="let member of membersWithoutSwlArray; let i = index; last as isLast">
							<div class="col-md-6 col-sm-12 summary-text-data mt-2">{{ member.givenName }} {{ member.surname }}</div>
							<div class="col-md-6 col-sm-12 summary-text-data mt-0 mt-md-2">
								<ng-container *ngIf="member.emailAddress; else noEmailAddress">
									{{ member.emailAddress | default }}
								</ng-container>
								<ng-template #noEmailAddress>
									<a
										aria-label="Download Consent to Criminal Record Check document"
										download="business-memberauthconsent"
										matTooltip="Download Consent to Criminal Record Check document"
										[href]="downloadFilePath"
									>
										Download Manual Form
									</a>
								</ng-template>
							</div>
							<mat-divider *ngIf="!isLast" class="my-2"></mat-divider>
						</ng-container>
					</div>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepBusinessLicenceControllingMemberInvitesComponent implements LicenceChildStepperStepComponent {
	downloadFilePath = SPD_CONSTANTS.files.businessMemberAuthConsentManualForm;

	controllingMembersFormGroup = this.businessApplicationService.controllingMembersFormGroup;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		return true;
	}

	get membersWithoutSwlArray(): Array<any> {
		return this.controllingMembersFormGroup.get('membersWithoutSwl')?.value ?? [];
	}
}
