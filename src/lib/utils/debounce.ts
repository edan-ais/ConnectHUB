export function debounce<F extends (...args: any[]) => void>(fn: F, delay: number): F {
  let timer: number | undefined;

  return function debounced(this: any, ...args: any[]) {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn.apply(this, args), delay);
  } as F;
}
