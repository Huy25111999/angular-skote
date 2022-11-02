import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter, forwardRef, Input,
  OnInit, Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {
  NbAdjustment,
  NbOverlayRef,
  NbOverlayService,
  NbPosition,
  NbPositionBuilderService,
  NbTemplatePortal
} from '@nebular/theme';
import {TreeviewConfig, TreeviewItem} from './ngx-treeview';

@Component({
  selector: 'ngx-tree-picker',
  templateUrl: './tree-picker.component.html',
  styleUrls: ['./tree-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TreePickerComponent),
      multi: true
    }
  ]
})
export class TreePickerComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @Input() maxHeight?: number;
  @ViewChild('overlay', {static: false}) overlayTemplate: TemplateRef<any>;
  @ViewChild('inputElement', {static: false}) inputElement: ElementRef<any>;
  protected ref: NbOverlayRef;
  @Input() items: TreeviewItem[] = [];
  @Input() hasFilter?: boolean = true;
  @Input() hasAllCheckBox?: boolean = false;
  @Input() hasCollapseExpand?: boolean = true;
  @Input() decoupleChildFromParent?: boolean = false;
  @Output() change = new EventEmitter<any[]>();

  values: any[];
  texts: any[];
  config: TreeviewConfig;
  propagateChange = (_: any) => {
  };

  constructor(protected overlay: NbOverlayService,
              protected positionBuilder: NbPositionBuilderService,
              protected vcr: ViewContainerRef,
              protected cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.config = TreeviewConfig.create({
      hasAllCheckBox: this.hasAllCheckBox,
      hasFilter: this.hasFilter,
      hasCollapseExpand: this.hasCollapseExpand,
      decoupleChildFromParent: this.decoupleChildFromParent
    });
    if (this.maxHeight !== null && this.maxHeight !== undefined) {
      this.config.maxHeight = this.maxHeight
    }
  }

  ngAfterViewInit(): void {
    const positionStrategy = this.positionBuilder.connectedTo(this.inputElement)
      .position(NbPosition.BOTTOM_END)
      .adjustment(NbAdjustment.VERTICAL)
      .withFlexibleDimensions(true)
      .offset(5);
    this.ref = this.overlay.create({positionStrategy, hasBackdrop: true});
    this.ref.backdropClick().subscribe(() => this.dismissOverlay());
  }

  createOverlay() {
    if (this.ref.hasAttached()) {
      return;
    }

    this.ref.attach(new NbTemplatePortal(this.overlayTemplate, this.vcr));
  }
  dismissOverlay() {
    this.ref.detach();
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    // this.propagateChange = fn;
  }

  writeValue(obj: any): void {
    this.values = obj;
    // console.log('Gia tri writeValue:', this.values);
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  onFilterChange(value: string) {
  }
  onSelectedChange(value: any[]) {
    this.texts = value.map(x => x['text']);
    this.values = value.map(x => x['value']);
    this.propagateChange(this.values);
    if (this.change !== null && this.change !== undefined) {
      this.change.emit(this.values);
    }
  }

}
