import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Officer } from './interface/officer.interface';
import { PageEvent } from './interface/PageEvent.interface';
import { AuthService } from '@core/services/auth.service';
import { Role } from './interface/role.interface';
import { Router } from '@angular/router';
import { OfficerService } from '@core/services/officer.service';
import { environment } from '@env';
class City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-officer',
  templateUrl: './officer.component.html',
  styleUrls: ['./officer.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class OfficerComponent implements OnInit {
  cities!: City[];

  selectedCities!: City[];

  value: string | undefined;

  menuItems: any[] | undefined;

  officers!: Officer[];

  firstItems: number = 0;

  rowsItems: number = 10;

  menuActionService: any[] | undefined;

  user: Officer;

  userRole: Role[];

  officer_id_clicked: number;

  api: string = environment.api;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private officerService: OfficerService
  ) {}

  ngOnInit(): void {
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ];
    this.menuItems = [
      {
        label: 'In',
        icon: 'pi pi-print',
      },
      {
        label: 'Nhập',
        icon: 'pi pi-file-import',
      },
      {
        label: 'Xuất',
        icon: 'pi pi-file-export',
      },
    ];
    // this.officers = [
    //   {
    //     id: 1,
    //     identifier: 'DTO4801030041',
    //     avatar:
    //       'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_13.jpg',
    //     name: 'Ma Seo Tráng',
    //     email: 'seotrangbh24@gmail.com',
    //     phone: '0386640397',
    //     isAdmin: true,
    //     department: {
    //       id: 1,
    //       name: 'Phòng tài chính',
    //       address: 'C1-101',
    //       created_at: '10:22 4/3/2024',
    //       updated_at: '10:22 4/3/2024',
    //     },
    //     created_at: '10:22 4/3/2024',
    //     updated_at: '10:22 4/3/2024',
    //   },
    //   {
    //     id: 2,
    //     identifier: 'DTO4801030040',
    //     name: 'Hương Thủy',
    //     avatar:
    //       'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_9.jpg',
    //     email: 'seotrangbh24@gmail.com',
    //     phone: '0386640397',
    //     isAdmin: true,
    //     department: {
    //       id: 1,
    //       name: 'Phòng tài chính',
    //       address: 'C1-101',
    //       created_at: '10:22 4/3/2024',
    //       updated_at: '10:22 4/3/2024',
    //     },
    //     created_at: '10:22 4/3/2024',
    //     updated_at: '10:22 4/3/2024',
    //   },
    // ];

    this.onloadOfficersData();
    this.onLoadMenuActionService();
  }

  onPageChange(event: PageEvent) {
    this.firstItems = event.first;
    this.rowsItems = event.rows;

    console.log(this.firstItems);
    console.log(this.rowsItems);
  }

  checkLoadMenuActionServiceFromRole(): any[] {
    let menu = [];
    let roles = this.userRole;
    for (let index = 0; index < roles.length; index++) {
      // console.log(roles[index].id);

      if (roles[index].id == 23) {
        menu.push({
          label: 'Phân quyền',
          icon: 'pi pi-cog',
          disabled: false,
          routerLink: ['/manager/admin/rbac/' + this.officer_id_clicked],
          command: ($event) => {
            console.log('hello');
            // this.router.navigate(['/manager/admin/rbac'])
          },
          styleClass: 'menu-edit',
        });
      }

      if (roles[index].id == 22) {
        menu.push({
          label: 'Khóa tài khoản',
          icon: 'pi pi-lock',
          disabled: false,
          command: ($event) => {
            console.log('hello');
          },
          styleClass: 'menu-delete',
        });
      }
    }

    return menu;
  }
  async onloadOfficersData(){
     this.officerService.getAll().subscribe({
      next: (data) => {
        console.log(data);
        
        this.officers = data;
      },

      error: (err) => {
        console.log(err);
        
      }
     })
  }
  async onLoadMenuActionService() {
    this.user = this.authService.getUserInfo();
    // console.log(this.user);
    this.userRole = this.user.roles;
    let menu: any[] = this.checkLoadMenuActionServiceFromRole();
    console.log(menu);

    this.menuActionService = [
      {
        label: 'Xem',
        icon: 'pi pi-eye',

        command: () => {
          console.log('hello');
        },
        styleClass: 'menu-view',
      },

      ...menu,
    ];
  }

  onClickItemService(id: number) {
    console.log('officer_id_clicked : ' + id);
    this.officer_id_clicked = id;
    this.onLoadMenuActionService();
  }
}
