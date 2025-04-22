import { Component, OnInit } from '@angular/core';
import { CommonApplicationService } from '@app/core/services/common-application.service';

@Component({
	selector: 'app-mdra-base',
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
	styles: ``,
	standalone: false,
})
export class MdraBaseComponent implements OnInit {
	constructor(private commonApplicationService: CommonApplicationService) {}

	ngOnInit(): void {
		this.commonApplicationService.setMdraApplicationTitle();
	}
}
