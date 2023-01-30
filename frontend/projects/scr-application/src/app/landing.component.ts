import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  template: `
    <div class="row" style="margin-top: 8em;">
      <div class="col-sm-12 offset-md-2 col-md-8 offset-lg-3 col-lg-6">
        <button
          mat-stroked-button
          color="primary"
          class="large mb-2"
          [routerLink]="['/screening']"
        >
          Screening Application
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class LandingComponent {}
