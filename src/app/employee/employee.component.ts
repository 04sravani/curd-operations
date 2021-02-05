import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from './../employee.service';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  display = 'none';
  deletePopup = 'none';
  editDisplay = 'none';
  model: any = {};
  editedId = 0;
  copiedDataModel: any = {};
  idExists = false;
  isCreate = true;
  deletedId = 0;
  displayedColumns = [
    'id',
    'firstName',
    'lastName',
    'gender',
    'grade',
    'odc',
    'bu',
    'project',
    'actions',
  ];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  registerForm: FormGroup;
    submitted = false;
  constructor(public employeeService: EmployeeService, private formBuilder: FormBuilder) {}
  ngOnInit() {
    this.employeeService.employeeData = [];
    this.getEmployeeData();
    this.registerForm = this.formBuilder.group({
      id: [0, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      grade: ['', [Validators.required, Validators.pattern('[0-9. ]*')]],
      odc: [''],
      bu: [''],
      project: [''],
      status: [1]
  });

  }
  deleteRecord(i) {
    this.deletedId = i;
    this.deletePopup = 'block';
  }

  closeDeletePupup() {
    this.deletePopup = 'none';
  }

  changeInputId(id: number) {
    this.idExists = false;
    this.employeeService.employeeData.forEach((data) => {
      if (data.id === id) {
        this.idExists = true;
      }
    });
  }

    editData(data, i) {
      this.editedId = i;
      this.editDisplay = 'block';
      this.registerForm.controls["firstName"].setValue(data.firstName);
      this.registerForm.controls["lastName"].setValue(data.lastName);
      this.registerForm.controls["id"].setValue(data.id);
      this.registerForm.controls["gender"].setValue(data.gender);
      this.registerForm.controls["grade"].setValue(data.grade);
      this.registerForm.controls["odc"].setValue(data.odc);
      this.registerForm.controls["bu"].setValue(data.bu);
      this.registerForm.controls["project"].setValue(data.project);
    }

  deleteRecored() {
    if (this.deletedId !== -1) {
      this.employeeService.employeeData[this.deletedId].status = 0;
      this.employeeService.employeeData.splice(this.deletedId, 1);
    }
    this.deletePopup = 'none';
    this.updateLocalStorageData();
    this.getEmployeeData();
  }

  clickEventHandler(data) {
    this.copiedDataModel = {};
    this.employeeService.editedData = data;
    this.copiedDataModel = this.employeeService.editedData;
    this.isCreate = false;
    this.openModal(this.isCreate);
  }
  openModal(create: boolean) {
    this.isCreate = create;
    if (create) {
      this.model = {};
      this.model.gender = 'Male';
    }
    this.display = 'block';
  }
  onCloseHandled() {
    this.display = 'none';
    this.editDisplay = 'none';
  }
  get ffff() { return this.registerForm.controls; }
  getEmployeeData() {
    if (
      localStorage.getItem('employeeData') &&
      localStorage.getItem('employeeData') !== undefined
    ) {
      this.employeeService.employeeData = JSON.parse(
        localStorage.getItem('employeeData')
      );
    }
    this.dataSource = new MatTableDataSource(this.employeeService.employeeData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  active(row, i) {
    if(row && row.status === 1) {
      this.employeeService.employeeData[i].status = 0;
    } else if(row && row.status === 0) {
      this.employeeService.employeeData[i].status = 1;
    }
    this.updateLocalStorageData();
    this.getEmployeeData();
  }

  onSubmitEdit(form: any, editForm){
    if(editForm.status === 'VALID'){
      this.employeeService.employeeData[this.editedId] = editForm.value;
    }
    this.updateLocalStorageData();
    this.onCloseHandled();
    this.getEmployeeData();
  }
   onSubmit(model: any, f: NgForm) {
    const dat = model;
    dat.status = 1;
    let created = true;
    if (
      this.employeeService.employeeData &&
      this.employeeService.employeeData.length === 0
    ) {
      this.employeeService.employeeData.push(dat);
    } else {
      this.employeeService.employeeData.forEach((data) => {
        if (data.id === dat.id) {
          created = false;
        }
      });
      if (created) {
        this.employeeService.employeeData.push(dat);
      }
    }
    this.updateLocalStorageData();
    this.onCloseHandled();
    this.getEmployeeData();
    if (f.valid && f.submitted && created) {
      f.reset();
    }
  }

  updateLocalStorageData() {
    localStorage.setItem(
      'employeeData',
      JSON.stringify(this.employeeService.employeeData)
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  grade: number;
  odc: string;
  bu: string;
  project: string;
  status: number;
}
