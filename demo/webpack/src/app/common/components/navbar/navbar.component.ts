import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mmw-navigation',
  templateUrl: 'navbar.html'
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  currentUser: any = { name : '' };
  currentPath: string = 'fakeString';

  constructor(private router: Router) {}

  isNavItemActive(location: any) {
    return location === this.router.url ? 'active' : '';
  };
}
