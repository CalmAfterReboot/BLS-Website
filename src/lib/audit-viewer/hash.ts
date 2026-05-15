// djb2 — small non-cryptographic string hash, stable across runs.
// Used to give findings a stable identifier so per-row expanded state
// survives filter changes and re-renders.
export function djb2(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}
