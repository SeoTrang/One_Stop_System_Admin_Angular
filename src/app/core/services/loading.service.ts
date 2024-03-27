// loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  showLoading() {
    this.loadingSubject.next(true);
  }

  hideLoading() {
    setTimeout(() => {
      this.loadingSubject.next(false);
    }, 500);
  }
}


/*
Trong đoạn mã trên:

1. `@Injectable({ providedIn: 'root' })`: Đây là decorator dùng để cung cấp dependency của `LoadingService` trong toàn bộ ứng dụng (root injector). Điều này có nghĩa là bạn không cần phải thêm `LoadingService` vào phần providers của module nào cả, Angular sẽ tự động quản lý việc tạo ra một instance duy nhất của `LoadingService` và cung cấp nó cho mọi nơi trong ứng dụng.

2. `private loadingSubject = new BehaviorSubject<boolean>(false);`: Đây là một BehaviorSubject trong RxJS, một loại Observable đặc biệt có thể giữ một giá trị hiện tại và phát ra giá trị này cho mọi subscriber. BehaviorSubject này được sử dụng để theo dõi trạng thái loading. Ban đầu, giá trị của loadingSubject được thiết lập là `false`, tức là không loading.

3. `loading$ = this.loadingSubject.asObservable();`: loading$ là một Observable mà các component khác có thể subscribe để lắng nghe trạng thái loading.

4. `showLoading()`: Phương thức này được sử dụng để hiển thị trạng thái loading. Khi gọi showLoading(), nó sẽ đặt giá trị của loadingSubject thành `true`, từ đó thông báo cho tất cả các subscriber rằng ứng dụng đang loading.

5. `hideLoading()`: Phương thức này được sử dụng để ẩn trạng thái loading. Khi gọi hideLoading(), nó sẽ đặt giá trị của loadingSubject thành `false`, thông báo cho tất cả các subscriber rằng quá trình loading đã hoàn thành.


 có thể sử dụng `asObservable()` để lấy giá trị hiện tại của `loadingSubject`. Khi bạn sử dụng `asObservable()`, bạn chỉ có thể subscribe vào observable mà không thể thay đổi giá trị của nó từ bên ngoài. Điều này giúp duy trì tính bao đóng của dữ liệu và ngăn chặn các thành phần khác thay đổi giá trị của `loading$` trực tiếp.

Ví dụ, bạn có thể sử dụng `loading$` để lấy giá trị hiện tại của `loadingSubject` trong một component:

```typescript
import { Component, OnInit } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-example',
  template: `
    <div *ngIf="isLoading$ | async">
      Loading...
    </div>
  `,
})
export class ExampleComponent implements OnInit {
  isLoading$ = this.loadingService.loading$;

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    // Subscribe để nhận thông báo về trạng thái loading thay đổi
    this.isLoading$.subscribe(isLoading => {
      console.log('Trạng thái loading:', isLoading);
    });
  }
}
```

Trong ví dụ trên, `isLoading$` là một observable mà bạn có thể sử dụng trong template của component để hiển thị thông tin về trạng thái loading. Bạn cũng có thể sử dụng `subscribe()` để nhận thông báo về các thay đổi trạng thái loading và thực hiện các hành động tương ứng khi trạng thái loading thay đổi.
*/
