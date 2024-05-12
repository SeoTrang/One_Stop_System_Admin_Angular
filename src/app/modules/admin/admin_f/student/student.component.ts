import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { PageEvent } from './interface/PageEvent.interface';
import { Student } from '@core/models/student';
import { StudentService } from '@core/services/student.service';
import { LoadingService } from '@core/services/loading.service';
import { environment } from '@env';


class City{
  name: string;
  code: string;
}

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StudentComponent implements OnInit {

  cities!: City[];

    selectedCities!: City[];

    value: string | undefined;

    menuItems: any[] | undefined;

    students!: Student[];

    firstItems: number = 0;

    rowsItems: number = 10;

    api: string = environment.api;

  constructor(
    private studentService: StudentService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.cities = [
      {name: 'New York', code: 'NY'},
      {name: 'Rome', code: 'RM'},
      {name: 'London', code: 'LDN'},
      {name: 'Istanbul', code: 'IST'},
      {name: 'Paris', code: 'PRS'}
    ];
    this.menuItems = [
      {
          label: 'In',
          icon: 'pi pi-print',
      },
      {
          label: 'Nhập',
          icon: 'pi pi-file-import'
      },
      {
        label: 'Xuất',
        icon: 'pi pi-file-export'
      }
    ];
    

    this.onLoadStudent();
    
  }

  onLoadStudent() {
    this.loadingService.showLoading();
    this.studentService.getAll().subscribe({
      next: (data) => {
        this.students = data;
        setTimeout(() => {
            this.loadingService.hideLoading();
        }, 500);
      },

      error: (err) => {
        console.log(err);
        
      }
    })
  }

  onPageChange(event: PageEvent) {
    this.firstItems = event.first;
    this.rowsItems = event.rows;

    console.log(this.firstItems);
    console.log(this.rowsItems);
    
}

}
