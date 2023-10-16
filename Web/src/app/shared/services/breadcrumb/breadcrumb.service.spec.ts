import { TestBed } from '@angular/core/testing';

import { BreadcrumbService } from './breadcrumb.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

fdescribe('BreadcrumbService', () => {
  let service: BreadcrumbService;
  let activatedRoute: any;
  let routerEventsSubject: BehaviorSubject<any>;

  beforeEach(() => {
    routerEventsSubject = new BehaviorSubject<any>(null);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            events: routerEventsSubject.asObservable(),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: jasmine.createSpyObj('ActivatedRoute', ['root']),
        },
      ],
    });
    service = TestBed.inject(BreadcrumbService);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update breadcrumbs when navigation ends', () => {
    activatedRoute.root = {
      routeConfig: {
        path: 'admin',
        data: {
          breadcrumb: 'Admin',
        },
      },
    };
    const expectedBreadcrumbs = [{ label: 'Admin', url: '/admin' }];
    let breadcrumbs: any = null;

    service.breadcrumbs$.subscribe((value) => {
      breadcrumbs = value;
    });

    routerEventsSubject.next(new NavigationEnd(1, '/admin', '/admin'));

    expect(breadcrumbs).toEqual(expectedBreadcrumbs);
  });

  it('should update breadcrumbs with child routes', () => {
    activatedRoute.root = {
      routeConfig: {
        path: 'admin',
        data: {
          breadcrumb: 'Admin',
        },
      },
      firstChild: {
        routeConfig: {
          path: 'dashboard',
          data: {
            breadcrumb: 'Dashboard',
          },
        },
      },
    };
    const expectedBreadcrumbs = [
      { label: 'Admin', url: '/admin' },
      { label: 'Dashboard', url: '/admin/dashboard' },
    ];
    let breadcrumbs: any = null;

    service.breadcrumbs$.subscribe((value) => {
      breadcrumbs = value;
    });

    routerEventsSubject.next(
      new NavigationEnd(1, '/admin/dashboard', '/admin/dashboard')
    );

    expect(breadcrumbs).toEqual(expectedBreadcrumbs);
  });
});
