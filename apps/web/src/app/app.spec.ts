import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiEndpoints } from '@simple-money-planner/shared';
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

    const req = httpMock.expectOne((request) => request.url === ApiEndpoints.PeriodChartData);
    const startDate = req.request.params.get('startDate');
    const endDate = req.request.params.get('endDate');
    expect(startDate).toBeTruthy();
    expect(endDate).toBeTruthy();

    req.flush({ balanceProjection: [{ date: startDate, balance: 1000 }] });

    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-balance-chart canvas')).toBeTruthy();

    const dateInputs = compiled.querySelectorAll<HTMLInputElement>('input[type="date"]');
    expect(dateInputs[0].value).toBe(startDate);
    expect(dateInputs[1].value).toBe(endDate);
  });

  it('should reload the projection when a date input changes', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const initialReq = httpMock.expectOne((request) => request.url === ApiEndpoints.PeriodChartData);
    initialReq.flush({ balanceProjection: [{ date: initialReq.request.params.get('startDate'), balance: 1000 }] });
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const startInput = compiled.querySelectorAll<HTMLInputElement>('input[type="date"]')[0];
    startInput.value = '2025-02-01';
    startInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const updatedReq = httpMock.expectOne((request) => request.url === ApiEndpoints.PeriodChartData);
    expect(updatedReq.request.params.get('startDate')).toBe('2025-02-01');
    updatedReq.flush({ balanceProjection: [{ date: '2025-02-01', balance: 1000 }] });
  });

  it('should render an alert when the request fails', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const req = httpMock.expectOne((request) => request.url === ApiEndpoints.PeriodChartData);
    req.flush({ message: 'boom' }, { status: 500, statusText: 'Internal Server Error' });

    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-alert')?.textContent).toContain('boom');
  });
});
