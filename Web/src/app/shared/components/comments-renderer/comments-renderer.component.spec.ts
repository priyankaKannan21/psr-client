import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsRendererComponent } from './comments-renderer.component';

describe('CommentsRendererComponent', () => {
  let component: CommentsRendererComponent;
  let fixture: ComponentFixture<CommentsRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentsRendererComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
