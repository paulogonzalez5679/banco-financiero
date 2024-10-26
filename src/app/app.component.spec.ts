import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Asegúrate de llamar a este método para inicializar el componente
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement; // Obtiene el elemento DOM del componente
    expect(compiled.querySelector('h1').textContent).toContain('Hello, banco-financiero');
  });
});
