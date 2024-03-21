import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-form-auto',
  templateUrl: './create-form-auto.component.html',
  styleUrls: ['./create-form-auto.component.css']
})
export class CreateFormAutoComponent implements OnInit {
  fileName: string | undefined;
  products!: any[];
  dataDepartments: any[];

  constructor() { }

  ngOnInit(): void {
    this.products = [
      {
        id: 123,
        name: "Họ tên"

      },
      {
        id: 123,
        name: "Năm học"

      },
      {
        id: 123,
        name: "Giới tính"

      }
    ];

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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      // const reader = new FileReader();
      // reader.onload = () => {
      //   this.avatar = reader.result as string;
      //   console.log('Avatar changed:', this.avatar);
      // };

      // reader.readAsDataURL(file);
      console.log(file);
      
    }
  }

}
