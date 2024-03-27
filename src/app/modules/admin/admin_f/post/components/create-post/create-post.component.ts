import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ContentPost, CreatePost } from '@core/models/post';
import { DepartmentService } from '@core/services/deparment.service';
import { File2Service } from '@core/services/file2.service';
import { LoadingService } from '@core/services/loading.service';
import { NotificationService } from '@core/services/notification.service';
import { PostService } from '@core/services/post.service';

class DataDepartment {
  name: string;
  code: string;
}
class DataTypeQuestion {
  name: string;
  code: string;
}

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CreatePostComponent implements OnInit {
  dataTypeQuestions: any[] = [
    { name: 'Câu hỏi', code: 'Câu hỏi' },
    { name: 'Thắc mắc', code: 'Thắc mắc' },
  ];
  selectedTypeQuestion: DataTypeQuestion;
  dataDepartments: DataDepartment[] = [];
  selectedDepartment: DataDepartment;

  mediasPreviewUrl: { type: string; content: string }[] = [];
  imgFile: File[];
  videoFile: File[];
  ortherFile: File[];
  departmentDialogVisible: boolean = false;

  caption: string = null;

  constructor(
    private file2Service: File2Service,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private postService: PostService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.initDepartmentsData();
  }

  convertDepartmentMenuSelectDepartment(data: any): DataDepartment[] {
    let result: DataDepartment[] = [];
    return (result = data.map((item) => ({
      name: item.name,
      code: item.id.toString(),
    })));
  }

  initDepartmentsData() {
    this.departmentService.getAllDepartments().subscribe({
      next: (res) => {
        const transformedData = this.convertDepartmentMenuSelectDepartment(res);

        this.dataDepartments = [...transformedData];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  showDepartmentDialog() {
    this.departmentDialogVisible = true;
  }

  handleImageChange(event: any) {
    this.videoFile = null;
    this.ortherFile = null;
    event.preventDefault();
    const files = event.target.files;
    this.imgFile = files;
    const previewUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = URL.createObjectURL(file);
      previewUrls.push({
        type: 'img',
        content: imageUrl,
      });
    }

    this.mediasPreviewUrl = previewUrls;
  }

  handleVideoChange(event: any) {
    this.imgFile = null;
    this.ortherFile = null;
    const file = event.target.files[0];
    console.log(event.target.files[0]);
    this.videoFile = event.target.files;
    if (file && file.type.includes('video')) {
      const videoURL = URL.createObjectURL(file);
      this.mediasPreviewUrl = [
        {
          type: 'video',
          content: videoURL,
        },
      ];
    } else {
      // Handle non-video file here
    }
  }

  deleteFile() {
    this.imgFile = null;
    this.videoFile = null;
    this.ortherFile = null;
    this.mediasPreviewUrl = [];
  }

  handleInputChange() {
    // Xử lý khi nội dung của textarea thay đổi
  }

  isCaptionValid(): boolean {
    return this.caption != null && this.caption.trim() !== '';
  }

  // handle upload file
  async handleUploadFile(): Promise<ContentPost[]> {
    let fileUpload: string[] = [];
    if (
      this.imgFile != null ||
      this.videoFile != null ||
      this.ortherFile != null
    ) {
      fileUpload = await this.file2Service.uploadFiles(this.imgFile);
      if (fileUpload.length <= 0) {
        this.notificationService.toastError(
          'Lỗi trong quá trình tải ảnh',
          'Thông báo'
        );
        return null;
      }
    }
    if (this.imgFile != null) {
      let linkImg: ContentPost[] = [];
      for (let index = 0; index < fileUpload.length; index++) {
        linkImg = [...linkImg, { type: 'img', content: fileUpload[index] }];
      }

      return linkImg;
    }

    if (this.videoFile != null) {
      let linkVideo: ContentPost[] = [];
      for (let index = 0; index < fileUpload.length; index++) {
        linkVideo = [
          ...linkVideo,
          { type: 'video', content: fileUpload[index] },
        ];
      }

      return linkVideo;
    }

    if (this.ortherFile != null) {
      let linkOrtherFile: ContentPost[] = [];
      for (let index = 0; index < fileUpload.length; index++) {
        linkOrtherFile = [
          ...linkOrtherFile,
          { type: 'file', content: fileUpload[index] },
        ];
      }

      return linkOrtherFile;
    }
    return null;
  }

  resetForm(){
    this.caption = null;
    this.imgFile = null;
    this.videoFile = null;
    this.ortherFile = null;
    this.selectedDepartment = null;
    this.selectedTypeQuestion = null;
    this.mediasPreviewUrl = null;
  }

  async handleSumit() {
    //  const contentPost:ContentPost[] = await this.handleUploadFile();
    //  console.log(contentPost);

    console.log(this.caption);

    console.log(this.selectedDepartment);
    console.log(this.selectedTypeQuestion);

    let linkContents: ContentPost[] = await this.handleUploadFile();

    let createPost: CreatePost = new CreatePost(
      this.caption, ///caption
      this.selectedTypeQuestion.code || null, // type question
      Number(this.selectedDepartment.code) || null, //
      linkContents
    );

    this.loadingService.showLoading();
    const savePost = this.postService.createPost(createPost).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.loadingService.hideLoading();
          this.notificationService.toastSuccess(
            'Thêm thành công !',
            'Thông báo'
          );

          this.resetForm();
        }, 500);
      },
      error: (err) => {
        this.loadingService.hideLoading();
        this.notificationService.toastError('Thêm thất bại', 'Thông báo');
      },
    });
    // Handle submit logic here
  }
}
