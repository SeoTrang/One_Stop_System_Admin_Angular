import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-preview-media',
  templateUrl: './preview-media.component.html',
  styleUrls: ['./preview-media.component.css']
})
export class PreviewMediaComponent implements OnInit {
  @Input() contents:{ type: string; content: string }[] = [];

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    console.log(this.contents);
    
  }

  getSafeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
