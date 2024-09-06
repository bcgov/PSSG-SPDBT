import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControllingMemberSubmissionReceivedComponent } from './components/controlling-member-submission-received.component';
import { ControllingMemberWizardNewComponent } from './components/controlling-member-wizard-new.component';
import { ControllingMemberWizardUpdateComponent } from './components/controlling-member-wizard-update.component';
import { ControllingMemberInvitationComponent } from './controlling-member-invitation.component';
import { ControllingMemberLoginComponent } from './controlling-member-login.component';

export class ControllingMemberCrcRoutes {
	public static readonly CONTROLLING_MEMBER_CRC = 'controlling-member-crc';
	public static readonly CONTROLLING_MEMBER_INVITATION = 'invitation';
	public static readonly CONTROLLING_MEMBER_LOGIN = 'login';
	public static readonly CONTROLLING_MEMBER_NEW = 'new';
	public static readonly CONTROLLING_MEMBER_UPDATE = 'update';
	public static readonly CONTROLLING_MEMBER_SUBMISSION_RECEIVED = 'submission';

	public static readonly MODULE_PATH = ControllingMemberCrcRoutes.CONTROLLING_MEMBER_CRC;

	public static path(route: string | null = null): string {
		return route ? `/${ControllingMemberCrcRoutes.MODULE_PATH}/${route}` : `/${ControllingMemberCrcRoutes.MODULE_PATH}`;
	}
}

const routes: Routes = [
	{
		path: `${ControllingMemberCrcRoutes.CONTROLLING_MEMBER_INVITATION}/:id`,
		component: ControllingMemberInvitationComponent,
	},
	{
		path: ControllingMemberCrcRoutes.CONTROLLING_MEMBER_INVITATION,
		component: ControllingMemberInvitationComponent,
	},
	{
		path: ControllingMemberCrcRoutes.CONTROLLING_MEMBER_LOGIN,
		component: ControllingMemberLoginComponent,
	},
	{
		path: ControllingMemberCrcRoutes.CONTROLLING_MEMBER_SUBMISSION_RECEIVED,
		component: ControllingMemberSubmissionReceivedComponent,
	},
	{
		path: ControllingMemberCrcRoutes.CONTROLLING_MEMBER_NEW,
		component: ControllingMemberWizardNewComponent,
	},
	{
		path: ControllingMemberCrcRoutes.CONTROLLING_MEMBER_UPDATE,
		component: ControllingMemberWizardUpdateComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ControllingMemberCrcRoutingModule {}
