import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserAnimationsModule,
		BrowserModule,
		AppRoutingModule,
		SharedModule.forRoot(),
		MatSidenavModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
