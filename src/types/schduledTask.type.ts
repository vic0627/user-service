/**
 * - `true` - 可清除的任務
 * - `false` - 不可清除的任務
 */
type PopSignal = boolean;

export type Task = (now: number) => PopSignal;
