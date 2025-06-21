import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseListStoreComponent } from './base-list-store.component';

describe('BaseListStoreComponent', () => {
  let component: BaseListStoreComponent;
  let fixture: ComponentFixture<BaseListStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseListStoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BaseListStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
