import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { Subject } from 'rxjs';
import { Breadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb/breadcrumb.service';

fdescribe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const breadcrumbs$ = new Subject<Breadcrumb[]>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        {
          provide: BreadcrumbService,
          useValue: {
            breadcrumbs$: breadcrumbs$,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to breadcrumbs$', () => {
    const breadcrumbs: Breadcrumb[] = [{ label: 'Home', url: '/' }];
    breadcrumbs$.next(breadcrumbs);

    expect(component.breadcrumbs).toEqual(breadcrumbs);
  });

  it('should unsubscribe from breadcrumbs$ on ngOnDestroy', () => {
    const unsubscribeSpy = spyOn(component['subscription'], 'unsubscribe');
    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
