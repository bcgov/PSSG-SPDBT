import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-renewal-alert',
	template: `
		<div class="row">
			<div class="col-md-8 col-sm-12 mx-auto">
				<div class="alert" role="alert" class="alert-info py-2 mb-3">
					<div class="title lh-base">
						<div class="fs-3" [innerHtml]="title"></div>
						<div class="fs-6 mt-3" *ngIf="subtitle" [innerHtml]="subtitle"></div>
					</div>
					<div class="my-2">
						<ng-content #alertContent> </ng-content>
					</div>
				</div>
				<!-- <mat-divider class="mat-divider-main mb-4"></mat-divider> -->
			</div>
		</div>
	`,
	styles: [
		`
			.alert-info {
				color: #0c5460;
				border-color: #fcba19;
				border-width: 2px;
				border-style: solid;
				border-radius: 0;
			}
		`,
	],
})
export class RenewalAlertComponent {
	@Input() title = 'Confirm this information';
	@Input() subtitle = 'Update any information that has changed since your last application';
}
