import { useRef } from "react";

export function usePersistentCallback(func) {
  const ref = useRef(null);
  if (!ref.current) {
    ref.current = {
      callee: func,
      caller: function () {
        return ref.current.callee.apply(this, arguments);
      },
    };
  }
  ref.current.callee = func;
  return ref.current.caller;
}
