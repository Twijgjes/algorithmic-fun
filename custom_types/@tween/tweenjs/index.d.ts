// declare module '@tweenjs/tween.js' {
//   export const TWEEN: any;
// }

declare module '@tweenjs/tween.js';
declare namespace TWEEN {
  export function update(time?: number, preserve?: boolean): void;
  export class Tween {
    constructor (object: object);
  }
}