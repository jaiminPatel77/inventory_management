import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogPopupComponent } from './confirm-dialog-popup.component';

describe('ConfirmDialogPopupComponent', () => {
  let component: ConfirmDialogPopupComponent;
  let fixture: ComponentFixture<ConfirmDialogPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmDialogPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
