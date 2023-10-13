import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadTemplateButtonComponent } from './download-template-button.component';

describe('DownloadTemplateButtonComponent', () => {
  let component: DownloadTemplateButtonComponent;
  let fixture: ComponentFixture<DownloadTemplateButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadTemplateButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadTemplateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
