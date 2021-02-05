import { EmployeeService } from './employee.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EmployeeData';

  constructor(private router: Router, public employeeService:EmployeeService) {

  }

  login() {
    this.router.navigate(['employee']);
  }

}

