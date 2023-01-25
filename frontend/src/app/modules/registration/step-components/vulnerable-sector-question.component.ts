import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RegistrationFormStepComponent } from '../registration.component';

export class VulnerableSectorQuestionModel {
	employeeInteractionFlag: string = '';
}

@Component({
	selector: 'app-vulnerable-sector-question',
	template: `
		<div class="step">
			<div class="title mb-5">Tell us a bit more about your employees:</div>
			<div class="row">
				<div class="col-md-3 col-sm-6 mb-3">
					<div
						class="vulnerable-sector-question__box"
						(click)="onDataChange('CHILDREN')"
						[ngClass]="{ 'active-selection': stepData.employeeInteractionFlag == 'CHILDREN' }"
					>
						<ng-container *ngIf="displayHelp1; else noHelp1">
							<div class="vulnerable-sector-question__box__info">
								<mat-icon class="info-icon" (click)="onViewHelp1($event)">close</mat-icon>
							</div>
							<div class="px-2 pb-3">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
								dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
								ex ea commodo consequat.
							</div>
						</ng-container>
						<ng-template #noHelp1>
							<div class="vulnerable-sector-question__box__info">
								<mat-icon class="info-icon" (click)="onViewHelp1($event)">help_outline</mat-icon>
							</div>
							<div class="px-2 pb-3">
								<div class="info-icon"><mat-icon>family_restroom</mat-icon></div>
								My employees work with <strong>children</strong>
							</div>
						</ng-template>
					</div>
				</div>
				<div class="col-md-3 col-sm-6 mb-3">
					<div
						class="vulnerable-sector-question__box"
						(click)="onDataChange('ADULTS')"
						[ngClass]="{ 'active-selection': stepData.employeeInteractionFlag == 'ADULTS' }"
					>
						<ng-container *ngIf="displayHelp2; else noHelp2">
							<div class="vulnerable-sector-question__box__info">
								<mat-icon class="info-icon" (click)="onViewHelp2($event)">close</mat-icon>
							</div>
							<div class="px-2 pb-3">
								Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
							</div>
						</ng-container>
						<ng-template #noHelp2>
							<div class="vulnerable-sector-question__box__info">
								<mat-icon class="info-icon" (click)="onViewHelp2($event)">help_outline</mat-icon>
							</div>
							<div class="px-2 pb-3">
								<div class="info-icon"><mat-icon>elderly</mat-icon></div>
								My employees work with <strong>vulnerable adults</strong>
							</div>
						</ng-template>
					</div>
				</div>
				<div class="col-md-3 col-sm-6 mb-3">
					<div
						class="vulnerable-sector-question__box px-2 pb-3"
						style="padding-top: 32px;"
						(click)="onDataChange('CHILDREN_ADULTS')"
						[ngClass]="{ 'active-selection': stepData.employeeInteractionFlag == 'CHILDREN_ADULTS' }"
					>
						<div class="info-icon"><mat-icon>diversity_3</mat-icon></div>
						My employees work with <strong>children and vulnerable adults</strong>
					</div>
				</div>
				<div class="col-md-3 col-sm-6 mb-3">
					<div
						class="vulnerable-sector-question__box px-2 pb-3"
						style="padding-top: 32px;"
						(click)="onDataChange('NEITHER')"
						[ngClass]="{ 'active-selection': stepData.employeeInteractionFlag == 'NEITHER' }"
					>
						<div class="info-icon"><mat-icon>person_off</mat-icon></div>
						My employee <strong>do not work</strong> with children or vulnerable adults
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

			.vulnerable-sector-question {
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
export class VulnerableSectorQuestionComponent implements RegistrationFormStepComponent {
	displayHelp1 = false;
	displayHelp2 = false;

	@Input() stepData!: VulnerableSectorQuestionModel;
	@Output() formValidity: EventEmitter<boolean> = new EventEmitter<boolean>();

	onDataChange(_val: string) {
		this.stepData.employeeInteractionFlag = _val;
		this.formValidity.emit(this.isFormValid());
	}

	getDataToSave(): any {
		return this.stepData;
	}

	isFormValid(): boolean {
		return this.stepData.employeeInteractionFlag ? true : false;
	}

	onViewHelp1(event: any): void {
		this.displayHelp1 = !this.displayHelp1;
		event.stopPropagation();
	}

	onViewHelp2(event: any): void {
		this.displayHelp2 = !this.displayHelp2;
		event.stopPropagation();
	}
}
