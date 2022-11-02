import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostListener,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef, AfterContentChecked
} from '@angular/core';
import {TreeviewI18n} from './treeview-i18n';
import {TreeviewItem} from './treeview-item';
import {TreeviewConfig} from './treeview-config';
import {TreeviewComponent} from './treeview.component';
import {DropdownDirective} from './dropdown.directive';
import {TreeviewHeaderTemplateContext} from './treeview-header-template-context';
import {TreeviewItemTemplateContext} from './treeview-item-template-context';

@Component({
  selector: 'ngx-dropdown-treeview',
  templateUrl: './dropdown-treeview.component.html',
  styleUrls: ['./dropdown-treeview.component.scss']
})
export class DropdownTreeviewComponent implements AfterContentChecked {
  @Input() buttonClass = 'btn-outline-secondary';
  @Input() headerTemplate: TemplateRef<TreeviewHeaderTemplateContext>;
  @Input() itemTemplate: TemplateRef<TreeviewItemTemplateContext>;
  @Input() items: TreeviewItem[];
  @Input() disable: boolean
  @Input() config: TreeviewConfig;
  @Output() selectedChange = new EventEmitter<any[]>(true);
  @Output() filterChange = new EventEmitter<string>();
  @ViewChild('treeviewComponent', {static: false}) treeviewComponent: TreeviewComponent;
  @ViewChild(DropdownDirective, {static: false}) dropdownDirective: DropdownDirective;
  ngAfterContentChecked() {
    this.cdref.detectChanges();

  }
  constructor(
    public i18n: TreeviewI18n,
    private defaultConfig: TreeviewConfig,
    private cdref: ChangeDetectorRef
  ) {
    this.config = this.defaultConfig;
  }

  getText(): string {
    if (this.treeviewComponent) {
      return this.i18n.getText(this.treeviewComponent.selection);
    } else {
      return `Lựa chọn`;
    }
  }

  onSelectedChange(values: any[]) {
    this.selectedChange.emit(values.map(e => e.value));
  }

  onFilterChange(text: string) {
    this.filterChange.emit(text);
  }
}
