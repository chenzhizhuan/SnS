type PdfTextLayerStyle = Pick<CSSStyleDeclaration, 'setProperty'>

export type PdfTextLayerViewportScale = {
  scale: number
  userUnit: number
}

/**
 * pdf.js positions TextLayer spans with CSS calculations based on these
 * variables. Without them, the inline font-size/width declarations are
 * invalid and the invisible selection layer no longer matches the canvas.
 */
export function applyPdfTextLayerScale(
  style: PdfTextLayerStyle,
  viewport: PdfTextLayerViewportScale
): void {
  style.setProperty('--scale-factor', String(viewport.scale))
  style.setProperty('--user-unit', String(viewport.userUnit))
  style.setProperty('--total-scale-factor', String(viewport.scale * viewport.userUnit))
  style.setProperty('--scale-round-x', '1px')
  style.setProperty('--scale-round-y', '1px')
}
