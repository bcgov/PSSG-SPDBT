import { Component } from '@angular/core';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';

@Component({
	selector: 'app-crrp-header',
	template: `
		<div class="row">
			<div class="col-12">
				<div class="fw-light fs-3 mx-2" [title]="loggedInOrgDisplay" [attr.aria-label]="loggedInOrgDisplay">
					<strong>{{ loggedInOrgDisplay }}</strong>
					<span style="font-size: smaller;">&nbsp;&nbsp;{{ loggedInOrgTypeDisplay }}</span>
				</div>
				<div>
					<ng-content></ng-content>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class CrrpHeaderComponent {
	loggedInOrgDisplay: string | null | undefined = this.authUserService.bceidUserOrgProfile?.organizationName;
	loggedInOrgTypeDisplay: string | null | undefined = this.authUserService.bceidUserOrgProfile
		?.employeeOrganizationTypeCode
		? 'EMPLOYEE'
		: 'VOLUNTEER';

	constructor(private authUserService: AuthUserBceidService) {}
}
