import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailModal } from './vehicle-detail-modal';

describe('VehicleDetailModal', () => {
  let component: VehicleDetailModal;
  let fixture: ComponentFixture<VehicleDetailModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDetailModal],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleDetailModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
