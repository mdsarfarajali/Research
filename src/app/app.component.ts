import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styles: [':host { display: block; }']
})
export class App {
  title = 'research-portal';
}
