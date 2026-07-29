import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { App } from './app.component';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [App],
      imports: [RouterTestingModule]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have correct title', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.title).toBe('research-portal');
  });
});
