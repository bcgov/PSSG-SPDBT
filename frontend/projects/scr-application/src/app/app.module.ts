import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, SharedModule } from 'projects/shared/src/public-api';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LandingComponent } from './landing.component';
import { ScreeningComponent } from './screening/screening.component';
import { AgreementOfTermsComponent } from './screening/step-components/agreement-of-terms.component';
import { ApplicationProgressComponent } from './screening/step-components/application-progress.component';
import { ChecklistComponent } from './screening/step-components/checklist.component';
import { CompletedComponent } from './screening/step-components/completed.component';
import { ContactInformationComponent } from './screening/step-components/contact-information.component';
import { DeclarationComponent } from './screening/step-components/declaration.component';
import { EligibilityProblemComponent } from './screening/step-components/eligibility-problem.component';
import { LogInOptionsComponent } from './screening/step-components/log-in-options.component';
import { MailingAddressComponent } from './screening/step-components/mailing-address.component';
import { PaymentComponent } from './screening/step-components/payment.component';
import { PersonalInformationComponent } from './screening/step-components/personal-information.component';
import { PreviousNameComponent } from './screening/step-components/previous-name.component';
import { SecurityInformationComponent } from './screening/step-components/security-information.component';
import { SummaryComponent } from './screening/step-components/summary.component';
import { StepApplSubmittedComponent } from './screening/steps/step-appl-submitted.component';
import { StepEligibilityComponent } from './screening/steps/step-eligibility.component';
import { StepLoginOptionsComponent } from './screening/steps/step-login-options.component';
import { StepOrganizationInfoComponent } from './screening/steps/step-organization-info.component';
import { StepPayForApplicationComponent } from './screening/steps/step-pay-for-application.component';
import { StepPersonalInfoComponent } from './screening/steps/step-personal-info.component';
import { StepTermsAndCondComponent } from './screening/steps/step-terms-and-cond.component';

@NgModule({
	declarations: [
		AppComponent,
		LandingComponent,
		ScreeningComponent,
		StepEligibilityComponent,
		StepOrganizationInfoComponent,
		StepLoginOptionsComponent,
		StepPersonalInfoComponent,
		StepTermsAndCondComponent,
		StepPayForApplicationComponent,
		StepApplSubmittedComponent,
		ContactInformationComponent,
		MailingAddressComponent,
		ChecklistComponent,
		EligibilityProblemComponent,
		LogInOptionsComponent,
		AgreementOfTermsComponent,
		PersonalInformationComponent,
		PreviousNameComponent,
		SummaryComponent,
		SecurityInformationComponent,
		DeclarationComponent,
		PaymentComponent,
		CompletedComponent,
		ApplicationProgressComponent,
	],
	imports: [
		AppRoutingModule,
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		CommonModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
