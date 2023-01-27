import { Component, Input } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { RegistrationFormStepComponent } from '../registration.component';

export class OrganizationOptionsModel {
	organizationType: string = '';
}

@Component({
	selector: 'app-organization-options',
	template: `
		<div class="step">
			<div class="title mb-5">Select how would you best describe your organization?</div>
			<div class="d-none d-md-block">
				<div class="step-container row">
					<ng-container *ngFor="let option of options; let i = index">
						<div class="col-md-3 col-sm-6 mb-3">
							<div
								class="step-container__box"
								(click)="onDataChange(option.code)"
								[ngClass]="{ 'active-selection': organizationType == option.code }"
							>
								<ng-container *ngIf="option.showHelp; else noHelp">
									<div class="step-container__box__info">
										<mat-icon class="info-icon" (click)="onViewHelp(option, $event)">close</mat-icon>
									</div>
									<div class="px-2 pb-3">
										{{ option.helpText }}
									</div>
								</ng-container>
								<ng-template #noHelp>
									<div class="step-container__box__info">
										<mat-icon class="info-icon" (click)="onViewHelp(option, $event)">help_outline</mat-icon>
									</div>
									<div class="px-2 pb-3">
										<div class="info-icon">
											<mat-icon>{{ option.icon }}</mat-icon>
										</div>
										{{ option.text }}
									</div>
								</ng-template>
							</div>
						</div>
					</ng-container>
				</div>
			</div>
			<div class="d-md-none">
				<div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<mat-form-field>
							<mat-select [(value)]="organizationType" (selectionChange)="onDataChange2($event)">
								<ng-container *ngFor="let option of options; let i = index">
									<mat-option [value]="option.code">{{ option.text }}</mat-option>
								</ng-container>
							</mat-select>
						</mat-form-field>
						<!--  style="display: inherit;" <div *ngIf="organizationType" style="position: inherit;top: 15px;left: 2px;">
							<mat-icon class="info-icon" (click)="onViewHelpForSelection()">help_outline</mat-icon>
						</div> -->
					</div>
				</div>
				<!-- <div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12">
						{{ currentHelpText }}
					</div>
				</div> -->
			</div>
			<mat-error style="text-align: center;" *ngIf="isDirtyAndInvalid">An option must be selected</mat-error>
		</div>
	`,
	styles: [],
})
export class OrganizationOptionsComponent implements RegistrationFormStepComponent {
	organizationType = '';
	// currentHelpText = '';
	isDirtyAndInvalid = false;

	private _registrationTypeCode!: string;
	@Input() set registrationTypeCode(value: string) {
		this.options = value == 'EMP' ? this.options_emp : this.options_vol;
	}
	get registrationTypeCode(): string {
		return this._registrationTypeCode;
	}

	options: Array<any> = [];

	options_emp = [
		{
			code: '1',
			icon: 'family_restroom',
			text: 'A childcare facility or daycare',
			showHelp: false,
			helpText:
				'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
		},
		{
			code: '2',
			icon: 'family_restroom',
			text: 'A health board, hospital, or care facility',
			showHelp: false,
			helpText:
				'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		},
		{
			code: '3',
			icon: 'family_restroom',
			text: 'A school board or education authority',
			showHelp: false,
			helpText: 'Sed ut perspiciatis unde omnis iste natus error.',
		},
		{
			code: '4',
			icon: 'family_restroom',
			text: 'An organization or person who receives ongoing provincial funding',
			showHelp: false,
			helpText:
				'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
		},
		{
			code: '5',
			icon: 'family_restroom',
			text: 'A mainly government-owned corporation (for example, BC Housing)',
			showHelp: false,
			helpText: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
		},
		{
			code: '6',
			icon: 'family_restroom',
			text: 'A provincial government ministry or related agency',
			showHelp: false,
			helpText:
				'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		},
		{
			code: '7',
			icon: 'family_restroom',
			text: 'A registered health professional or social worker',
			showHelp: false,
			helpText: 'Et harum quidem rerum facilis est et expedita distinctio.',
		},
		{
			code: '8',
			icon: 'family_restroom',
			text: 'A governing body under the Health Professions Act or the Social Workers Act',
			showHelp: false,
			helpText: 'Sed ut perspiciatis unde omnis iste natus error.',
		},
		{
			code: '9',
			icon: 'family_restroom',
			text: 'An act- or minister-appointed board, commission, or council',
			showHelp: false,
			helpText: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
		},
		{
			code: '10',
			icon: 'family_restroom',
			text: 'None of these options apply to my organization',
			showHelp: false,
			helpText: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
		},
	];

	options_vol = [
		{
			code: '11',
			icon: 'family_restroom',
			text: 'A registered non profit organization',
			showHelp: false,
			helpText:
				'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
		},
		{
			code: '12',
			icon: 'family_restroom',
			text: 'A childcare facility or daycare',
			showHelp: false,
			helpText: 'Sed ut perspiciatis unde omnis iste natus error.',
		},
		{
			code: '13',
			icon: 'family_restroom',
			text: 'A health board, hospital, or care facility',
			showHelp: false,
			helpText:
				'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
		},
		{
			code: '14',
			icon: 'family_restroom',
			text: 'A school board or education authority',
			showHelp: false,
			helpText: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
		},
		{
			code: '15',
			icon: 'family_restroom',
			text: 'An organization or person who receives ongoing provincial funding',
			showHelp: false,
			helpText:
				'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		},
		{
			code: '16',
			icon: 'family_restroom',
			text: 'A mainly government-owned corporation (for example, BC Housing)',
			showHelp: false,
			helpText: 'Et harum quidem rerum facilis est et expedita distinctio.',
		},
		{
			code: '17',
			icon: 'family_restroom',
			text: 'A provincial government ministry or related agency',
			showHelp: false,
			helpText: 'Sed ut perspiciatis unde omnis iste natus error.',
		},
		{
			code: '18',
			icon: 'family_restroom',
			text: 'A registered health professional or social worker',
			showHelp: false,
			helpText: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
		},
		{
			code: '19',
			icon: 'family_restroom',
			text: 'A municipality',
			showHelp: false,
			helpText: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
		},
		{
			code: '20',
			icon: 'family_restroom',
			text: 'A post-secondary institution',
			showHelp: false,
			helpText: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
		},
	];

	onDataChange(_val: string) {
		this.organizationType = _val;
		const isValid = this.isFormValid();
		this.isDirtyAndInvalid = !isValid;
	}

	onDataChange2(_val: MatSelectChange) {
		this.organizationType = _val.value;
		const isValid = this.isFormValid();
		this.isDirtyAndInvalid = !isValid;
	}

	getDataToSave(): OrganizationOptionsModel {
		return { organizationType: this.organizationType };
	}

	isFormValid(): boolean {
		const isValid = this.organizationType ? true : false;
		this.isDirtyAndInvalid = !isValid;
		return isValid;
	}

	onViewHelp(option: any, event: any): void {
		option.showHelp = !option.showHelp;
		event.stopPropagation();
	}

	// onViewHelpForSelection(): void {
	// 	const currentOption = this.options.find((opt) => opt.code == this.organizationType);
	// 	this.currentHelpText = currentOption ? currentOption.helpText : '';
	// }
}
