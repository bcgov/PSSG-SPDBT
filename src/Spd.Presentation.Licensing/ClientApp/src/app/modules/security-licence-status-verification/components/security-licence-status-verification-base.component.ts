import { Component, OnInit } from '@angular/core';
import { CommonApplicationService } from '@app/core/services/common-application.service';

@Component({
	selector: 'app-security-licence-status-verification-base',
	template: `
		<div class="container px-0 my-0 px-md-2 my-md-3">
			<!-- hide padding/margin on smaller screens -->
			<div class="row">
				<div class="col-12">
					<router-outlet></router-outlet>
				</div>
			</div>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class SecurityLicenceStatusVerificationBaseComponent implements OnInit {
	constructor(private commonApplicationService: CommonApplicationService) {}
	ngOnInit(): void {
		this.commonApplicationService.setApplicationTitleText(
			'Security Licence Status Verification',
			'SL Status Verification'
		);
	}
}
