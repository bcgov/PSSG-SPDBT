import { Component } from '@angular/core';

@Component({
	selector: 'app-licence-application',
	template: `
		<div class="container my-3">
			<div class="row">
				<div class="col-12">
					<router-outlet></router-outlet>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class LicenceApplicationComponent {}
