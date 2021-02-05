import { EmployeeService } from './../employee.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model:any ={};
  constructor(private router: Router, public employeeService: EmployeeService) {
    this.employeeService.isLoggedIn  =false;
  }

    onSubmit() {
      this.employeeService.isLoggedIn = true;
      this.router.navigate(['employee']);
    }

  ngOnInit(): void {
  }

}
