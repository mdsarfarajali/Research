import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PaperListComponent } from './paper-list/paper-list.component';
import { PaperDetailComponent } from './paper-detail/paper-detail.component';
import { PaperSubmitComponent } from './paper-submit/paper-submit.component';

const routes: Routes = [
  { path: '', component: PaperListComponent },
  { path: 'submit', component: PaperSubmitComponent },
  { path: ':id', component: PaperDetailComponent }
];

@NgModule({
  declarations: [PaperListComponent, PaperDetailComponent, PaperSubmitComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class PapersModule {}
