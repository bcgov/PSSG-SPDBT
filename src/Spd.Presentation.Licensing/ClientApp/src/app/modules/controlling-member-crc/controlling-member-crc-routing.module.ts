import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControllingMemberSubmissionReceivedComponent } from './components/controlling-member-submission-received.component';
import { ControllingMemberWizardNewComponent } from './components/controlling-member-wizard-new.component';
import { ControllingMemberWizardUpdateComponent } from './components/controlling-member-wizard-update.component';
import { ControllingMemberCrcRoutes } from './controlling-member-crc-routes';
import { ControllingMemberInvitationComponent } from './controlling-member-invitation.component';
import { ControllingMemberLoginComponent } from './controlling-member-login.component';

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
