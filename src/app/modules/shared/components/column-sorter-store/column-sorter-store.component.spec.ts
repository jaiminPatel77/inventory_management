import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnSorterStoreComponent } from './column-sorter-store.component';

describe('ColumnSorterStoreComponent', () => {
  let component: ColumnSorterStoreComponent;
  let fixture: ComponentFixture<ColumnSorterStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnSorterStoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColumnSorterStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
