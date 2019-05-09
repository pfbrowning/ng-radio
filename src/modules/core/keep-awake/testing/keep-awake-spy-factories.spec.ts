export class KeepAwakeSpyFactories {  
    public static CreateKeepAwakeServiceSpy(): any {
      return jasmine.createSpyObj('keepAwakeServiceSpy', ['enable', 'disable']);
    }
}
  