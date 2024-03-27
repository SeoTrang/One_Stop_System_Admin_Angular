import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  quillEditorRef;
  // quillConfig = {
  //   //toolbar: '.toolbar',
  //   toolbar:  [
  //       ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  //       ['code-block'],
  //       [{ header: 1 }, { header: 2 }], // custom button values
  //       [{ list: 'ordered' }, { list: 'bullet' }],

  //       ['clean'], // remove formatting button

  //       ['link'],
  //       ['link', 'video'],
  //     ],
    
  //   imageResize: {},

  //   mention: {
  //     allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
  //     mentionDenotationChars: ['@', '#'],
  //     source: (searchTerm, renderList, mentionChar) => {
  //       let values;

  //       if (mentionChar === '@') {
  //         values = this.atValues;
  //       } else {
  //         values = this.hashValues;
  //       }

  //       if (searchTerm.length === 0) {
  //         renderList(values, searchTerm);
  //       } else {
  //         const matches = [];
  //         for (var i = 0; i < values.length; i++)
  //           if (
  //             ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
  //           )
  //             matches.push(values[i]);
  //         renderList(matches, searchTerm);
  //       }
  //     },
  //   },
  //   'emoji-toolbar': true,
  //   'emoji-textarea': false,
  //   'emoji-shortname': true,
  //   keyboard: {
  //     bindings: {
  //       enter: {
  //         key: 13,
  //         handler: (range, context) => {
  //           console.log('enter');
  //           return true;
  //         },
  //       },
  //     },
  //   },
  // };

  upLoadImgDecriptionVisible: boolean = false;


  @Input() contentDescription: string;
  @Output() contentDescriptionChange = new EventEmitter<string>();

  changeValue() {
    console.log(this.contentDescription);
    
    this.contentDescriptionChange.emit(this.contentDescription);
  }

  constructor() { }

  ngOnInit(): void {
  }

  getEditorInstance(editorInstance: any) {
    console.log("getEditorInstance");
    
    this.quillEditorRef = editorInstance;
    console.log(this.quillEditorRef);
    const toolbar = editorInstance.getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler);
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
    this.changeValue();
    console.log('Blurred');
  };


  handleImageUploadModal(){
    const range = this.quillEditorRef.getSelection();
    const img = '<img src="http://localhost:3000/uploads/nodejs.png" />';
    this.quillEditorRef.clipboard.dangerouslyPasteHTML(range.index, img);
    this.upLoadImgDecriptionVisible = false;
  }


  imageHandler = (image, callback) => {
    
    this.upLoadImgDecriptionVisible = true;
    
  };

}
