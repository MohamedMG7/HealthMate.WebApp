import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.css']
})
export class PopupMessageComponent implements OnInit {
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Input() imageUrl: string = ''; 

  
  ngOnInit() {
    setTimeout(() => {
      const el = document.getElementById(this.message);
      if (el) el.remove();
    }, 3000);
  }
}
