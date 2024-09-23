import { APP_BASE_HREF, CommonModule, PlatformLocation } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHotToastConfig } from '@ngneat/hot-toast';
import { OAuthModule } from 'angular-oauth2-oidc';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ApiModule } from './api/api.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LandingComponent } from './landing.component';
import { MaterialModule } from './material.module';
import { SharedModule } from './shared/shared.module';

@NgModule({ declarations: [AppComponent, LandingComponent],
    bootstrap: [AppComponent], imports: [AppRoutingModule,
        CoreModule,
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        OAuthModule.forRoot({
            resourceServer: {
                customUrlValidation: (url) => url.toLowerCase().includes('/api') && !url.toLowerCase().endsWith('/configuration'),
                sendAccessToken: true,
            },
        }),
        ApiModule,
        SharedModule], providers: [
        provideHotToastConfig(),
        { provide: APP_BASE_HREF, useFactory: (location: PlatformLocation) => location.getBaseHrefFromDOM(), deps: [PlatformLocation] },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }
