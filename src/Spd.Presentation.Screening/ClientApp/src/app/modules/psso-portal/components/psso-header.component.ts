import { Component } from '@angular/core';
import { AuthUserIdirService } from 'src/app/core/services/auth-user-idir.service';

@Component({
	selector: 'app-psso-header',
	template: `
		<div class="row">
			<div class="col-12">
				<div class="fw-light fs-3 mx-2" [title]="loggedInOrgDisplay" [attr.aria-label]="loggedInOrgDisplay">
					<strong>{{ loggedInOrgDisplay }}</strong>
				</div>
				<div>
					<ng-content></ng-content>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class PssoHeaderComponent {
	loggedInOrgDisplay: string | null | undefined = this.authUserService.idirUserWhoamiProfile?.orgName;

	constructor(private authUserService: AuthUserIdirService) {}
}
