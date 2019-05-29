export function createKeepAwakeServiceSpy(): any {
  return jasmine.createSpyObj('keepAwakeServiceSpy', ['enable', 'disable']);
}
