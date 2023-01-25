import { Component, EventEmitter, Input, Output } from '@angular/core';
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
				<div class="row">
					<ng-container *ngFor="let option of options; let i = index">
						<div class="col-md-4 col-sm-6 mb-3">
							<div
								class="organization-options__box"
								(click)="onDataChange(option.code)"
								[ngClass]="{ 'active-selection': stepData.organizationType == option.code }"
							>
								<ng-container *ngIf="option.showHelp; else noHelp">
									<div class="organization-options__box__info">
										<mat-icon class="info-icon" (click)="onViewHelp(option, $event)">close</mat-icon>
									</div>
									<div class="px-2 pb-3">
										{{ option.helpText }}
									</div>
								</ng-container>
								<ng-template #noHelp>
									<div class="organization-options__box__info">
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
							<mat-select [(value)]="stepData.organizationType" (selectionChange)="onDataChange2($event)">
								<ng-container *ngFor="let option of options; let i = index">
									<mat-option [value]="option.code">{{ option.text }}</mat-option>
								</ng-container>
							</mat-select>
						</mat-form-field>
					</div>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.info-icon {
				display: block;
				text-align: center;

				.mat-icon {
					color: var(--color-primary);
					font-size: 50px;
					height: 50px;
					width: 50px;
				}
			}

			.organization-options {
				&__box {
					height: 100%;
					border-radius: 4px;
					border: 1px solid grey;
					box-shadow: 0 3px 1px -2px #0003, 0 2px 2px #00000024, 0 1px 5px #0000001f;
					text-align: center;

					&__info {
						padding: 4px;
						display: grid;
						justify-content: end;
					}
				}

				&__box:hover {
					color: var(--color-primary-light);
					box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;

					mat-icon {
						color: var(--color-primary-light);
					}
				}
			}
		`,
	],
})
export class OrganizationOptionsComponent implements RegistrationFormStepComponent {
	@Input() stepData!: OrganizationOptionsModel;
	@Output() formValidity: EventEmitter<boolean> = new EventEmitter<boolean>();

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
			text: 'A mainly government-owned corporation',
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
	];

	options_vol = [
		{
			code: '1',
			icon: 'family_restroom',
			text: 'A registered non profit organization',
			showHelp: false,
			helpText:
				'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
		},
		{
			code: '2',
			icon: 'family_restroom',
			text: 'A non profit organization registered with BC Corporate Registries',
			showHelp: false,
			helpText:
				'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		},
		{
			code: '3',
			icon: 'family_restroom',
			text: 'A childcare facility or daycare',
			showHelp: false,
			helpText: 'Sed ut perspiciatis unde omnis iste natus error.',
		},
		{
			code: '4',
			icon: 'family_restroom',
			text: 'A regional health board, public health facility, private hospital, or care facility',
			showHelp: false,
			helpText:
				'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
		},
		{
			code: '5',
			icon: 'family_restroom',
			text: 'A school board, francophone education authority, or independent school authority',
			showHelp: false,
			helpText: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
		},
		{
			code: '6',
			icon: 'family_restroom',
			text: 'An individual or business that receives operating funds from the B.C. government',
			showHelp: false,
			helpText:
				'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		},
		{
			code: '7',
			icon: 'family_restroom',
			text: 'A mainly government-owned corporation',
			showHelp: false,
			helpText: 'Et harum quidem rerum facilis est et expedita distinctio.',
		},
		{
			code: '8',
			icon: 'family_restroom',
			text: 'BC Public Service or a related agency',
			showHelp: false,
			helpText: 'Sed ut perspiciatis unde omnis iste natus error.',
		},
		{
			code: '9',
			icon: 'family_restroom',
			text: 'A registered health professional or social worker',
			showHelp: false,
			helpText: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
		},
		{
			code: '10',
			icon: 'family_restroom',
			text: 'A municipality',
			showHelp: false,
			helpText: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
		},
		{
			code: '11',
			icon: 'family_restroom',
			text: 'A post-secondary institution',
			showHelp: false,
			helpText: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
		},
	];

	onDataChange(_val: string) {
		this.stepData.organizationType = _val;
		this.formValidity.emit(this.isFormValid());
	}

	onDataChange2(_val: MatSelectChange) {
		this.stepData.organizationType = _val.value;
		this.formValidity.emit(this.isFormValid());
	}

	getDataToSave(): OrganizationOptionsModel {
		return this.stepData;
	}

	isFormValid(): boolean {
		return this.stepData.organizationType ? true : false;
	}

	onViewHelp(option: any, event: any): void {
		option.showHelp = !option.showHelp;
		event.stopPropagation();
	}
}
