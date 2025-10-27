import { Middleware } from '@reduxjs/toolkit';

let consoleEnabled = false;

export const enableConsoleLogs = (enabled: boolean) => {
  consoleEnabled = enabled;
};

// Redux middleware để log state changes
export const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  if (consoleEnabled) {
    console.group('🔍 Redux Action');
    console.log('%cPrevious State:', 'color: #9E9E9E', store.getState());
    console.log('%cAction:', 'color: #03A9F4', action);
  }

  const result = next(action);

  if (consoleEnabled) {
    console.log('%cNext State:', 'color: #4CAF50', store.getState());
    console.groupEnd();
  }

  return result;
};

