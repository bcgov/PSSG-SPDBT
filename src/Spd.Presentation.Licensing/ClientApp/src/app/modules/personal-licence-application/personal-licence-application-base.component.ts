import { Component } from '@angular/core';

@Component({
    selector: 'app-personal-licence-application-base',
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
    standalone: false
})
export class PersonalLicenceApplicationBaseComponent {}
