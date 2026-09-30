/// <reference types="@testing-library/jest-native" />
/// <reference types="jest" />
/// <reference types="react" />
/// <reference types="react-native" />

declare global {
  const __DEV__: boolean;
  
  namespace jest {
    interface Matchers<R> {
      toBeOnTheScreen(): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveStyle(css: string | Record<string, any>): R;
      toHaveClass(className: string): R;
    }
  }
}

export {};