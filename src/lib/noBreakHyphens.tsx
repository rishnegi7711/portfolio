/** Wraps each hyphenated token ("full-stack", "--lock") in a nowrap span, so it never
 *  breaks at its hyphen. Stands in for the non-breaking hyphen (U+2011), which none of
 *  the site's fonts have a glyph for. */
export function noBreakHyphens(text: string) {
  // The capture group keeps the matches in the array, at the odd indexes.
  return text.split(/(\S*-\S*)/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  )
}
