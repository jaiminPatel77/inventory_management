import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialSiteDetailComponent } from './trial-site-detail.component';

describe('TrialSiteDetailComponent', () => {
  let component: TrialSiteDetailComponent;
  let fixture: ComponentFixture<TrialSiteDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrialSiteDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrialSiteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
