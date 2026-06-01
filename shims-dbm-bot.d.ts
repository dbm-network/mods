/**
 * Ambient module shims for optional DBM bot runtime dependencies (typecheck only).
 */
declare module 'jimp' {
  const Jimp: any;
  export = Jimp;
}

declare module '@jimp/plugin-print' {
  export type Font = any;
}
