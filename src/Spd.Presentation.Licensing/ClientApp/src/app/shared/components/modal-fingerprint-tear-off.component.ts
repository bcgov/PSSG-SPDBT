import { Component } from '@angular/core';

@Component({
	selector: 'app-modal-fingerprint-tear-off',
	template: `
		<div mat-dialog-title class="mat-dialog-title">
			Sample Tear-off Section
			<mat-divider></mat-divider>
		</div>
		<div mat-dialog-content>
			<img class="image mt-4" src="/assets/fingerprint-tear-off.svg" alt="Fingerprint tear off section" />
		</div>
		<div mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="offset-lg-9 col-lg-3 offset-md-8 col-md-4 col-sm-12 mb-2">
					<button mat-stroked-button mat-dialog-close class="large" color="primary">Close</button>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.image {
				width: 100%;
			}
		`,
	],
})
export class ModalFingerprintTearOffComponent {}
