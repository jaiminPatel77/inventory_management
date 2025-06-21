import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailSettingComponent } from './mail-setting.component';

describe('MailSettingComponent', () => {
  let component: MailSettingComponent;
  let fixture: ComponentFixture<MailSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailSettingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MailSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
