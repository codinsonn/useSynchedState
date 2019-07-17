/* --- deepMatch() ------------------------------------------------------------------------------ */
// -i- Return true when object values are the same
// -i- Could be used in prop comparison to check whether we should trigger rerender
export const deepMatch = (a, b) => JSON.stringify(a) === JSON.stringify(b);
