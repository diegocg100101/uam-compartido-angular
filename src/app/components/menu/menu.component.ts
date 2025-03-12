import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  
  public isAdmin : boolean = false;

  constructor(private authService : AuthService) {} 

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
  }

  logout() {
    localStorage.removeItem('token');
  }
}
