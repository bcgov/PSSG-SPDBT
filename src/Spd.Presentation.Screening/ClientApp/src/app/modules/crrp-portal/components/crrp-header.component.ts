import { Component, Input } from '@angular/core';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';

@Component({
	selector: 'app-crrp-header',
	template: `
		<div class="row">
			<div class="col-12">
				<div class="d-flex justify-content-between">
					<h3 class="mx-2 fw-light" [title]="loggedInOrgDisplay" [attr.aria-label]="loggedInOrgDisplay">
						<strong>{{ loggedInOrgDisplay }}</strong>
						<span style="font-size: smaller;">&nbsp;&nbsp;{{ loggedInOrgTypeDisplay }}</span>
					</h3>
				</div>
				<div *ngIf="subtitle" class="lead mx-2">{{ subtitle }}</div>
				<div>
					<ng-content></ng-content>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.mat-icon {
				color: var(--color-primary-light);
				font-size: 40px;
				height: 40px;
				width: 40px;
			}
		`,
	],
})
export class CrrpHeaderComponent {
	loggedInOrgDisplay: string | null | undefined = this.authUserService.bceidUserOrgProfile?.organizationName;
	loggedInOrgTypeDisplay: string | null | undefined = this.authUserService.bceidUserOrgProfile
		?.employeeOrganizationTypeCode
		? 'EMPLOYEE'
		: 'VOLUNTEER';

	@Input() subtitle = '';

	constructor(private authUserService: AuthUserBceidService) {}
}
