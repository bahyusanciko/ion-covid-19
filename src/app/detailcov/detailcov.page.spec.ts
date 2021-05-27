import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailcovPage } from './detailcov.page';

describe('DetailcovPage', () => {
  let component: DetailcovPage;
  let fixture: ComponentFixture<DetailcovPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailcovPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailcovPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
