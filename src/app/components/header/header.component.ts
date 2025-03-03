import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  authenticated : boolean = false;

  constructor(private authService : AuthService) {}

  ngOnInit() {
    this.authService.status$.subscribe((status) => {
      this.authenticated = status
    })
  }
}
