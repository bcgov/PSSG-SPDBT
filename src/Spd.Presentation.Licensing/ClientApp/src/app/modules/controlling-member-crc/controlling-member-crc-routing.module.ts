import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControllingMemberWizardAnonymousNewComponent } from './anonymous/controlling-member-wizard-anonymous-new.component';
import { ControllingMemberWizardAnonymousRenewComponent } from './anonymous/controlling-member-wizard-anonymous-renew.component';
import { ControllingMemberWizardAuthenticatedNewComponent } from './authenticated/controlling-member-wizard-authenticated-new.component';
import { ControllingMemberWizardAuthenticatedRenewComponent } from './authenticated/controlling-member-wizard-authenticated-renew.component';
import { ControllingMemberWizardAuthenticatedUpdateComponent } from './authenticated/controlling-member-wizard-authenticated-update.component';
import { ControllingMemberCrcAnonymousBaseComponent } from './controlling-member-crc-anonymous-base.component';
import { ControllingMemberCrcBaseComponent } from './controlling-member-crc-base.component';
import { ControllingMemberLoginComponent } from './controlling-member-login.component';
import { ControllingMemberSubmissionReceivedComponent } from './shared/controlling-member-submission-received.component';

export class ControllingMemberCrcRoutes {
	public static readonly CONTROLLING_MEMBER_CRC = 'controlling-member-crc';
	public static readonly CONTROLLING_MEMBER_LOGIN = 'login';
	public static readonly CONTROLLING_MEMBER_ANONYMOUS = 'controlling-member-anonymous';
	public static readonly CONTROLLING_MEMBER = 'controlling-member';
	public static readonly CONTROLLING_MEMBER_NEW = 'new';
	public static readonly CONTROLLING_MEMBER_RENEW = 'renew';
	public static readonly CONTROLLING_MEMBER_UPDATE = 'update';
	public static readonly CONTROLLING_MEMBER_SUBMIT = 'submit';

	public static readonly MODULE_PATH = ControllingMemberCrcRoutes.CONTROLLING_MEMBER_CRC;

	public static path(route: string | null = null): string {
		return route ? `/${ControllingMemberCrcRoutes.MODULE_PATH}/${route}` : `/${ControllingMemberCrcRoutes.MODULE_PATH}`;
	}

	public static pathControllingMemberCrcAnonymous(route: string): string {
		return `/${ControllingMemberCrcRoutes.MODULE_PATH}/${ControllingMemberCrcRoutes.CONTROLLING_MEMBER_ANONYMOUS}/${route}`;
	}

	public static pathControllingMemberCrc(route: string): string {
		return `/${ControllingMemberCrcRoutes.MODULE_PATH}/${ControllingMemberCrcRoutes.CONTROLLING_MEMBER}/${route}`;
	}
}

const routes: Routes = [
	{
		path: ControllingMemberCrcRoutes.CONTROLLING_MEMBER_LOGIN,
		component: ControllingMemberLoginComponent,
	},
	{
		path: ControllingMemberCrcRoutes.CONTROLLING_MEMBER_SUBMIT,
		component: ControllingMemberSubmissionReceivedComponent,
	},
	{
		/**************************************************** */
		// CONTROLLING MEMBERS - ANONYMOUS
		/**************************************************** */
		path: ControllingMemberCrcRoutes.CONTROLLING_MEMBER_ANONYMOUS,
		component: ControllingMemberCrcAnonymousBaseComponent,
		children: [
			{
				path: ControllingMemberCrcRoutes.CONTROLLING_MEMBER_NEW,
				component: ControllingMemberWizardAnonymousNewComponent,
			},
			{
				path: ControllingMemberCrcRoutes.CONTROLLING_MEMBER_RENEW,
				component: ControllingMemberWizardAnonymousRenewComponent,
			},
			{
				path: ControllingMemberCrcRoutes.CONTROLLING_MEMBER_UPDATE,
				component: ControllingMemberWizardAnonymousNewComponent,
			},
		],
	},
	{
		/**************************************************** */
		// CONTROLLING MEMBERS - AUTHENTICATED
		/**************************************************** */
		path: ControllingMemberCrcRoutes.CONTROLLING_MEMBER,
		component: ControllingMemberCrcBaseComponent,
		children: [
			{
				path: ControllingMemberCrcRoutes.CONTROLLING_MEMBER_NEW,
				component: ControllingMemberWizardAuthenticatedNewComponent,
			},
			{
				path: ControllingMemberCrcRoutes.CONTROLLING_MEMBER_RENEW,
				component: ControllingMemberWizardAuthenticatedRenewComponent,
			},
			{
				path: ControllingMemberCrcRoutes.CONTROLLING_MEMBER_UPDATE,
				component: ControllingMemberWizardAuthenticatedUpdateComponent,
			},
		],
	},
	{
		path: '',
		redirectTo: ControllingMemberCrcRoutes.path(),
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ControllingMemberCrcRoutingModule {}
