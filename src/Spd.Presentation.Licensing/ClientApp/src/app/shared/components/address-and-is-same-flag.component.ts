import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-address-and-is-same-flag',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-md-12 col-sm-12 mb-3" [ngClass]="isWizardStep ? 'offset-lg-2 col-lg-8' : ''">
					<mat-checkbox formControlName="isAddressTheSame">
						{{ isAddressTheSameLabel }}
					</mat-checkbox>
					<ng-container *ngIf="!isAddressTheSame.value">
						<mat-divider class="my-2 mat-divider-primary"></mat-divider>
					</ng-container>
				</div>
			</div>
		</form>

		<ng-container *ngIf="!isAddressTheSame.value">
			<app-address [form]="form" [isWizardStep]="isWizardStep" [isReadonly]="isReadonly"></app-address>
		</ng-container>
	`,
	styles: [],
})
export class AddressAndIsSameFlagComponent implements OnInit {
	@Input() form!: FormGroup;
	@Input() isWizardStep = true;
	@Input() isReadonly = false;
	@Input() isCheckboxReadOnly = false;
	@Input() isAddressTheSameLabel = 'The address is the same';

	ngOnInit(): void {
		if (this.isCheckboxReadOnly) {
			this.isAddressTheSame.disable({ emitEvent: false });
		} else {
			this.isAddressTheSame.enable();
		}
	}

	get isAddressTheSame(): FormControl {
		return this.form.get('isAddressTheSame') as FormControl;
	}
}
