import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
	selector: 'app-crrp-header',
	template: `
		<div class="row">
			<div class="col-12">
				<div class="d-flex justify-content-between">
					<h3 class="mx-2 fw-light" [title]="loggedInOrgDisplay" [attr.aria-label]="loggedInOrgDisplay">
						{{ loggedInOrgDisplay }}
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
export class CrrpHeaderComponent implements OnInit {
	loggedInOrgDisplay: string | null = null;
	@Input() subtitle = '';

	constructor(private authenticationService: AuthenticationService) {}

	ngOnInit(): void {
		this.authenticationService.isLoginSubject$.subscribe((_subjectData: any) => {
			const loggedInOrgName = this.authenticationService.loggedInUserInfo?.orgName;
			this.loggedInOrgDisplay = loggedInOrgName ? loggedInOrgName : '';
		});
	}
}
