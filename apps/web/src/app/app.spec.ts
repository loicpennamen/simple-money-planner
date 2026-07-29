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

    const req = httpMock.expectOne((request) => request.url === '/api/projection');
    const startDate = req.request.params.get('startDate');
    const endDate = req.request.params.get('endDate');
    expect(startDate).toBeTruthy();
    expect(endDate).toBeTruthy();

    req.flush([{ date: startDate, balance: 1000 }]);

    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-balance-chart canvas')).toBeTruthy();

    const periodText = compiled.querySelector('header')?.textContent ?? '';
    expect(periodText).toContain(new Date(startDate as string).getUTCFullYear().toString());
    expect(periodText).toContain(new Date(endDate as string).getUTCFullYear().toString());
  });

  it('should render an alert when the request fails', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const req = httpMock.expectOne((request) => request.url === '/api/projection');
    req.flush({ message: 'boom' }, { status: 500, statusText: 'Internal Server Error' });

    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-alert')?.textContent).toContain('boom');
  });
});
