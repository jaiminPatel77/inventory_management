import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialSiteListStoreComponent } from './trial-site-list-store.component';

describe('TrialSiteListStoreComponent', () => {
  let component: TrialSiteListStoreComponent;
  let fixture: ComponentFixture<TrialSiteListStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrialSiteListStoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrialSiteListStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
