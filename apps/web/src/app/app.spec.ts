import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';

describe('App', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should request the projection for the selected period and render the chart', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const req = httpMock.expectOne(
      (request) => request.url === '/api/projection' && request.params.get('startDate') === '2024-12-01',
    );
    expect(req.request.params.get('endDate')).toBe('2025-03-31');
    req.flush([{ date: '2024-12-01T00:00:00.000Z', balance: 1000 }]);

    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-balance-chart canvas')).toBeTruthy();
    expect(compiled.textContent).toContain('1 décembre 2024');
    expect(compiled.textContent).toContain('31 mars 2025');
  });
});
