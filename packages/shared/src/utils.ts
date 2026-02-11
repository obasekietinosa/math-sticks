import { DIGITS } from './constants.js';

export function getSegments(num: number): boolean[][] {
  const digits = num.toString().split('').map(Number);
  return digits.map(d => [...DIGITS[d]]);
}

export function isValidDigit(segments: boolean[]): number {
  for (let i = 0; i < DIGITS.length; i++) {
    const d = DIGITS[i];
    if (d.every((val, idx) => val === segments[idx])) {
      return i;
    }
  }
  return -1;
}

export function isValidNumber(allSegments: boolean[][]): number {
  let numStr = '';
  for (const seg of allSegments) {
    const d = isValidDigit(seg);
    if (d === -1) return -1;
    numStr += d;
  }
  return parseInt(numStr, 10);
}

export function countSticks(segments: boolean[] | boolean[][]): number {
  if (Array.isArray(segments[0])) {
    return (segments as boolean[][]).reduce((acc, seg) => acc + countSticks(seg as boolean[]), 0);
  }
  return (segments as boolean[]).filter(Boolean).length;
}

export function calculateMoves(source: boolean[][], target: boolean[][]): number {
  let diff = 0;
  for (let i = 0; i < source.length; i++) {
    for (let j = 0; j < source[i].length; j++) {
      if (source[i][j] !== target[i][j]) {
        diff++;
      }
    }
  }
  return diff / 2;
}

export function generateRandomNumber(): number {
  return Math.floor(Math.random() * 900) + 100;
}
