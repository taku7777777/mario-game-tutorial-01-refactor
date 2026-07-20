/**
 * ジャンプの物理計算をまとめた純粋関数群
 *
 * ここに定義する関数は副作用を持たず、引数から新しい値を返すだけにする。
 * (状態は呼び出し側のController等が保持し、テストを簡潔にできるようにする)
 *
 * 座標系はCanvasの慣習に合わせ、y軸は下向きを正とする。
 * したがって上方向への移動は負のvy(縦速度)で表現される。
 */

/**
 * 重力加速度 (px / フレーム^2)
 */
export const GRAVITY = 0.5;

/**
 * ジャンプ開始時に与える初速 (px / フレーム)
 * 上向きに移動するため負の値
 */
export const JUMP_VELOCITY = -10;

/**
 * 地面のy座標。接地している状態のyがこの値になる
 */
export const GROUND_Y = 0;

/**
 * ジャンプ物理の状態
 * - y:        縦位置 (下向き正)
 * - vy:       縦速度 (下向き正、上昇中は負)
 * - onGround: 接地しているか
 */
export interface JumpState {
  y: number;
  vy: number;
  onGround: boolean;
}

/**
 * 初期状態(地面に接地して静止している状態)を生成する
 */
export const createInitialJumpState = (): JumpState => ({
  y: GROUND_Y,
  vy: 0,
  onGround: true,
});

/**
 * 重力による速度更新
 * 現在の縦速度に重力加速度を加算した新しい縦速度を返す
 */
export const applyGravity = (vy: number, gravity: number = GRAVITY): number =>
  vy + gravity;

/**
 * 縦位置の更新
 * 現在の縦位置に縦速度を加算した新しい縦位置を返す
 */
export const updateVerticalPosition = (y: number, vy: number): number => y + vy;

/**
 * 着地判定
 * yが地面以下(下向き正なので>=)まで到達していれば、
 * 地面にクランプし、速度を0にして接地状態にする。
 * まだ空中であればそのままの状態を返す。
 */
export const resolveLanding = (
  y: number,
  vy: number,
  groundY: number = GROUND_Y
): JumpState => {
  if (y >= groundY) {
    return { y: groundY, vy: 0, onGround: true };
  }
  return { y, vy, onGround: false };
};

/**
 * 1フレーム分のジャンプ物理更新
 * 「重力による速度更新 → 縦位置の更新 → 着地判定」を順に適用し、
 * 新しい状態を返す純粋関数。
 */
export const stepJump = (
  state: JumpState,
  gravity: number = GRAVITY,
  groundY: number = GROUND_Y
): JumpState => {
  const vy = applyGravity(state.vy, gravity);
  const y = updateVerticalPosition(state.y, vy);
  return resolveLanding(y, vy, groundY);
};

/**
 * ジャンプ開始
 * 接地している場合のみ初速を与えて空中状態にする。
 * 空中では二段ジャンプを許可せず、現在の状態をそのまま返す。
 */
export const startJump = (
  state: JumpState,
  jumpVelocity: number = JUMP_VELOCITY
): JumpState => {
  if (!state.onGround) {
    return state;
  }
  return { y: state.y, vy: jumpVelocity, onGround: false };
};
