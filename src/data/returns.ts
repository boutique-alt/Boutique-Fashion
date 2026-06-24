export const RETURN_WINDOW_DAYS = 7

export const RETURN_REASONS = [
  'Wrong size',
  'Damaged / defective',
  'Wrong item received',
  'Not as described',
  'Changed mind',
] as const

export type ReturnReason = (typeof RETURN_REASONS)[number]
