import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing.component';
import { MaterialModule } from './material.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
	declarations: [AppComponent, LandingComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		MaterialModule,
		SharedModule,
		ReactiveFormsModule,
		NgxSpinnerModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
