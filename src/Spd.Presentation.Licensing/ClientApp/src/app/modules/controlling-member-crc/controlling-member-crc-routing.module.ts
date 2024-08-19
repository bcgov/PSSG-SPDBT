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

export class ControllingMembersCrcRoutes {
	public static readonly CONTROLLING_MEMBERS_CRC = 'controlling-members-crc';
	public static readonly CONTROLLING_MEMBERS_LOGIN = 'login';
	public static readonly CONTROLLING_MEMBERS_ANONYMOUS = 'controlling-members-anonymous';
	public static readonly CONTROLLING_MEMBERS = 'controlling-members';
	public static readonly CONTROLLING_MEMBERS_NEW = 'new';
	public static readonly CONTROLLING_MEMBERS_RENEW = 'renew';
	public static readonly CONTROLLING_MEMBERS_UPDATE = 'update';

	public static readonly MODULE_PATH = ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_CRC;

	public static path(route: string | null = null): string {
		return route
			? `/${ControllingMembersCrcRoutes.MODULE_PATH}/${route}`
			: `/${ControllingMembersCrcRoutes.MODULE_PATH}`;
	}

	public static pathControllingMembersAnonymous(route: string): string {
		return `/${ControllingMembersCrcRoutes.MODULE_PATH}/${ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_ANONYMOUS}/${route}`;
	}

	public static pathControllingMembers(route: string): string {
		return `/${ControllingMembersCrcRoutes.MODULE_PATH}/${ControllingMembersCrcRoutes.CONTROLLING_MEMBERS}/${route}`;
	}
}

const routes: Routes = [
	{
		path: ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_LOGIN,
		component: ControllingMemberLoginComponent,
	},
	{
		/**************************************************** */
		// CONTROLLING MEMBERS - ANONYMOUS
		/**************************************************** */
		path: ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_ANONYMOUS,
		component: ControllingMemberCrcAnonymousBaseComponent,
		children: [
			{
				path: ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_NEW,
				component: ControllingMemberWizardAnonymousNewComponent,
			},
			{
				path: ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_RENEW,
				component: ControllingMemberWizardAnonymousRenewComponent,
			},
			{
				path: ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_UPDATE,
				component: ControllingMemberWizardAnonymousNewComponent,
			},
		],
	},
	{
		/**************************************************** */
		// CONTROLLING MEMBERS - AUTHENTICATED
		/**************************************************** */
		path: ControllingMembersCrcRoutes.CONTROLLING_MEMBERS,
		component: ControllingMemberCrcBaseComponent,
		children: [
			{
				path: ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_NEW,
				component: ControllingMemberWizardAuthenticatedNewComponent,
			},
			{
				path: ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_RENEW,
				component: ControllingMemberWizardAuthenticatedRenewComponent,
			},
			{
				path: ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_UPDATE,
				component: ControllingMemberWizardAuthenticatedUpdateComponent,
			},
		],
	},
	{
		path: '',
		redirectTo: ControllingMembersCrcRoutes.path(),
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ControllingMemberCrcRoutingModule {}
