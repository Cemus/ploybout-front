/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";

export function useFn<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef(fn);
  ref.current = fn;

  function wrapper(this: any, ...args: Parameters<T>): ReturnType<T> {
    return ref.current.apply(this, args);
  }

  return useRef(wrapper as T).current;
}

//By hackape, avoid useEffect eslint rule message
