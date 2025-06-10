import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomPipe } from 'src/app/pipes/custom.pipe';
import { MaskPipePipe } from 'src/app/pipes/mask-pipe.pipe';

@Component({
  selector: 'app-reactive-form-display',
  standalone:true,
  imports:[ CommonModule,
      FormsModule,
      ReactiveFormsModule,
      CustomPipe,
      MaskPipePipe,
    ],
  templateUrl: './reactive-form-display.component.html',
  styleUrls: ['./reactive-form-display.component.css']
})
export class ReactiveFormDisplayComponent {
  @Input() formData: any;

  ngOnInit() {
    console.log('OnInit: ReactiveFormDisplayComponent initialized.');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('OnChanges: ReactiveFormDisplayComponent changes detected.', changes);
  }

  ngOnDestroy() {
    console.log('OnDestroy: ReactiveFormDisplayComponent destroyed.');
  }

}
