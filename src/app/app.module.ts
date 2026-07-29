import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { App } from './app.component';
import { CoreModule } from './core/core.module';
import { LayoutComponent } from './layout/layout.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [App, LayoutComponent],
  imports: [BrowserModule, AppRoutingModule, CoreModule, SharedModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
