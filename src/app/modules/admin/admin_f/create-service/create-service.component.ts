import { Component, OnInit,  ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { defer, shareReplay } from 'rxjs';
import 'quill-mention';
import 'quill-emoji';

// // typings.d.ts
// declare module '!!raw-loader!*.css' {
//   const css: string;
//   export default css;
// }

// // my.component.ts
// const quillCSS$ = defer(() =>
//   import('!!raw-loader!quill/dist/quill.core.css').then((m) => {
//     const style = document.createElement('style');
//     style.innerHTML = m.default;
//     document.head.appendChild(style);
//   })
// ).pipe(shareReplay({ bufferSize: 1, refCount: true }));

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.css'],
  encapsulation: ViewEncapsulation.None,
})



export class CreateServiceComponent implements OnInit  {
  // displayDialogAddStep: boolean = false;
  movies: string[] = [];

  contentDescription: any;

  atValues = [
    { id: 1, value: 'Fredrik Sundqvist', link: 'https://google.com' },
    { id: 2, value: 'Patrik Sjölin' },
  ];
  hashValues = [
    { id: 3, value: 'Fredrik Sundqvist 2' },
    { id: 4, value: 'Patrik Sjölin 2' },
  ];
  quillConfig = {
    //toolbar: '.toolbar',
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['code-block'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        //[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        //[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        //[{ 'direction': 'rtl' }],                         // text direction

        //[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        //[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        //[{ 'font': [] }],
        //[{ 'align': [] }],

        ['clean'], // remove formatting button

        ['link'],
        ['link', 'image', 'video'],
      ],
    },

    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ['@', '#'],
      source: (searchTerm, renderList, mentionChar) => {
        let values;

        if (mentionChar === '@') {
          values = this.atValues;
        } else {
          values = this.hashValues;
        }

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];
          for (var i = 0; i < values.length; i++)
            if (
              ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
            )
              matches.push(values[i]);
          renderList(matches, searchTerm);
        }
      },
    },
    'emoji-toolbar': true,
    'emoji-textarea': false,
    'emoji-shortname': true,
    keyboard: {
      bindings: {
        // shiftEnter: {
        //   key: 13,
        //   shiftKey: true,
        //   handler: (range, context) => {
        //     // Handle shift+enter
        //     console.log("shift+enter")
        //   }
        // },
        enter: {
          key: 13,
          handler: (range, context) => {
            console.log('enter');
            return true;
          },
        },
      },
    },
  };

  typeAttribute: any[] = [
    {
      data: 'Input',
      label: 'Input'
    },
    {
      data: 'Select',
      label: 'Select'
    },
    {
      data: 'Checkbox',
      label: 'Checkbox'
    }
  ] || [];

  selectNewAttribute: any;

  displayDialogAddAttribute:boolean;

  newAttributeName: string | undefined;

  listAttributes: any[];

  attributeEnumValue: string;

  displayDialogAddAttributeEnum:boolean;

  listAttributeEnumValues : string[] | undefined;

  dataDepartments: any[];

  steps: MenuItem[];

  selectNewStep: any;

  fileName: string | undefined;

  constructor() {}

  ngOnInit(): void {
    this.displayDialogAddAttribute = false;
    this.displayDialogAddAttributeEnum = false;
    this.steps = [];
    this.listAttributes = [];
    // this.steps = [
    //   {
    //     label: 'Bước 1'
    //   },
    //   { label: 'Bước 2' },
    //   { label: 'Bước 3' },
    // ];
    this.dataDepartments = [
      {
        label: 'Documents',
        data: 'Documents Folder',
        // "expandedIcon": "pi pi-folder-open",
        // "collapsedIcon": "pi pi-folder"
      },
      {
        label: 'Pictures',
        data: 'Pictures Folder',
        // "expandedIcon": "pi pi-folder-open",
        // "collapsedIcon": "pi pi-folder"
      },
      {
        label: 'Movies',
        data: 'Movies Folder',
        // "expandedIcon": "pi pi-folder-open",
        // "collapsedIcon": "pi pi-folder"
      },
    ];
  }
  
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
    // console.log();
    this.steps = this.movies.map((value)=> {
      return {label: value}
    })
     
    
  }

  
  // showDialogAddStep() {
  //   this.displayDialogAddStep = true;
  // }

  onSelectNewStep(event: any) {
    console.log('Giá trị mới của selectNewStep:', this.selectNewStep);
    
  }

  onSelectNewProperty(event: any) {
    console.log('Giá trị mới của selectNewStep:', this.selectNewAttribute);
    
  }

  onAddStepClick() {
    // Lấy giá trị từ p-treeSelect
    const selected = this.selectNewStep.data;
    console.log('Giá trị được chọn từ p-treeSelect:',selected);
    this.steps = [...this.steps, { label: selected }];
    this.movies = [...this.movies,selected]
    // this.displayDialogAddStep = false;
    // Tiến hành xử lý thêm bước mới
    // ...
  }

  removeMovie(movie: string) {
    console.log(movie);
    
    const index = this.movies.indexOf(movie);
    if (index !== -1) {
      this.movies.splice(index, 1);
    }
    this.steps = this.steps.filter(step => step.label !== movie);
  }

  onShowDialogAddAttribute(): void{
    this.displayDialogAddAttribute = true;
  }

  onAddAttributeClick(): void{
    console.log(this.selectNewAttribute);
    console.log(this.newAttributeName);
    let newAttribute = {
      name: this.newAttributeName,
      type: this.selectNewAttribute.data
    }
    
    if(this.selectNewAttribute.data == "Checkbox" || this.selectNewAttribute.data == "Select"){
      this.onShowDialogAddAttributeEnum();
    }

    this.listAttributes = [...this.listAttributes,newAttribute];
    this.displayDialogAddAttribute = false;
  }

  onShowDialogAddAttributeEnum(): any{
   this.displayDialogAddAttributeEnum = true;

  }

  onAddAttributeEnumClick(): any{
    console.log(this.attributeEnumValue);
    const listAttributes = this.attributeEnumValue.split('#');
    this.listAttributeEnumValues = [...listAttributes]
    this.displayDialogAddAttributeEnum = false;
    return this.handleAttributeAndAttributeEnum();

  }

  handleAttributeAndAttributeEnum():void{
    console.log(this.newAttributeName);
    console.log(this.listAttributes);
    console.log(this.listAttributeEnumValues);
    this.listAttributes = this.listAttributes.map((value) => {
      if(value.name !== this.newAttributeName){
        return value
      }
      if(value.type === 'Input'){
        return {
          name: value.name,
          type: value.type,
  
        }
      }
      return {
        name: value.name,
        type: value.type,
        enums: this.listAttributeEnumValues.map((value) => {
          return {
            data: value,
            label: value
          }
        })
        
        // this.listAttributeEnumValues
      }
      
    })

    return this.test();
    
  }

  test():void{
    console.log(this.listAttributes);
    
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
  

  onSelectionChanged = (event) => {
    if (event.oldRange == null) {
      this.onFocus();
    }
    if (event.range == null) {
      this.onBlur();
    }
  };

  onContentChanged = (event) => {
    console.log(event);
  };

  onFocus = () => {
    console.log('On Focus');
  };
  onBlur = () => {
    console.log('Blurred');
  };
}
