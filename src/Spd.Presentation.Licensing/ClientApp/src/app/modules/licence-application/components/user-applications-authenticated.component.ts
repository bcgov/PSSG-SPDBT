import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';

@Component({
	selector: 'app-user-applications-authenticated',
	template: ` <router-outlet></router-outlet> `,
	styles: [],
})
export class UserApplicationsAuthenticatedComponent implements OnInit {
	constructor(private router: Router, private authProcessService: AuthProcessService) {}

	async ngOnInit(): Promise<void> {
		this.authProcessService.logoutBceid();

		const nextRoute = await this.authProcessService.initializeLicencingBCSC();
		if (nextRoute) {
			await this.router.navigate([nextRoute]);
		}
	}
}
