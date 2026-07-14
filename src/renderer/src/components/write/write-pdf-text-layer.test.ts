import { describe, expect, it } from 'vitest'
import { applyPdfTextLayerScale } from './write-pdf-text-layer'

function captureScaleProperties(scale: number, userUnit: number): Map<string, string> {
  const properties = new Map<string, string>()
  applyPdfTextLayerScale({
    setProperty: (name, value) => {
      properties.set(name, value ?? '')
    }
  }, { scale, userUnit })
  return properties
}

describe('Write PDF text layer', () => {
  it('matches the text layer to the regular PDF viewport scale', () => {
    expect(captureScaleProperties(1.15, 1)).toEqual(new Map([
      ['--scale-factor', '1.15'],
      ['--user-unit', '1'],
      ['--total-scale-factor', '1.15'],
      ['--scale-round-x', '1px'],
      ['--scale-round-y', '1px']
    ]))
  })

  it('includes a PDF custom user unit in the effective scale', () => {
    expect(captureScaleProperties(0.85, 2).get('--total-scale-factor')).toBe('1.7')
  })
})
