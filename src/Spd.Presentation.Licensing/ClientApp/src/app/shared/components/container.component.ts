import { Component } from '@angular/core';

@Component({
	selector: 'app-container',
	template: `
		<div class="container px-0 my-0 px-md-2 my-md-3">
			<!-- hide padding/margin on smaller screens -->
			<div class="row">
				<div class="col-12">
					<ng-content></ng-content>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class ContainerComponent {}
