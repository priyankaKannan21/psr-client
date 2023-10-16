import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Breadcrumb } from '../../models/breadcrumb.model';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  breadcrumbs$: Observable<Breadcrumb[]> = of();
  private breadcrumbSubject = new BehaviorSubject<Breadcrumb[]>([]);

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.updateBreadcrumbs());
    this.breadcrumbs$ = this.breadcrumbSubject.asObservable();
  }

  private updateBreadcrumbs(): void {
    const breadcrumbs: Breadcrumb[] = [];
    let currentRoute = this.activatedRoute.root;
    let url = '';

    while (currentRoute) {
      const routeConfig = currentRoute.routeConfig;

      if (routeConfig) {
        if (routeConfig.data && routeConfig.data['breadcrumb']) {
          const breadcrumb: Breadcrumb = {
            label: routeConfig.data['breadcrumb'],
            url: url + '/' + this.getRoutePath(currentRoute),
          };
          breadcrumbs.push(breadcrumb);
        }

        url += '/' + this.getRoutePath(currentRoute);
      }

      currentRoute = currentRoute.firstChild!;
    }

    this.breadcrumbSubject.next(breadcrumbs);
  }

  private getRoutePath(route: ActivatedRoute): string {
    return route.routeConfig?.path || '';
  }
}
