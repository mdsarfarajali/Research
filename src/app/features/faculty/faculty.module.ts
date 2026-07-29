import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FacultyListComponent } from './faculty-list/faculty-list.component';
import { FacultyDetailComponent } from './faculty-detail/faculty-detail.component';
import { FacultyFormComponent } from './faculty-form/faculty-form.component';

const routes: Routes = [
  { path: '', component: FacultyListComponent },
  { path: 'new', component: FacultyFormComponent },
  { path: ':id', component: FacultyDetailComponent },
  { path: ':id/edit', component: FacultyFormComponent }
];

@NgModule({
  declarations: [FacultyListComponent, FacultyDetailComponent, FacultyFormComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class FacultyModule {}
