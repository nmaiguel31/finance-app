
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { appConfig } from './app/app.config'; 

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
    ...appConfig.providers, 
  ]
});
