import { bootstrapApplication } from '@angular/platform-browser';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

// Merge the providers
const mergedProviders = [
  ...appConfig.providers,
  provideCharts(withDefaultRegisterables()),
];

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [mergedProviders,provideAnimations(),  importProvidersFrom(MatDialogModule) ],
})
  .catch((err) => console.error(err));
