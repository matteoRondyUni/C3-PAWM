import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DitteTrasportiStatsComponent } from './ditte-trasporti-stats.component';

describe('DitteTrasportiStatsComponent', () => {
  let component: DitteTrasportiStatsComponent;
  let fixture: ComponentFixture<DitteTrasportiStatsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DitteTrasportiStatsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DitteTrasportiStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
