import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { AuthService } from '@core/services/auth.service';
import { RBAC } from './interface/rbac.interface';

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
  encapsulation: ViewEncapsulation.None
})
export class RbacComponent implements OnInit {

    task: Task = {
        name: 'Cán bộ giảng viên',
        completed: false,
        color: 'primary',
        subtasks: [
          {name: 'Tất cả', completed: false, color: 'primary'},
          {name: 'Thêm cán bộ giảng viên', completed: false, color: 'accent'}
        ],
      };
    
      allComplete: boolean = false;

    listRoles: RBAC[];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.initListRoles(); 
  }

  async initListRoles(){
   
    const roles = await this.authService.getAllRoles();
    console.log(roles);
    let transformedRoles: RBAC[] = [];
    roles.forEach(role => {
        const { id, label, routerLink, icon, parent_id } = role;
        if (label === "Phòng ban" || label === "Thêm phòng ban") {
            const newItem: RBAC = {
                id,
                label,
                subRBAC: [],
                checked: false, // or any other default value
                parent_id
            };
            transformedRoles.push(newItem);
        } else
        if (parent_id === null) {
            const newItem: RBAC = {
                id,
                label,
                subRBAC: roles.filter(child => child.parent_id === role.id).map(child => ({
                    id: child.id,
                    label: child.label,
                    checked: false,// or any other default value
                    parent_id: child.parent_id
                })),
                checked: false, // or any other default value
                parent_id
            };
            transformedRoles.push(newItem);
        }
    });

    console.log(transformedRoles);
    this.listRoles = transformedRoles;
    
  }

  someComplete(id: any) {
    // this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
    // this.listRoles.forEach((role=> {
    //     if(role.id == id){
    //         role.checked = true;
    //     }
    // }))
    console.log("hello",id);
    

    for (let index = 0; index < this.listRoles.length; index++) {
        if(this.listRoles[index].id == Number(id)){
            console.log(this.listRoles[index]);
            this.listRoles[index].checked = this.listRoles[index].subRBAC.length > 0 && this.listRoles[index].subRBAC.some(role => role.checked)
            
        }
        
    }
  }

  updateAllComplete(id:any) {
    // if (this.task.subtasks == null) {
    //   return false;
    // }
    // return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
    for (let index = 0; index < this.listRoles.length; index++) {
        if(this.listRoles[index].id == Number(id)){

        }
    }
  }

  setAll(completed: boolean,id: any) {
    // this.allComplete = completed;
    // if (this.task.subtasks == null) {
    //   return;
    // }
    // this.task.subtasks.forEach(t => (t.completed = completed));
    for (let index = 0; index < this.listRoles.length; index++) {
        if(this.listRoles[index].id == Number(id)){
            this.listRoles[index].checked = completed;
            if(this.listRoles[index].subRBAC.length < 1){
                return;
            }
            this.listRoles[index].subRBAC.forEach(role => role.checked = completed);
        }
    }
  }

  btnSave(){
    console.log(this.listRoles);
    
  }

}
