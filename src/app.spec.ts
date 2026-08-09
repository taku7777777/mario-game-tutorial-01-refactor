// G-APP-10 本番レッグ / G-APP-8(実承認の通し)用の題材。
// test_patterns の "*.spec.ts" に一致させ、intent の TESTS-CHANGED を YES にする。
// webpack の entry から import されないのでビルド対象には入らない。

export function approvalGateProductionLeg(): number {
  return 2;
}
