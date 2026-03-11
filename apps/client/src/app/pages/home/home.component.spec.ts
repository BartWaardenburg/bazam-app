import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  const mockRouter = { navigate: vi.fn().mockResolvedValue(true) };

  let component: HomeComponent;

  beforeEach(async () => {
    mockRouter.navigate.mockClear();

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(HomeComponent, {
        set: {
          imports: [],
          providers: [{ provide: Router, useValue: mockRouter }],
        },
      })
      .compileComponents();

    const fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /host/create when navigateTo is called with that path', () => {
    component.navigateTo('/host/create');

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/host/create']);
  });

  it('should navigate to /play/join when navigateTo is called with that path', () => {
    component.navigateTo('/play/join');

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/play/join']);
  });
});
