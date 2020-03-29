import * as fromAuthentication from './authentication.actions';

describe('loadAuthentications', () => {
  it('should return an action', () => {
    expect(fromAuthentication.loadAuthentications().type).toBe('[Authentication] Load Authentications');
  });
});
