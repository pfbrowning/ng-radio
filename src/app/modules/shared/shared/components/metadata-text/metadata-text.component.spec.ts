import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataTextComponent } from './metadata-text.component';

describe('MetadataTextComponent', () => {
  let component: MetadataTextComponent;
  let fixture: ComponentFixture<MetadataTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetadataTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
