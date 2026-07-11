import { describe, expect, it } from 'vitest';

import { authSlice, setAuthStatus } from './reducer';

describe('authSlice reducer', () => {
  it('should return the initial state', () => {
    expect(authSlice.reducer(undefined, { type: 'unknown' })).toEqual({
      isAuthChecked: false,
      isLoggedIn: false,
    });
  });

  it('should set auth status', () => {
    expect(
      authSlice.reducer(
        undefined,
        setAuthStatus({ isAuthChecked: true, isLoggedIn: true })
      )
    ).toEqual({
      isAuthChecked: true,
      isLoggedIn: true,
    });
  });
});
