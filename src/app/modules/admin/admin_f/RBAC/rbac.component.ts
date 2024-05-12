import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { AuthService } from '@core/services/auth.service';
import { RBAC } from './interface/rbac.interface';
import { DepartmentService } from '@core/services/deparment.service';
import { Department } from '@core/models/department';
import { ActivatedRoute } from '@angular/router';
import { OfficerService } from '@core/services/officer.service';
import { Officer } from '../officer/interface/officer.interface';
import { environment } from '@env';
import { LoadingService } from '@core/services/loading.service';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-rbac',
  templateUrl: './rbac.component.html',
  styleUrls: ['./rbac.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class RbacComponent implements OnInit {
  task: Task = {
    name: 'Cán bộ giảng viên',
    completed: false,
    color: 'primary',
    subtasks: [
      { name: 'Tất cả', completed: false, color: 'primary' },
      { name: 'Thêm cán bộ giảng viên', completed: false, color: 'accent' },
    ],
  };

  allComplete: boolean = false;

  listRoles: RBAC[];

  departments: Department[] | undefined;

  selectedDepartment: Department | undefined;

  officerId = this.activatedRoute.snapshot.params['officer_id'];

  api: string = environment.api;

  officer: Officer;

  role_ids : number[];
  constructor(
    private authService: AuthService,
    private departmentService: DepartmentService,
    private activatedRoute: ActivatedRoute,
    private officerService: OfficerService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.onLoadOfficerInfo();
    
    this.onLoadDepartments();
  }

  async initListRoles() {
    const roles = await this.authService.getAllRoles();
    console.log(roles);
    console.log(this.role_ids);
    
    let transformedRoles: RBAC[] = [];
    roles.forEach((role) => {
      const { id, label, routerLink, icon, parent_id } = role;
      
      if (parent_id === null) {
        const newItem: RBAC = {
          id,
          label,
          subRBAC: roles
            .filter((child) => child.parent_id === role.id)
            .map((child) => ({
              id: child.id,
              label: child.label,
              checked: this.role_ids.includes(child.id), // or any other default value
              parent_id: child.parent_id,
            })),
          checked: this.role_ids.includes(id), // or any other default value
          parent_id,
        };
        transformedRoles.push(newItem);
      }
    });

    console.log(transformedRoles);
    this.listRoles = transformedRoles;
  }


  // if (label === 'Phòng ban' || label === 'Thêm phòng ban') {
      //   const newItem: RBAC = {
      //     id,
      //     label,
      //     subRBAC: [],
      //     checked: false, // or any other default value
      //     parent_id,
      //   };
      //   transformedRoles.push(newItem);
      // } else 
  onLoadOfficerInfo(){
    this.officerService.getByOfficerId(this.officerId).subscribe({
      next: (data) => {
        console.log(data);
        
        this.officer = data;
        this.selectedDepartment = data.department;
        this.role_ids = data.roles.map(value => value.id);
        this.initListRoles();
      },
      error: (err) => {
        console.log(err);
        
      }
    })
  }

  onLoadDepartments(){
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data;
      },

      error: (err) => {
        console.log(err);
        
      }
    })
  }

  someComplete(id: any) {
    // this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
    // this.listRoles.forEach((role=> {
    //     if(role.id == id){
    //         role.checked = true;
    //     }
    // }))
    console.log('hello', id);

    for (let index = 0; index < this.listRoles.length; index++) {
      if (this.listRoles[index].id == Number(id)) {
        console.log(this.listRoles[index]);
        this.listRoles[index].checked =
          this.listRoles[index].subRBAC.length > 0 &&
          this.listRoles[index].subRBAC.some((role) => role.checked);
      }
    }
  }

  updateAllComplete(id: any) {
    // if (this.task.subtasks == null) {
    //   return false;
    // }
    // return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
    for (let index = 0; index < this.listRoles.length; index++) {
      if (this.listRoles[index].id == Number(id)) {
      }
    }
  }

  setAll(completed: boolean, id: any) {
    // this.allComplete = completed;
    // if (this.task.subtasks == null) {
    //   return;
    // }
    // this.task.subtasks.forEach(t => (t.completed = completed));
    for (let index = 0; index < this.listRoles.length; index++) {
      if (this.listRoles[index].id == Number(id)) {
        this.listRoles[index].checked = completed;
        if (this.listRoles[index].subRBAC.length < 1) {
          return;
        }
        this.listRoles[index].subRBAC.forEach(
          (role) => (role.checked = completed)
        );
      }
    }
  }


  getCheckedIds(data) {
    let checkedIds = [];

    // Hàm đệ quy để duyệt qua các đối tượng và đối tượng con
    function traverse(node) {
        if (node.checked === true) {
            checkedIds.push(node.id);
        }
        if (node.subRBAC && node.subRBAC.length > 0) {
            node.subRBAC.forEach(subNode => traverse(subNode));
        }
    }

    // Bắt đầu duyệt từ các đối tượng cấp cao nhất
    data.forEach(node => traverse(node));

    return checkedIds;
}

compareArrays(a, b) {
  let roles_revoked = [];
  let new_roles = [];

  // Kiểm tra các phần tử trong mảng a
  a.forEach(element => {
      if (!b.includes(element)) {
        roles_revoked.push(element);
      }
  });

  // Kiểm tra các phần tử trong mảng b
  b.forEach(element => {
      if (!a.includes(element)) {
        new_roles.push(element);
      }
  });

  return { roles_revoked, new_roles };
}

  btnSave() {
    console.log(this.selectedDepartment);
    const checkedIds = this.getCheckedIds(this.listRoles);

    console.log(checkedIds);
    this.loadingService.showLoading();
    this.officerService.setRBAC(this.selectedDepartment.id, checkedIds, this.officer.id).subscribe({
      next: (data) => {
        console.log(data)
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, 500);
      },
      error: (err) => {
        console.log(err);
        
      }
    })
    
    
  }
}
