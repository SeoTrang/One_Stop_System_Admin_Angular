import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CreateStudentDto } from './dto/create-student.dto';

@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateStudentComponent implements OnInit {
  avatar ?: string| undefined;

  createStudentDto: CreateStudentDto;

  confirmPassword: string| undefined; 

  dataDepartments: any[];

  constructor() { }

  ngOnInit(): void {
    // this.avatar = 'https://scontent.fhan15-1.fna.fbcdn.net/v/t39.30808-1/425451336_1196911777943774_8896928104942580300_n.jpg?stp=dst-jpg_s320x320&_nc_cat=106&ccb=1-7&_nc_sid=5740b7&_nc_eui2=AeFwiMQSllDUyFt5WU_-gpNxnp9yo23a8Iyen3KjbdrwjMvuDeSKyw51Pkwp0QI-Lo1-t6LOE1tOHZDKox3O0M3C&_nc_ohc=_SxLPKRIawIAX86ZrjB&_nc_ht=scontent.fhan15-1.fna&oh=00_AfCX3LGMgZN16whjJVTNJpy_lNbumChn7z1UfSCgkXL9MA&oe=65EB41EB'
    this.createStudentDto = new CreateStudentDto();
    this.initDataDepartment();
  }

  initDataDepartment(): void{
    this.dataDepartments = [
      {
          "label": "Documents",
          "data": "Documents Folder",
          // "expandedIcon": "pi pi-folder-open",
          // "collapsedIcon": "pi pi-folder"
      },
      {
          "label": "Pictures",
          "data": "Pictures Folder",
          // "expandedIcon": "pi pi-folder-open",
          // "collapsedIcon": "pi pi-folder"
      },
      {
          "label": "Movies",
          "data": "Movies Folder",
          // "expandedIcon": "pi pi-folder-open",
          // "collapsedIcon": "pi pi-folder"
      }
  ]
  }

  onFileSelectedAvatar(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.avatar = reader.result as string;
        console.log('Avatar changed:', this.avatar);
      };

      reader.readAsDataURL(file);
    }
  }

}
