/**
 * THE LAST CLUE — Procedurally Generated Mystery Investigation Game
 * Seeded Pseudo-Random Number Generator (PRNG)
 *
 * Algorithm: Mulberry32
 * - A 32-bit state generator offering fast execution, excellent statistical uniformity,
 *   and 100% deterministic reproducibility across platforms.
 * - Given the same seed, Mulberry32 will always yield the exact same sequence of pseudo-random numbers.
 */

class SeededRandom {
  /**
   * Initializes the PRNG with a seed.
   * @param {number|string} seed - Numerical or string seed.
   */
  constructor(seed = 12345) {
    this.initialSeed = seed;
    this.state = this._hashSeed(seed);
  }

  /**
   * Hashes any string or number into a 32-bit unsigned integer.
   * @param {number|string} seed - Seed value.
   * @returns {number} 32-bit integer.
   * @private
   */
  _hashSeed(seed) {
    if (typeof seed === 'number') {
      return (Math.floor(seed) >>> 0) || 12345;
    }
    const str = String(seed);
    let hash = 0x811c9dc5; // FNV-1a 32-bit offset basis
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193); // FNV prime
    }
    return hash >>> 0;
  }

  /**
   * Generates a pseudo-random floating-point number in [0, 1).
   * @returns {number} Float between 0 (inclusive) and 1 (exclusive).
   */
  next() {
    let t = (this.state += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Generates a pseudo-random integer between min and max (inclusive).
   * @param {number} min - Minimum integer.
   * @param {number} max - Maximum integer.
   * @returns {number} Integer in [min, max].
   */
  integer(min, max) {
    if (min > max) {
      [min, max] = [max, min];
    }
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Selects a random element from an array.
   * @template T
   * @param {T[]} array - The array to pick from.
   * @returns {T|null} The chosen element, or null if array is empty.
   */
  pick(array) {
    if (!Array.isArray(array) || array.length === 0) {
      return null;
    }
    const index = this.integer(0, array.length - 1);
    return array[index];
  }

  /**
   * Returns a new shuffled copy of an array using Fisher-Yates shuffle.
   * @template T
   * @param {T[]} array - Array to shuffle.
   * @returns {T[]} New shuffled array.
   */
  shuffle(array) {
    if (!Array.isArray(array)) {
      return [];
    }
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.integer(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

module.exports = SeededRandom;
