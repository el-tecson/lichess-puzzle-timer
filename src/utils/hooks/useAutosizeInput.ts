import { useEffect, useRef } from "react";
import autosizeInput from "autosize-input";

export default function useAutosizeInput(
  value: string | number,
  options: { minWidth?: number; maxWidth?: number } = {}
) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      const cleanup = autosizeInput(inputRef.current, options);
      inputRef.current.value = value.toString();
      // update the width manually on value change
      const evt = new Event("input", { bubbles: true });
      inputRef.current.dispatchEvent(evt);
      return cleanup;
    }
  }, [value, options.minWidth, options.maxWidth]);

  return inputRef;
}