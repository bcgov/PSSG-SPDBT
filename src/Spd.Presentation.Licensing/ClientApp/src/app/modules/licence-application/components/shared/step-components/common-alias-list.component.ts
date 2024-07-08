import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { UtilService } from '@app/core/services/util.service';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-common-alias-list',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="py-2" *ngIf="aliasesArray.length === 0">No past aliases or previous names</div>

			<ng-container formArrayName="aliases" *ngFor="let group of aliasesArray.controls; let i = index">
				<div class="row" [formGroupName]="i">
					<div class="col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-sm-12">
						<mat-form-field>
							<mat-label>Given Name <span class="optional-label">(optional)</span></mat-label>
							<input matInput type="text" formControlName="givenName" maxlength="40" />
						</mat-form-field>
					</div>
					<div class="col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-sm-12">
						<mat-form-field>
							<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
							<input matInput type="text" formControlName="middleName1" maxlength="40" />
						</mat-form-field>
					</div>
					<div class="col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-sm-12">
						<mat-form-field>
							<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
							<input matInput type="text" formControlName="middleName2" maxlength="40" />
						</mat-form-field>
					</div>
					<div class="col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-sm-12">
						<mat-form-field [ngClass]="isReadonly ? '' : 'remove-row-space'">
							<mat-label>Surname</mat-label>
							<input
								matInput
								type="text"
								formControlName="surname"
								required
								[errorStateMatcher]="matcher"
								maxlength="40"
							/>
							<mat-error *ngIf="group.get('surname')?.hasError('required')"> This is required </mat-error>
						</mat-form-field>
						<button
							*ngIf="!isReadonly"
							mat-mini-fab
							class="delete-row-button ms-1 mb-3"
							matTooltip="Remove previous name"
							(click)="onDeleteRow(i)"
							aria-label="Remove row"
						>
							<mat-icon>delete_outline</mat-icon>
						</button>
					</div>
				</div>
			</ng-container>

			<div class="row mb-2" *ngIf="isAllowAliasAdd">
				<div class="col-12">
					<button mat-stroked-button (click)="onAddRow()" class="w-auto">
						<mat-icon class="add-icon">add_circle</mat-icon>Add Name
					</button>
				</div>
			</div>
		</form>
	`,
	styles: [
		`
			.mat-mdc-mini-fab {
				top: 10px;
				width: 30px;
				height: 30px;
			}

			.delete-row-button:not([disabled]) {
				background-color: var(--color-red);
				color: var(--color-white);
			}

			.add-icon {
				color: var(--color-green);
			}

			.remove-row-space {
				max-width: 85%;
			}
		`,
	],
})
export class CommonAliasListComponent implements OnInit {
	matcher = new FormErrorStateMatcher();

	aliases: FormArray = this.formBuilder.array([]);

	@Input() form!: FormGroup;
	@Input() isWizardStep = true;
	@Input() isReadonly = false;

	constructor(private formBuilder: FormBuilder, private utilService: UtilService, private dialog: MatDialog) {}

	ngOnInit(): void {
		if (this.isReadonly) {
			this.utilService.disableFormArrayInputs(this.aliasesArray);
		} else {
			this.utilService.enableFormArrayInputs(this.aliasesArray);
		}
	}

	onPreviousNameFlagChange(): void {
		if (this.form.value.previousNameFlag == BooleanTypeCode.Yes) {
			this.onAddRow();
		} else {
			const control = this.form.get('aliases') as FormArray;
			control.clear();
		}
	}

	onAddRow() {
		const aliasesArray = this.form.get('aliases') as FormArray;
		aliasesArray.push(this.newAliasRow());
		this.form.setControl('aliases', aliasesArray);
	}

	onDeleteRow(index: number) {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to remove this previous name?',
			actionText: 'Yes, remove',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					const control = this.form.get('aliases') as FormArray;
					if (control.length == 1) {
						this.form.patchValue({ previousNameFlag: BooleanTypeCode.No });
					}

					control.removeAt(index);
				}
			});
	}

	private newAliasRow(): FormGroup {
		this.form.patchValue({ previousNameFlag: BooleanTypeCode.Yes });

		return this.formBuilder.group({
			id: new FormControl(),
			givenName: new FormControl(),
			middleName1: new FormControl(),
			middleName2: new FormControl(),
			surname: new FormControl('', [FormControlValidators.required]),
		});
	}

	get previousNameFlag(): FormControl {
		return this.form.get('previousNameFlag') as FormControl;
	}

	get isAllowAliasAdd(): boolean {
		return !this.isReadonly && this.aliasesArray.length < SPD_CONSTANTS.maxCount.aliases;
	}

	get aliasesArray(): FormArray {
		return <FormArray>this.form.get('aliases');
	}
}
