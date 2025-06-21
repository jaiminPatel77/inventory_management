import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialSiteListComponent } from './trial-site-list.component';

describe('TrialSiteListComponent', () => {
  let component: TrialSiteListComponent;
  let fixture: ComponentFixture<TrialSiteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrialSiteListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrialSiteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
