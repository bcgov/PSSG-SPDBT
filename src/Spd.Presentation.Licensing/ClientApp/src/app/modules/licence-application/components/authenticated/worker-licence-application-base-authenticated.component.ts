import { Component, OnInit } from '@angular/core';
import { AuthProcessService } from '@app/core/services/auth-process.service';

@Component({
	selector: 'app-worker-licence-application-base-authenticated',
	template: ` <router-outlet></router-outlet> `,
	styles: [],
})
export class WorkerLicenceApplicationBaseAuthenticatedComponent implements OnInit {
	constructor(private authProcessService: AuthProcessService) {}

	async ngOnInit(): Promise<void> {
		this.authProcessService.logoutBceid();
		await this.authProcessService.initializeLicencingBCSC();
	}
}
