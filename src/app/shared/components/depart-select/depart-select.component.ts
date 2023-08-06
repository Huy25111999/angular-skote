import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TreeviewI18n, TreeviewItem, TreeviewConfig, DropdownTreeviewComponent, TreeviewHelper } from 'ngx-treeview';
import { DropdownTreeviewSelectI18n } from './dropdown-treeview-select-i18n-custom';
import { isNil } from 'lodash';
import { AbstractControl} from "@angular/forms"
import {get} from 'http';
import {element} from 'protractor'
@Component({
  selector: 'app-depart-select',
  templateUrl: './depart-select.component.html',
  styleUrls: ['./depart-select.component.scss'],
  providers: [
    {provide: TreeviewI18n, useClass: DropdownTreeviewSelectI18n}
  ]
})
export class DepartSelectComponent implements OnChanges {

  //@Input() config: TreeviewConfig;
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: true,
    hasFilter: true,
    maxHeight: 500
  });

  @Output() isFocus = new EventEmitter<boolean>();
  @Input() placeholder: any = 'Chọn giá trị';
  @Input() items: TreeviewItem[];
  @Input() value: any;
  @Input() fullList: any[]= [];
  @Input() control: AbstractControl;
  @Input() isRequired: boolean = true;
  @Output() valueChange = new EventEmitter<any>();
  @Output () isOpenEvent = new EventEmitter<any>();
  @ViewChild(DropdownTreeviewComponent, { static: false }) dropdownTreeviewComponent: DropdownTreeviewComponent;
  filterText: string;
  isShowSelect  = false;
  isOpen = false;
  title: string = '';

  private dropdownTreeviewSelectI18n: DropdownTreeviewSelectI18n;
  constructor(
    public i18n: TreeviewI18n
  ) {
    this.dropdownTreeviewSelectI18n = i18n as DropdownTreeviewSelectI18n;
  }

  ngOnInit(): void{
    this.dropdownTreeviewSelectI18n.plhd = this.placeholder;
    this.control.valueChanges.subscribe(value =>{
      if(!value){
        this.updateSelectedItem();
        this.title = this.dropdownTreeviewSelectI18n.textInner;
      }else{
        this.updateSelectedItem();
        this.title = this.dropdownTreeviewSelectI18n.textInner;
      }
    })
    //-----------
    this.fullList = this.fullList.map( e=>{
      return {
        ...e,
        text: `${e.name?e.name + (e.code?'_':''):''} ${e.code ? `${e.code}`:''}`,
        title: `${e.name?e.name + (e.code?'_':''):''} ${e.code ? `${e.code}`:''}`,
        value: e.unitId,
        key:e.unitId,
        patch: `${e.code}`
      }
    })
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.updateSelectedItem();
    this.dropdownTreeviewSelectI18n.fullList = this.fullList;

    //----------
    this.itemsOld = this.items;

  }


  select(item: TreeviewItem): void {
      this.selectItem(item);
  }

  isEmpty(v: any){
    return v === '' || v === void(0) || v === null ;
  }

  private updateSelectedItem(): void {
    if (!this.isEmpty(this.items)) {
      const selectedItem = TreeviewHelper.findItemInList(this.items, this.control.value);
      this.selectItem(selectedItem);
    }
  }

  private selectItem(item: TreeviewItem): void {
    if (this.dropdownTreeviewSelectI18n.selectedItem !== item) {
      this.dropdownTreeviewSelectI18n.selectedItem = item;
      if (this.dropdownTreeviewComponent) {
        this.dropdownTreeviewComponent.onSelectedChange([item]);
      }

      if (item) {
        if (this.value !== item.value) {
          this.control.setValue(item.value);
        }
      }
    }
  }

  clearData() {
    this.control.setValue(null);
    this.control.markAsTouched(); // marks
    if(this.control.invalid) {
      this.control.markAsDirty(); // marks
    }
    this.selectItem(null);
  }

  emitEvent(e){
    if( e !== this.isShowSelect){
      this.isShowSelect = e;
      this.isFocus.emit(e);

    }
  }

  eventClose(){
    this.isOpen = !this.isOpen;
    this.isOpenEvent.emit(this.isOpen);
  }


  //  config filter gợi ý định dạng LV1-LV2-LV3 or LV1/LV2/LV3

  itemsOld:any
  unit: any[] = []
  onFilterTextChange(event){
    let newArr = [];
    let need = [];
    let unitParent = [];
    let unitChild = [];
    const text = event.includes('-')? event.split('-').filter( e => e !== ""): event.split('/').filter(e =>e !== "");
    
    newArr = this.fullList;
    if(text.length <= 1){
      const filterNode = this.fullList.filter( e => e.text.includes(event.replace('-',"")));
      if(event === ''){
        this.items = this.itemsOld
      }else if(filterNode.length > 0){
        let parent = [];
        let child = [];
        this.setUnitTreeParent(parent, filterNode, newArr);
        this.setUnitChildren(child, filterNode, newArr);
        const unit = [...parent, ...child];
        let mapUnit = [...new Set(unit)];

        const mapTree: any = mapUnit.filter(k => !k.parentId);
        this.mapChild(mapTree, mapUnit);
        this.items = mapTree.map(e =>new TreeviewItem(e));
      }else{
        this.items = []
      }
    }else{
      for(let i =0; i<text.length; i++){
        if(i === 0){
          const getChild = this.fullList.filter(e => e.text.includes(text[i].replace('-',"")) && !e.parentId);
          need = [...getChild];
        }else{
          const checkNodata = [];
          need.forEach((item, j) =>{
            const getNode = this.fullList.filter(e => e.parentId === item.unitId && e.text.includes(text[i].replace('-',"")));
            if(getNode.length >0){
              need = [...getNode];
              checkNodata.push(getNode);
              unitParent.push(item);
            }
          });
          if(checkNodata.length === 0){
            need = []
          }
        }
      }
      if(need.length >0){
        if(text.length === 1){
          this.mapChild(need, newArr);
          this.items = need.map(e => new TreeviewItem(e));
        }
      }else{
        this.items = []
      }
    }

  }

  mapChild(need:any, array: any){
    for(let i = 0; i <need.length; i++){
      const obj:any = need[i];
      obj.text = `${obj.name ? obj.name + (obj.code ?'-':''):''} ${obj.code ? `${obj.code}`:''}`;
      obj.title = `${obj.name ? obj.name + (obj.code ?'-':''):''} ${obj.code ? `${obj.code}`:''}`;
      obj.value = obj.unitId;
      obj.key = obj.unitId;
      const child = array.filter(e => e.parentId === obj.unitId);
      if(child.length === 0){
        obj.isLeaf = true;
        continue;
      }else{
        obj.children = child.map( e =>{
          return {
            ...e,
            text: `${e.name ? e.name + (e.code ?'-':''):''} ${e.code ? `${e.code}`:''}`,
            title: `${e.name ? e.name + (e.code ?'-':''):''} ${e.code ? `${e.code}`:''}`,
            value: e.unitId,
            key: e.unitId,
          }
        })
      }
      this.mapChild(obj.children, array)
    }
  }

  setNode(need:any, text: any){
    need.forEach(element =>{
      const getNode = this.fullList.filter(e => e.parentId === element.unitId && e.name.includes(text));
      if(getNode){
        need = [...getNode, element]
      }
    })
  }

  setUnitTreeParent(need:any, array:any, unitStatus:any){
    array.forEach(element =>{
      if(element.parentId !== null){
        const record = unitStatus.filter(e =>{
          if(e.unitId === element.parentId){
            need.push(e);
            return e
          }
        });
        if(record.length > 0){
          need.push(element);
          this.setUnitTreeParent(need,record,unitStatus)
        }
      }
    })
  }

  setUnitTreeChildren(need:any, array:any){
    for(let i= 0; i<array.length; i++){
      const obj = array[i];
      const child = this.fullList.filter(e =>{
        if(e.parentId === obj.unitId){
          need.push(e);
          return e
        }
      });
      if(child.length >0 ){
        this.setUnitTreeChildren(need, child);
      }
    }
  }

  setUnitChildren(need:any, array:any, unitStatus){
    for(let i= 0; i<array.length; i++){
      const obj = array[i];
      const child = unitStatus.filter(e =>{
        if(e.parentId === obj.unitId){
          need.push(e);
          return e
        }
      });
      if(child.length >0 ){
        this.setUnitChildren(need, child, unitStatus);
      }
    }
  }

}
