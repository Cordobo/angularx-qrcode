declare module 'qrcodejs2';

declare class QRCode {
  public static CorrectLevel: {
    H: 2;
    L: 1;
    M: 0;
    Q: 3;
  };

  constructor(el: HTMLElement, optionsOrText: string | {
    colorDark?: string;
    colorLight?: string;
    correctLevel?: 0 | 1 | 2 | 3;
    height?: number;
    text?: string;
    width?: number;
  });

  protected clear(): void;
  protected makeCode(text: string): void;
  protected makeImage(): void;
}
