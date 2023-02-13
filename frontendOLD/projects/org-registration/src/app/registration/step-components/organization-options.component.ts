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
					<div class="col-8 mx-auto">
						<div class="row">
							<ng-container *ngFor="let option of options; let i = index">
								<div class="col-lg-4 col-md-4 col-sm-6 mb-3">
									<div
										class="step-container__box"
										(click)="onDataChange(option.code)"
										[ngClass]="{ 'active-selection-border': organizationType == option.code }"
									>
										<ng-container *ngIf="option.showHelp; else noHelp">
											<div class="step-container__box__info">
												<mat-icon class="larger-icon" (click)="onViewHelp(option, $event)">close</mat-icon>
											</div>
											<div class="px-2 pb-3">
												{{ option.helpText }}
											</div>
										</ng-container>
										<ng-template #noHelp>
											<div class="step-container__box__info">
												<mat-icon class="larger-icon" (click)="onViewHelp(option, $event)">help_outline</mat-icon>
											</div>
											<ng-container *ngIf="organizationType != option.code; else selectedIcon">
												<div class="card-icon-container">
													<img class="card-icon-container__icon" [src]="option.icon" />
												</div>
												<div class="px-2 pb-3">
													{{ option.text }}
												</div>
											</ng-container>

											<ng-template #selectedIcon>
												<div class="card-icon-container">
													<img class="card-icon-container__icon" [src]="option.selectedIcon" />
												</div>
												<div class="px-2 pb-3">
													{{ option.text }}
												</div>
											</ng-template>
										</ng-template>
									</div>
								</div>
							</ng-container>
						</div>
					</div>
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
							<mat-icon class="larger-icon" (click)="onViewHelpForSelection()">help_outline</mat-icon>
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
	styles: [
		`
			.card-icon-container {
				&__icon {
					max-width: 4em;
				}
			}

			.card-icon-container {
				display: block;
				text-align: center;
			}
		`,
	],
})
export class OrganizationOptionsComponent implements RegistrationFormStepComponent {
	organizationType = '';
	// currentHelpText = '';
	isDirtyAndInvalid = false;
	selectedIconImages = new Array();

	private _registrationTypeCode!: string;
	@Input() set registrationTypeCode(value: string) {
		// Preload the 'selectedIcon' images... prevents flicker when you click on card.
		if (value == 'EMP') {
			this.options = this.options_emp;
			this.options_emp.forEach((opt) => {
				const tmp = new Image();
				tmp.src = opt.selectedIcon;
				this.selectedIconImages.push(tmp);
			});
		} else {
			this.options = this.options_vol;
			this.options_vol.forEach((opt) => {
				const tmp = new Image();
				tmp.src = opt.selectedIcon;
				this.selectedIconImages.push(tmp);
			});
		}
	}
	get registrationTypeCode(): string {
		return this._registrationTypeCode;
	}

	options: Array<any> = [];

	options_emp = [
		{
			code: '1',
			icon: '/assets/1a.png',
			selectedIcon: '/assets/1b.png',
			text: 'A childcare facility or daycare',
			showHelp: false,
			helpText:
				'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
		},
		{
			code: '2',
			icon: '/assets/2a.png',
			selectedIcon: '/assets/2b.png',
			text: 'A health board, hospital, or care facility',
			showHelp: false,
			helpText:
				'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		},
		{
			code: '3',
			icon: '/assets/6a.png',
			selectedIcon: '/assets/6b.png',
			text: 'A school board or education authority',
			showHelp: false,
			helpText: 'Sed ut perspiciatis unde omnis iste natus error.',
		},
		{
			code: '4',
			icon: '/assets/8a.png',
			selectedIcon: '/assets/8b.png',
			text: 'An organization or person who receives ongoing provincial funding',
			showHelp: false,
			helpText:
				'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
		},
		{
			code: '5',
			icon: '/assets/3a.png',
			selectedIcon: '/assets/3b.png',
			text: 'A mainly government-owned corporation (for example, BC Housing)',
			showHelp: false,
			helpText: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
		},
		{
			code: '6',
			icon: '/assets/4a.png',
			selectedIcon: '/assets/4b.png',
			text: 'A provincial government ministry or related agency',
			showHelp: false,
			helpText:
				'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		},
		{
			code: '7',
			icon: '/assets/5a.png',
			selectedIcon: '/assets/5b.png',
			text: 'A registered health professional or social worker',
			showHelp: false,
			helpText: 'Et harum quidem rerum facilis est et expedita distinctio.',
		},
		{
			code: '8',
			icon: '/assets/11a.png',
			selectedIcon: '/assets/11b.png',
			text: 'A governing body under the Health Professions Act or the Social Workers Act',
			showHelp: false,
			helpText: 'Sed ut perspiciatis unde omnis iste natus error.',
		},
		{
			code: '9',
			icon: '/assets/9a.png',
			selectedIcon: '/assets/9b.png',
			text: 'An act- or minister-appointed board, commission, or council',
			showHelp: false,
			helpText: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
		},
	];

	options_vol = [
		{
			code: '11',
			icon: '/assets/11a.png',
			selectedIcon: '/assets/11b.png',
			text: 'A registered non profit organization',
			showHelp: false,
			helpText:
				'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
		},
		{
			code: '12',
			icon: '/assets/11a.png',
			selectedIcon: '/assets/11b.png',
			text: 'A non profit organization registered with BC Corporate Registries',
			showHelp: false,
			helpText: 'Sed ut perspiciatis unde omnis iste natus error.',
		},
		{
			code: '13',
			icon: '/assets/1a.png',
			selectedIcon: '/assets/1b.png',
			text: 'A childcare facility or daycare',
			showHelp: false,
			helpText: 'Sed ut perspiciatis unde omnis iste natus error.',
		},
		{
			code: '14',
			icon: '/assets/2a.png',
			selectedIcon: '/assets/2b.png',
			text: 'A regional health board, public health facility, private hospital, or care facility',
			showHelp: false,
			helpText:
				'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
		},
		{
			code: '15',
			icon: '/assets/12a.png',
			selectedIcon: '/assets/12b.png',
			text: 'A school board, francophone education authority, or independent school authority',
			showHelp: false,
			helpText: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
		},
		{
			code: '16',
			icon: '/assets/8a.png',
			selectedIcon: '/assets/8b.png',
			text: 'An individual or business that receives operating funds from the B.C. government',
			showHelp: false,
			helpText:
				'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		},
		{
			code: '17',
			icon: '/assets/3a.png',
			selectedIcon: '/assets/3b.png',
			text: 'A mainly government-owned corporation (for example, BC Housing)',
			showHelp: false,
			helpText: 'Et harum quidem rerum facilis est et expedita distinctio.',
		},
		{
			code: '18',
			icon: '/assets/12a.png',
			selectedIcon: '/assets/12b.png',
			text: 'BC Public Service or a related agency',
			showHelp: false,
			helpText: 'Sed ut perspiciatis unde omnis iste natus error.',
		},
		{
			code: '19',
			icon: '/assets/5a.png',
			selectedIcon: '/assets/5b.png',
			text: 'A registered health professional or social worker',
			showHelp: false,
			helpText: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
		},
		{
			code: '20',
			icon: '/assets/10a.png',
			selectedIcon: '/assets/10b.png',
			text: 'A municipality',
			showHelp: false,
			helpText: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
		},
		{
			code: '21',
			icon: '/assets/12a.png',
			selectedIcon: '/assets/12b.png',
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

	clearCurrentData(): void {
		this.organizationType = '';
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
