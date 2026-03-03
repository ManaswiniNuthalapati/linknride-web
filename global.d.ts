// web/global.d.ts
export {}; // ensure this file is a module

declare global {
  interface Window {
    recaptchaVerifier?: any;
    confirmationResult?: any;
  }
}
