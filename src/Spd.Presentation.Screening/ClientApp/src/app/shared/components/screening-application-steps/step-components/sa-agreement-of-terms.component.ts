import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ServiceTypeCode } from 'src/app/api/models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AppInviteOrgData, CrcFormStepComponent } from '../screening-application.model';

@Component({
    selector: 'app-sa-agreement-of-terms',
    template: `
		<section class="step-section p-3">
		  <form [formGroup]="form" novalidate>
		    <div class="step">
		      <app-step-title title="Terms of Use"></app-step-title>
		      <div class="row">
		        <div
		          class="offset-lg-2 col-lg-8 col-md-12 col-sm-12 conditions px-3 mb-3"
		          (scroll)="onScrollTermsAndConditions($event)"
		          >
		          @if (isPeCrcOrPeCrcVs) {
		            <app-sa-agreement-of-terms-pecrc></app-sa-agreement-of-terms-pecrc>
		          }
		
		          @if (isCrrpa) {
		            <app-sa-agreement-of-terms-crrpa></app-sa-agreement-of-terms-crrpa>
		          }
		
		          @if (isPssoa) {
		            <app-sa-agreement-of-terms-pssoa></app-sa-agreement-of-terms-pssoa>
		          }
		        </div>
		      </div>
		
		      @if (displayValidationErrors && !hasScrolledToBottom) {
		        <div class="row">
		          <div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
		            <div class="alert alert-warning" role="alert">Please scroll to the bottom</div>
		          </div>
		        </div>
		      }
		
		      <div class="row">
		        <div class="offset-lg-2 col-lg-5 col-md-8 col-sm-12">
		          <mat-checkbox formControlName="readAndAcceptTerms">
		            I have read and accept the above Terms of Use
		          </mat-checkbox>
		          @if (
		            (form.get('readAndAcceptTerms')?.dirty || form.get('readAndAcceptTerms')?.touched) &&
		            form.get('readAndAcceptTerms')?.invalid &&
		            form.get('readAndAcceptTerms')?.hasError('required')
		            ) {
		            <mat-error
		              class="mat-option-error"
		              >This is required</mat-error
		              >
		            }
		          </div>
		          <div class="col-lg-3 col-md-4 col-sm-12">
		            @if (isCrrpa) {
		              <a
		                mat-stroked-button
		                color="primary"
		                class="mt-2 float-end"
		                aria-label="Download Terms of Use"
		                download="Crrp-terms-and-conditions"
		                [href]="constants.files.crrpTerms"
		                >
		                <mat-icon>file_download</mat-icon>Terms of Use
		              </a>
		            }
		
		            @if (isPssoa) {
		              <a
		                mat-stroked-button
		                color="primary"
		                class="mt-2 float-end"
		                aria-label="Download Terms of Use"
		                download="Psso-terms-and-conditions"
		                [href]="constants.files.pssoTerms"
		                >
		                <mat-icon>file_download</mat-icon>Terms of Use
		              </a>
		            }
		
		            @if (isPeCrcOrPeCrcVs) {
		              <a
		                mat-stroked-button
		                color="primary"
		                class="mt-2 float-end"
		                aria-label="Download Terms of Use"
		                download="Pe-crc-terms-and-conditions"
		                [href]="constants.files.peCrcOrPeCrcVsTerms"
		                >
		                <mat-icon>file_download</mat-icon>Terms of Use
		              </a>
		            }
		          </div>
		        </div>
		      </div>
		    </form>
		  </section>
		`,
    styles: [
        `
			.conditions {
				border: 1px solid var(--color-grey-light);
				max-height: 400px;
				overflow-y: auto;
				box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
			}
		`,
    ],
    standalone: false
})
export class SaAgreementOfTermsComponent implements CrcFormStepComponent {
	@Input() orgData: AppInviteOrgData | null = null;
	@Input() resetRecaptcha: Subject<void> = new Subject<void>();

	form: FormGroup = this.formBuilder.group({
		readAndAcceptTerms: new FormControl(null, [Validators.requiredTrue]),
	});

	constants = SPD_CONSTANTS;
	hasScrolledToBottom = false;
	displayValidationErrors = false;

	constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService) {}

	getDataToSave(): any {
		return {
			...this.form.value,
		};
	}

	isFormValid(): boolean {
		this.displayValidationErrors = !this.hasScrolledToBottom;
		return this.form.valid && this.hasScrolledToBottom;
	}

	onScrollTermsAndConditions(e: any) {
		if (e.target.scrollHeight < e.target.scrollTop + e.target.offsetHeight) {
			this.hasScrolledToBottom = true;
		}
	}

	get isPeCrcOrPeCrcVs(): boolean {
		return this.orgData?.serviceType === ServiceTypeCode.PeCrc || this.orgData?.serviceType === ServiceTypeCode.PeCrcVs;
	}
	get isCrrpa(): boolean {
		return !this.isPeCrcOrPeCrcVs && this.orgData!.isCrrpa;
	}
	get isPssoa(): boolean {
		return !this.isPeCrcOrPeCrcVs && !this.orgData!.isCrrpa;
	}
}
