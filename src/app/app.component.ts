import { Component, inject } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
  ActivatedRoute
} from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'sopinginventory';

  searchText: string = '';

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {

    // URL mein jo search hai, wo search box mein show hoga
    this.route.queryParams.subscribe(params => {
      this.searchText = params['search'] || '';
    });

  }

  onSearch(): void {

    const currentUrl = this.router.url.split('?')[0];

    this.router.navigate(
      [currentUrl],
      {
        queryParams: this.searchText.trim()
          ? { search: this.searchText.trim() }
          : {}
      }
    );

  }

  onSearchTextChange(): void {

    // Search box completely empty ho gaya
    if (!this.searchText.trim()) {

      const currentUrl = this.router.url.split('?')[0];

      // URL se ?search=laptop hata do
      this.router.navigateByUrl(currentUrl);

    }

  }
}