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
import { RegistrationComponent } from './registration/registration.component';
import { AgreementOfTermsComponent } from './registration/step-components/agreement-of-terms.component';
import { AuthorizedContactInformationComponent } from './registration/step-components/authorized-contact-information.component';
import { CompensationQuestionComponent } from './registration/step-components/compensation-question.component';
import { CompletedComponent } from './registration/step-components/completed.component';
import { EligibilityProblemComponent } from './registration/step-components/eligibility-problem.component';
import { FundingProblemComponent } from './registration/step-components/funding-problem.component';
import { FundingQuestionComponent } from './registration/step-components/funding-question.component';
import { MailingAddressComponent } from './registration/step-components/mailing-address.component';
import { OrganizationInformationComponent } from './registration/step-components/organization-information.component';
import { OrganizationNameComponent } from './registration/step-components/organization-name.component';
import { OrganizationOptionsComponent } from './registration/step-components/organization-options.component';
import { PaymentQuestionComponent } from './registration/step-components/payment-question.component';
import { RegistrationOptionsComponent } from './registration/step-components/registration-options.component';
import { RegistrationPathSelectionComponent } from './registration/step-components/registration-path-selection.component';
import { ScreeningsQuestionComponent } from './registration/step-components/screenings-question.component';
import { VulnerableSectorQuestionComponent } from './registration/step-components/vulnerable-sector-question.component';
import { StepFourComponent } from './registration/steps/step-four.component';
import { StepOneComponent } from './registration/steps/step-one.component';
import { StepThreeComponent } from './registration/steps/step-three.component';
import { StepTwoComponent } from './registration/steps/step-two.component';

@NgModule({
	declarations: [
		AppComponent,
		LandingComponent,
		RegistrationComponent,
		RegistrationPathSelectionComponent,
		OrganizationOptionsComponent,
		CompensationQuestionComponent,
		VulnerableSectorQuestionComponent,
		FundingQuestionComponent,
		FundingProblemComponent,
		EligibilityProblemComponent,
		RegistrationOptionsComponent,
		OrganizationNameComponent,
		OrganizationInformationComponent,
		AuthorizedContactInformationComponent,
		MailingAddressComponent,
		PaymentQuestionComponent,
		ScreeningsQuestionComponent,
		AgreementOfTermsComponent,
		CompletedComponent,
		StepOneComponent,
		StepTwoComponent,
		StepThreeComponent,
		StepFourComponent,
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
