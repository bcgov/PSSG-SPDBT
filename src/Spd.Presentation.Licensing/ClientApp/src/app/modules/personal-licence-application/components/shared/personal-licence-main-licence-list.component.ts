/* eslint-disable @angular-eslint/template/click-events-have-key-events */
/* eslint-disable @angular-eslint/template/click-events-have-key-events */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ServiceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MainLicenceResponse } from '@app/core/services/common-application.service';

@Component({
	selector: 'app-personal-licence-main-licence-list',
	template: `
		@if (activeLicences.length > 0) {
		  <div class="mb-3">
		    <div class="text-minor-heading py-3">Active Licences/Permits</div>
		    @for (licence of activeLicences; track licence; let i = $index) {
		      <div
		        class="summary-card-section summary-card-section__green mb-3 px-4 py-3"
		        >
		        <div class="row">
		          <div class="col-lg-2">
		            <div class="text-minor-heading">
		              {{ licence.serviceTypeCode | options: 'ServiceTypes' }}
		            </div>
		          </div>
		          <div class="col-lg-10">
		            <div class="row">
		              <div class="col-lg-3">
		                <div class="d-block text-muted mt-2 mt-lg-0">Licence Number</div>
		                <div class="text-data fw-bold">{{ licence.licenceNumber }}</div>
		              </div>
		              <div class="col-lg-3">
		                <div class="d-block text-muted mt-2 mt-lg-0">Licence Term</div>
		                <div class="text-data fw-bold">{{ licence.licenceTermCode | options: 'LicenceTermTypes' }}</div>
		              </div>
		              <div class="col-lg-3">
		                <div class="d-block text-muted mt-2 mt-lg-0">Expiry Date</div>
		                <div class="text-data fw-bold" [ngClass]="licence.isRenewalPeriod ? 'error-color' : ''">
		                  {{ licence.expiryDate | formatDate: formalDateFormat }}
		                </div>
		              </div>
		              <div class="col-lg-3 text-end">
		                <mat-chip-option [selectable]="false" class="appl-chip-option mat-chip-green">
		                  <mat-icon class="appl-chip-option-item">check_circle</mat-icon>
		                  <span class="appl-chip-option-item mx-2 fs-5">Active</span>
		                </mat-chip-option>
		              </div>
		              <mat-divider class="my-2"></mat-divider>
		            </div>
		            @if (licence.serviceTypeCode === serviceTypeCodes.SecurityWorkerLicence) {
		              <div class="row mb-2">
		                <div class="col-lg-6">
		                  <div class="d-block text-muted mt-2 mt-lg-0">Licence Categories</div>
		                  <div class="text-data">
		                    <ul class="m-0">
		                      @for (catCode of licence.licenceCategoryCodes; track catCode; let i = $index) {
		                        <li>{{ catCode | options: 'WorkerCategoryTypes' }}</li>
		                      }
		                    </ul>
		                  </div>
		                </div>
		                @if (licence.hasSecurityGuardCategory) {
		                  <div class="col-lg-3">
		                    <div class="d-block text-muted mt-2">Dog Authorization</div>
		                    <div class="text-data">
		                      @if (licence.dogAuthorization) {
		                        Authorized to use dogs
		                      } @else {
		                        Not authorized to use dogs
		                      }
		                    </div>
		                    @if (licence.dogAuthorizationExpiryDate) {
		                      <div class="d-block text-muted mt-2">Expiry Date</div>
		                      <div class="text-data">
		                        {{ licence.dogAuthorizationExpiryDate | formatDate: formalDateFormat }}
		                      </div>
		                    }
		                  </div>
		                  <div class="col-lg-3">
		                    <div class="d-block text-muted mt-2">Restraint Authorization</div>
		                    <div class="text-data">
		                      @if (licence.restraintAuthorization) {
		                        Authorized to use restraints
		                      } @else {
		                        Not authorized to use restraints
		                      }
		                    </div>
		                    @if (licence.restraintAuthorizationExpiryDate) {
		                      <div class="d-block text-muted mt-2">Expiry Date</div>
		                      <div class="text-data">
		                        {{ licence.restraintAuthorizationExpiryDate | formatDate: formalDateFormat }}
		                      </div>
		                    }
		                  </div>
		                }
		              </div>
		              <mat-divider class="my-2"></mat-divider>
		              <div class="row mb-2">
		                <div class="col-lg-9">
		                  The following updates have a
		                  {{ licence.licenceReprintFee | currency: 'CAD' : 'symbol-narrow' : '1.0' }} licence reprint fee:
		                  <ul class="m-0">
		                    <li>Licence category change</li>
		                    <li>Authorization for dogs or restraints (e.g., handcuffs)</li>
		                    <li>Name change</li>
		                    <li>Licence replacement</li>
		                  </ul>
		                </div>
		                @if (!applicationIsInProgress) {
		                  <div class="col-lg-3 text-end">
		                    @if (licence.isRenewalPeriod) {
		                      <button
		                        mat-flat-button
		                        color="primary"
		                        class="large my-2"
		                        aria-label="Renew the licence"
		                        (click)="onRenew(licence)"
		                        >
		                        <mat-icon>restore</mat-icon>Renew
		                      </button>
		                    }
		                    @if (licence.isUpdatePeriod) {
		                      <button
		                        mat-flat-button
		                        color="primary"
		                        class="large my-2"
		                        aria-label="Update the licence"
		                        (click)="onUpdate(licence)"
		                        >
		                        <mat-icon>update</mat-icon>Update
		                      </button>
		                    }
		                  </div>
		                }
		                @if (applicationIsInProgress) {
		                  <div class="col-12 mt-3">
		                    <app-alert type="info" icon="info">
		                      This {{ licence.serviceTypeCode | options: 'ServiceTypes' }} cannot be renewed, updated or replaced
		                      while an application is in progress.
		                    </app-alert>
		                  </div>
		                }
		              </div>
		            } @else {
		              <div class="row mb-2">
		                <div class="col-lg-9">
		                  Permit updates include the following changes:
		                  <ul class="m-0">
		                    <li>Name change</li>
		                    <li>Reason or rationale change</li>
		                    <li>Employer information change</li>
		                    <li>Permit replacement</li>
		                  </ul>
		                </div>
		                @if (!applicationIsInProgress) {
		                  <div class="col-lg-3 text-end">
		                    @if (licence.isRenewalPeriod) {
		                      <button
		                        mat-flat-button
		                        color="primary"
		                        class="large my-2"
		                        aria-label="Renew the permit"
		                        (click)="onRenew(licence)"
		                        >
		                        <mat-icon>restore</mat-icon>Renew
		                      </button>
		                    }
		                    @if (licence.isUpdatePeriod) {
		                      <button
		                        mat-flat-button
		                        color="primary"
		                        class="large my-2"
		                        aria-label="Update the permit"
		                        (click)="onUpdate(licence)"
		                        >
		                        <mat-icon>update</mat-icon>Update
		                      </button>
		                    }
		                  </div>
		                }
		                @if (applicationIsInProgress) {
		                  <div class="col-12 mt-3">
		                    <app-alert type="info" icon="info">
		                      @if (licence.isReplacementPeriod) {
		                        This {{ licence.serviceTypeCode | options: 'ServiceTypes' }} cannot be renewed, updated or
		                        replaced while an application is in progress.
		                      } @else {
		                        This {{ licence.serviceTypeCode | options: 'ServiceTypes' }} cannot be renewed or updated while an
		                        application is in progress.
		                      }
		                    </app-alert>
		                  </div>
		                }
		              </div>
		            }
		          </div>
		          <div class="row">
		            @if (licence.serviceTypeCode === serviceTypeCodes.SecurityWorkerLicence) {
		              <div class="col-12">
		                <mat-divider class="my-2"></mat-divider>
		                <span class="fw-semibold">Lost your licence? </span>
		                @if (applicationIsInProgress) {
		                  <a class="large disable">Request a replacement</a>
		                }
		                @if (!applicationIsInProgress) {
		                  <a
		                    class="large"
		                    tabindex="0"
		                    aria-label="Request a security worker licence replacement"
		                    (click)="onRequestReplacement(licence)"
		                    (keydown)="onKeydownRequestReplacement($event, licence)"
		                    >Request a replacement</a
		                    >
		                  }
		                  @if (licence.originalPhotoOfYourselfExpired) {
		                    <div class="mt-4">
		                      <app-alert type="danger" icon="dangerous">
		                        A replacement for this record is not available at this time. Use update to provide missing
		                        information and receive a replacement.
		                      </app-alert>
		                    </div>
		                  }
		                </div>
		              } @else {
		                <div class="col-12">
		                  <mat-divider class="my-2"></mat-divider>
		                  <span class="fw-semibold">Lost or stolen permit? </span>
		                  @if (applicationIsInProgress) {
		                    <a class="large disable">Request a replacement</a>
		                  }
		                  @if (!applicationIsInProgress) {
		                    <a
		                      class="large"
		                      tabindex="0"
		                      aria-label="Request a permit replacement"
		                      (click)="onRequestReplacement(licence)"
		                      (keydown)="onKeydownRequestReplacement($event, licence)"
		                      >Request a replacement</a
		                      >
		                    }
		                  </div>
		                }
		              </div>
		            </div>
		          </div>
		        }
		      </div>
		    }
		`,
	styles: [
		`
			.appl-chip-option {
				height: 35px;
			}

			.appl-chip-option-item {
				vertical-align: text-bottom;
			}

			.error-color {
				font-weight: 600;
				color: var(--color-red-dark);
			}
		`,
	],
	standalone: false,
})
export class PersonalLicenceMainLicenceListComponent {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;

	serviceTypeCodes = ServiceTypeCode;

	@Input() activeLicences!: Array<MainLicenceResponse>;
	@Input() applicationIsInProgress!: boolean;

	@Output() replaceLicence: EventEmitter<MainLicenceResponse> = new EventEmitter();
	@Output() updateLicence: EventEmitter<MainLicenceResponse> = new EventEmitter();
	@Output() renewLicence: EventEmitter<MainLicenceResponse> = new EventEmitter();

	onRequestReplacement(licence: MainLicenceResponse): void {
		this.replaceLicence.emit(licence);
	}

	onKeydownRequestReplacement(event: KeyboardEvent, licence: MainLicenceResponse) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onRequestReplacement(licence);
	}

	onUpdate(licence: MainLicenceResponse): void {
		this.updateLicence.emit(licence);
	}

	onRenew(licence: MainLicenceResponse): void {
		this.renewLicence.emit(licence);
	}
}
