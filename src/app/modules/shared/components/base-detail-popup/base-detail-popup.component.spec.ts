import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDetailPopupComponent } from './base-detail-popup.component';

describe('BaseDetailPopupComponent', () => {
  let component: BaseDetailPopupComponent;
  let fixture: ComponentFixture<BaseDetailPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseDetailPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BaseDetailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
