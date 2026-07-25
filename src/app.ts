import { Controller } from "./controller";

/**
 * 1ステップあたりの処理をまとめて行ってくれる
 * Controllerの初期化を行う
 */
const instance = Controller.createInstance();

/**
 * 固定タイムステップの間隔(ミリ秒)
 * 60FPS相当の 1000/60 ms を1ステップとして扱う
 */
const STEP_MS = 1000 / 60;

/**
 * 1フレームで消化するステップ数の上限
 * 処理落ちで delta time が大きくなった際に、更新が更新を呼ぶ
 * スパイラルオブデス(死のスパイラル)を避けるための保険
 */
const MAX_STEPS_PER_FRAME = 5;

/**
 * 前回フレームの時刻(performance.now()の値)
 * 差分から delta time を測るために保持する
 */
let previousTime = performance.now();

/**
 * まだ消化しきれていない経過時間の蓄積(ミリ秒)
 * ここに delta time を足し込み、STEP_MS 単位で消化していく
 */
let accumulator = 0;

/**
 * 1フレームあたりの更新処理の定義
 */
function update() {
  /**
   * 今回フレームの時刻を取得し、前回との差分から delta time を求める
   */
  const currentTime = performance.now();
  const deltaTime = currentTime - previousTime;
  previousTime = currentTime;

  /**
   * 経過時間を蓄積し、固定ステップ(STEP_MS)単位で消化する
   * 蓄積が STEP_MS を超えている限り、必要な回数だけ更新処理を呼ぶ
   */
  accumulator += deltaTime;

  let steps = 0;
  while (accumulator >= STEP_MS && steps < MAX_STEPS_PER_FRAME) {
    /**
     * Controllerの更新処理を1ステップ分だけ実行する
     */
    instance.update();
    accumulator -= STEP_MS;
    steps = steps + 1;
  }

  /**
   * 上限までステップを消化してもまだ蓄積が残っている場合は、
   * これ以上ステップを繰り越すとスパイラルオブデスに陥るため、
   * 余った蓄積を切り捨てて追いつくのを諦める
   */
  if (steps >= MAX_STEPS_PER_FRAME) {
    accumulator = 0;
  }

  /**
   * 毎フレームごとに更新処理が実行されるように
   * 更新処理内で再帰的に呼び出しを行う
   * (予め決められた呪文のようなもの)
   */
  window.requestAnimationFrame(update);
}

/**
 * 初期ロード時に、更新処理が実行されるようにする
 * 計測の基準となる時刻もこのタイミングで初期化する
 */
window.addEventListener("load", () => {
  previousTime = performance.now();
  update();
});
