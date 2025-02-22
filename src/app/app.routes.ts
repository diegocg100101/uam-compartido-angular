import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { AcercadeComponent } from './components/acercade/acercade.component';
import { MenuComponent } from './components/menu/menu.component';

export const routes: Routes = [
    {
        path: '', 
        component: MainComponent,
        children: [
            { path: '', component: LoginFormComponent },
            { path: 'signup', component: SignupFormComponent }
        ]
    },
    {
        path: 'acercade', component: AcercadeComponent
    },
    {
        path: 'menu', component: MenuComponent
    },
    {
        path: '**', redirectTo: '', pathMatch: 'full'
    }
    
];
