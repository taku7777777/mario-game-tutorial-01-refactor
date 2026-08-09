// Stage 2 承認ヘルパーのライブゲート(G-APP-10 / G-APP-8)用の題材。
// test_patterns = ["*.test.ts", "*.spec.ts"] に一致させ、intent の
// TESTS-CHANGED を YES にするために置く。webpack の entry から import
// されないのでビルド対象には入らない(npm run build は緑のまま)。

export function approvalGateFixture(): string {
  return "stage2-approval-live-gate";
}
