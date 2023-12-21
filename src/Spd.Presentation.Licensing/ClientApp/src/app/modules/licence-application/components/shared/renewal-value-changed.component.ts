import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-renewal-value-changed',
	template: `
		<div class="row">
			<div class="col-md-8 col-sm-12 mx-auto">
				<div class="text-minor-heading my-4" *ngIf="originalValue === true">{{ yesString }}</div>
				<div class="text-minor-heading my-4" *ngIf="originalValue === false">{{ noString }}</div>

				<div class="pb-3">
					Has this changed since you last submitted your licence?
					<div class="mt-3">
						<button
							mat-stroked-button
							class="w-auto me-3"
							color="primary"
							aria-label="Value has not changed"
							(click)="onValueHasChanged(false)"
						>
							No
						</button>
						<button
							mat-stroked-button
							class="w-auto"
							color="primary"
							aria-label="Value has changed"
							(click)="onValueHasChanged(true)"
						>
							Yes
						</button>
					</div>
				</div>
				<mat-divider class="mat-divider-main my-3" *ngIf="hasChanged"></mat-divider>
			</div>
		</div>
	`,
	styles: [],
})
export class RenewalValueChangedComponent {
	hasChanged: boolean | null = null;

	@Input() originalValue: boolean | null = null;
	@Input() yesString = '';
	@Input() noString = '';

	@Output() valueChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

	onValueHasChanged(value: boolean) {
		this.hasChanged = value;
		this.valueChanged.emit(value);
	}
}
