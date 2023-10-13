import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DownloadTemplateButtonComponent } from './download-template-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';

fdescribe('DownloadTemplateButtonComponent', () => {
  let component: DownloadTemplateButtonComponent;
  let fixture: ComponentFixture<DownloadTemplateButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTooltipModule],
      declarations: [DownloadTemplateButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadTemplateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize buttonTooltip correctly for evaluatorHeadersTemplate.csv', () => {
    component.fileName = 'evaluatorHeadersTemplate.csv';
    component.ngOnInit();
    expect(component.buttonTooltip).toBe('Download Evaluator Template');
  });

  it('should initialize buttonTooltip correctly for other files', () => {
    component.fileName = 'otherTemplate.csv';
    component.ngOnInit();
    expect(component.buttonTooltip).toBe('Download Candidate Template');
  });

  it('should trigger downloadCsvFile method when button is clicked', () => {
    spyOn(component, 'downloadCsvFile');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    expect(component.downloadCsvFile).toHaveBeenCalled();
  });

  it('should create a download link when downloadCsvFile() is called', () => {
    spyOn(document, 'createElement').and.callThrough();
    spyOn(document.body, 'appendChild');
    spyOn(document.body, 'removeChild');
    component.fileName = 'test.csv';
    component.downloadCsvFile();
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
  });
});
