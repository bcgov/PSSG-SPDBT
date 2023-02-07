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
import { ChecklistComponent } from './screening/step-components/checklist.component';
import { CompletedComponent } from './screening/step-components/completed.component';
import { ContactInformationComponent } from './screening/step-components/contact-information.component';
import { DeclarationComponent } from './screening/step-components/declaration.component';
import { LogInOptionsComponent } from './screening/step-components/log-in-options.component';
import { MailingAddressComponent } from './screening/step-components/mailing-address.component';
import { PaymentComponent } from './screening/step-components/payment.component';
import { PersonalInformationComponent } from './screening/step-components/personal-information.component';
import { PreviousNameComponent } from './screening/step-components/previous-name.component';
import { SecurityInformationComponent } from './screening/step-components/security-information.component';
import { SummaryComponent } from './screening/step-components/summary.component';
import { StepOneComponent } from './screening/steps/step-one.component';
import { StepThreeComponent } from './screening/steps/step-three.component';
import { StepTwoComponent } from './screening/steps/step-two.component';

@NgModule({
	declarations: [
		AppComponent,
		LandingComponent,
		ScreeningComponent,
		StepOneComponent,
		StepTwoComponent,
		StepThreeComponent,
		ContactInformationComponent,
		MailingAddressComponent,
		ChecklistComponent,
		LogInOptionsComponent,
		AgreementOfTermsComponent,
		PersonalInformationComponent,
		PreviousNameComponent,
		SummaryComponent,
		SecurityInformationComponent,
		DeclarationComponent,
		PaymentComponent,
		CompletedComponent,
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
