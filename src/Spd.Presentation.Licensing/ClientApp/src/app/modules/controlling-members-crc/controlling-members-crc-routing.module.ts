import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControllingMembersWizardAnonymousNewComponent } from './anonymous/controlling-members-wizard-anonymous-new.component';
import { ControllingMembersWizardAnonymousRenewComponent } from './anonymous/controlling-members-wizard-anonymous-renew.component';
import { ControllingMembersWizardAuthenticatedNewComponent } from './authenticated/controlling-members-wizard-authenticated-new.component';
import { ControllingMembersWizardAuthenticatedRenewComponent } from './authenticated/controlling-members-wizard-authenticated-renew.component';
import { ControllingMembersWizardAuthenticatedUpdateComponent } from './authenticated/controlling-members-wizard-authenticated-update.component';
import { ControllingMembersAnonymousBaseComponent } from './controlling-members-anonymous-base.component';
import { ControllingMembersBaseComponent } from './controlling-members-base.component';
import { ControllingMembersLoginComponent } from './controlling-members-login.component';

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
		component: ControllingMembersLoginComponent,
	},
	{
		/**************************************************** */
		// CONTROLLING MEMBERS - ANONYMOUS
		/**************************************************** */
		path: ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_ANONYMOUS,
		component: ControllingMembersAnonymousBaseComponent,
		children: [
			{
				path: ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_NEW,
				component: ControllingMembersWizardAnonymousNewComponent,
			},
			{
				path: ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_RENEW,
				component: ControllingMembersWizardAnonymousRenewComponent,
			},
			{
				path: ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_UPDATE,
				component: ControllingMembersWizardAnonymousNewComponent,
			},
		],
	},
	{
		/**************************************************** */
		// CONTROLLING MEMBERS - AUTHENTICATED
		/**************************************************** */
		path: ControllingMembersCrcRoutes.CONTROLLING_MEMBERS,
		component: ControllingMembersBaseComponent,
		children: [
			{
				path: ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_NEW,
				component: ControllingMembersWizardAuthenticatedNewComponent,
			},
			{
				path: ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_RENEW,
				component: ControllingMembersWizardAuthenticatedRenewComponent,
			},
			{
				path: ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_UPDATE,
				component: ControllingMembersWizardAuthenticatedUpdateComponent,
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
export class ControllingMembersCrcRoutingModule {}
