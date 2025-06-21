import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialSiteDetailStoreComponent } from './trial-site-detail-store.component';

describe('TrialSiteDetailStoreComponent', () => {
  let component: TrialSiteDetailStoreComponent;
  let fixture: ComponentFixture<TrialSiteDetailStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrialSiteDetailStoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrialSiteDetailStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
