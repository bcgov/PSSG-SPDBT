import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { DialogComponent, DialogOptions } from './dialog.component';

@Component({
	selector: 'app-form-aliases',
	template: `
		<form [formGroup]="form" novalidate>
		  <div class="row">
		    <div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12" [ngClass]="isWizardStep ? 'mx-auto' : ''">
		      <mat-radio-group
		        aria-label="Select an option"
		        formControlName="previousNameFlag"
		        (change)="onPreviousNameFlagChange()"
		        >
		        <mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
		        @if (isWizardStep) {
		          <mat-divider class="my-2"></mat-divider>
		        }
		        <mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
		      </mat-radio-group>
		      @if (
		        (form.get('previousNameFlag')?.dirty || form.get('previousNameFlag')?.touched) &&
		        form.get('previousNameFlag')?.invalid &&
		        form.get('previousNameFlag')?.hasError('required')
		        ) {
		        <mat-error
		          class="mat-option-error"
		          >This is required</mat-error
		          >
		        }
		      </div>
		    </div>
		    @if (previousNameFlag.value === booleanTypeCodes.Yes) {
		      <div @showHideTriggerSlideAnimation>
		        <div class="row">
		          <div class="col-xl-10 col-lg-12 col-md-12 col-sm-12" [ngClass]="isWizardStep ? 'mx-auto' : ''">
		            <mat-divider class="mb-3 mat-divider-primary"></mat-divider>
		            <div class="text-minor-heading mb-2">Previous Names or Aliases</div>
		            @for (group of aliasesArray.controls; track group; let i = $index) {
		              <ng-container formArrayName="aliases">
		                <div class="row" [formGroupName]="i">
		                  <div class="col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-sm-12">
		                    <mat-form-field>
		                      <mat-label>Given Name</mat-label>
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
		                    <mat-form-field [ngClass]="moreThanOneRowExists ? 'more-than-one-row' : ''">
		                      <mat-label>Surname</mat-label>
		                      <input
		                        matInput
		                        type="text"
		                        formControlName="surname"
		                        required
		                        [errorStateMatcher]="matcher"
		                        maxlength="40"
		                        />
		                        @if (group.get('surname')?.hasError('required')) {
		                          <mat-error> This is required </mat-error>
		                        }
		                      </mat-form-field>
		                      @if (moreThanOneRowExists) {
		                        <button
		                          mat-mini-fab
		                          class="delete-row-button ms-1 mb-3"
		                          matTooltip="Remove previous name"
		                          (click)="onDeleteRow(i)"
		                          aria-label="Remove this previous name"
		                          >
		                          <mat-icon>delete_outline</mat-icon>
		                        </button>
		                      }
		                    </div>
		                  </div>
		                </ng-container>
		              }
		              @if (isAllowAliasAdd) {
		                <div class="row mb-2">
		                  <div class="col-12">
		                    <button mat-stroked-button (click)="onAddRow()" class="w-auto" aria-label="Add an alias">
		                      <mat-icon class="add-icon">add_circle</mat-icon>Add Name
		                    </button>
		                  </div>
		                </div>
		              }
		            </div>
		          </div>
		        </div>
		      }
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

			.more-than-one-row {
				max-width: 85%;
			}
		`,
	],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class FormAliasesComponent {
	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	@Input() form!: FormGroup;
	@Input() isWizardStep = true;

	constructor(
		private formBuilder: FormBuilder,
		private dialog: MatDialog
	) {}

	onPreviousNameFlagChange(): void {
		if (this.form.value.previousNameFlag == BooleanTypeCode.Yes) {
			this.onAddRow();
		} else {
			const aliasesArray = this.form.get('aliases') as FormArray;
			while (aliasesArray.length) {
				aliasesArray.removeAt(0);
			}
			this.form.setControl('aliases', aliasesArray);
		}
	}

	onAddRow() {
		const aliasesArray = this.form.get('aliases') as FormArray;
		aliasesArray.push(this.newAliasRow());
		this.form.setControl('aliases', aliasesArray);
	}

	onDeleteRow(index: number) {
		const control = this.form.get('aliases') as FormArray;
		if (control.length == 1) {
			const data: DialogOptions = {
				icon: 'warning',
				title: 'Remove row',
				message: 'This row cannot be removed. At least one row must exist.',
				cancelText: 'Close',
			};

			this.dialog.open(DialogComponent, { data });
			return;
		}

		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to remove this previous name?',
			actionText: 'Remove',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					const control = this.form.get('aliases') as FormArray;
					control.removeAt(index);
				}
			});
	}

	private newAliasRow(): FormGroup {
		return this.formBuilder.group({
			givenName: [''],
			middleName1: [''],
			middleName2: [''],
			surname: ['', [FormControlValidators.required]],
		});
	}

	get previousNameFlag(): FormControl {
		return this.form.get('previousNameFlag') as FormControl;
	}

	get moreThanOneRowExists(): boolean {
		return this.aliasesArray.length > 1;
	}

	get isAllowAliasAdd(): boolean {
		return this.aliasesArray.length < SPD_CONSTANTS.maxCount.aliases;
	}

	get aliasesArray(): FormArray {
		return <FormArray>this.form.get('aliases');
	}
}
