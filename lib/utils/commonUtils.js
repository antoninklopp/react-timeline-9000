'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sumStyle = sumStyle;
exports.pixToInt = pixToInt;
exports.intToPix = intToPix;
/**
 * Add int pixels to a css style (left or top generally)
 * @param  {string} style Style string in css format
 * @param  {number} diff The pixels to add/subtract
 * @returns {string} Style as string for css use
 */
function sumStyle(style, diff) {
  return intToPix(pixToInt(style) + diff);
}
/**
 * Converts a pixel string to an int
 * @param  {string} pix Pixel string
 * @return {number} Integer value of the pixel string
 */
function pixToInt(pix) {
  return parseInt(pix.replace('px', ''));
}
/**
 * Convert integer to pixel string.
 * If not an integer the input is returned as is
 * @param  {number} int Integer value
 * @returns {string} Pixel string
 */
function intToPix(int) {
  if (int === Number(int)) return int + 'px';
  return int;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jb21tb25VdGlscy5qcyJdLCJuYW1lcyI6WyJzdW1TdHlsZSIsInBpeFRvSW50IiwiaW50VG9QaXgiLCJzdHlsZSIsImRpZmYiLCJwaXgiLCJwYXJzZUludCIsInJlcGxhY2UiLCJpbnQiLCJOdW1iZXIiXSwibWFwcGluZ3MiOiI7Ozs7O1FBTWdCQSxRLEdBQUFBLFE7UUFRQUMsUSxHQUFBQSxRO1FBU0FDLFEsR0FBQUEsUTtBQXZCaEI7Ozs7OztBQU1PLFNBQVNGLFFBQVQsQ0FBa0JHLEtBQWxCLEVBQXlCQyxJQUF6QixFQUErQjtBQUNwQyxTQUFPRixTQUFTRCxTQUFTRSxLQUFULElBQWtCQyxJQUEzQixDQUFQO0FBQ0Q7QUFDRDs7Ozs7QUFLTyxTQUFTSCxRQUFULENBQWtCSSxHQUFsQixFQUF1QjtBQUM1QixTQUFPQyxTQUFTRCxJQUFJRSxPQUFKLENBQVksSUFBWixFQUFrQixFQUFsQixDQUFULENBQVA7QUFDRDtBQUNEOzs7Ozs7QUFNTyxTQUFTTCxRQUFULENBQWtCTSxHQUFsQixFQUF1QjtBQUM1QixNQUFJQSxRQUFRQyxPQUFPRCxHQUFQLENBQVosRUFBeUIsT0FBT0EsTUFBTSxJQUFiO0FBQ3pCLFNBQU9BLEdBQVA7QUFDRCIsImZpbGUiOiJjb21tb25VdGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBBZGQgaW50IHBpeGVscyB0byBhIGNzcyBzdHlsZSAobGVmdCBvciB0b3AgZ2VuZXJhbGx5KVxyXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHN0eWxlIFN0eWxlIHN0cmluZyBpbiBjc3MgZm9ybWF0XHJcbiAqIEBwYXJhbSAge251bWJlcn0gZGlmZiBUaGUgcGl4ZWxzIHRvIGFkZC9zdWJ0cmFjdFxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBTdHlsZSBhcyBzdHJpbmcgZm9yIGNzcyB1c2VcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzdW1TdHlsZShzdHlsZSwgZGlmZikge1xyXG4gIHJldHVybiBpbnRUb1BpeChwaXhUb0ludChzdHlsZSkgKyBkaWZmKTtcclxufVxyXG4vKipcclxuICogQ29udmVydHMgYSBwaXhlbCBzdHJpbmcgdG8gYW4gaW50XHJcbiAqIEBwYXJhbSAge3N0cmluZ30gcGl4IFBpeGVsIHN0cmluZ1xyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IEludGVnZXIgdmFsdWUgb2YgdGhlIHBpeGVsIHN0cmluZ1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHBpeFRvSW50KHBpeCkge1xyXG4gIHJldHVybiBwYXJzZUludChwaXgucmVwbGFjZSgncHgnLCAnJykpO1xyXG59XHJcbi8qKlxyXG4gKiBDb252ZXJ0IGludGVnZXIgdG8gcGl4ZWwgc3RyaW5nLlxyXG4gKiBJZiBub3QgYW4gaW50ZWdlciB0aGUgaW5wdXQgaXMgcmV0dXJuZWQgYXMgaXNcclxuICogQHBhcmFtICB7bnVtYmVyfSBpbnQgSW50ZWdlciB2YWx1ZVxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBQaXhlbCBzdHJpbmdcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpbnRUb1BpeChpbnQpIHtcclxuICBpZiAoaW50ID09PSBOdW1iZXIoaW50KSkgcmV0dXJuIGludCArICdweCc7XHJcbiAgcmV0dXJuIGludDtcclxufVxyXG4iXX0=