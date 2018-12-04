import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Breakpoints, BreakpointState } from '@angular/cdk/layout';

/**
 * Mocked BreakpointObserver service from @angular/cdk used only in testing
 */
@Injectable({providedIn: 'root'})
export class MediumMockedBreakpointObserver {
  isMatched(value: string | string[]): boolean {
    return value === Breakpoints.Medium;
  }

  observe(value: string | string[]): Observable<BreakpointState> {
    const response: BreakpointState = {
      matches: false,
      breakpoints: {
        Medium: true
      }
    };
    return of(response);
  }
}
