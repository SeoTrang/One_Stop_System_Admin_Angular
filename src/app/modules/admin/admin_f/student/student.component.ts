import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Officer } from './interface/officer.interface';
import { PageEvent } from './interface/PageEvent.interface';


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

    officers!: Officer[];

    firstItems: number = 0;

    rowsItems: number = 10;

    

  constructor() { }

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
    this.officers = [
        {
          id: 1,
          identifier: 'DTO4801030041',
          avatar: 'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_13.jpg',
          name: 'Ma Seo Tráng',
          email: 'seotrangbh24@gmail.com',
          phone: '0386640397',
          isAdmin: true,
          department:{
            id: 1,
            name: 'Phòng tài chính',
            address: 'C1-101',
            created_at: '10:22 4/3/2024',
            updated_at: '10:22 4/3/2024'
          },
          created_at: '10:22 4/3/2024',
          updated_at: '10:22 4/3/2024'
        },
        {
          id: 2,
          identifier: 'DTO4801030040',
          name: 'Hương Thủy',
          avatar: 'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_9.jpg',
          email: 'seotrangbh24@gmail.com',
          phone: '0386640397',
          isAdmin: true,
          department:{
            id: 1,
            name: 'Phòng tài chính',
            address: 'C1-101',
            created_at: '10:22 4/3/2024',
            updated_at: '10:22 4/3/2024'
          },
          created_at: '10:22 4/3/2024',
          updated_at: '10:22 4/3/2024'
        }
    ]
    
  }

  onPageChange(event: PageEvent) {
    this.firstItems = event.first;
    this.rowsItems = event.rows;

    console.log(this.firstItems);
    console.log(this.rowsItems);
    
}

}
