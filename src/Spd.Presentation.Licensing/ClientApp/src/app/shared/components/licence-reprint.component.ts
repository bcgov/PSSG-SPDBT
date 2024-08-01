import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';

@Component({
	selector: 'app-licence-reprint',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
					<mat-radio-group aria-label="Select an option" formControlName="reprintLicence">
						<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
					</mat-radio-group>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('reprintLicence')?.dirty || form.get('reprintLicence')?.touched) &&
							form.get('reprintLicence')?.invalid &&
							form.get('reprintLicence')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class LicenceReprintComponent {
	booleanTypeCodes = BooleanTypeCode;

	@Input() form!: FormGroup;
}
