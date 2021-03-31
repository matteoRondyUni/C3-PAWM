import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlertFeatureNotImplementedComponent } from './alert-feature-not-implemented.component';

describe('AlertFeatureNotImplementedComponent', () => {
  let component: AlertFeatureNotImplementedComponent;
  let fixture: ComponentFixture<AlertFeatureNotImplementedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertFeatureNotImplementedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertFeatureNotImplementedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
