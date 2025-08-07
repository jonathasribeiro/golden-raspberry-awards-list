import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
            params: of({}),
            queryParams: of({}),
            fragment: of({}),
            data: of({}),
          },
        },
      ],
    }).compileComponents();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Golden Raspberry Awards');
  });
});
