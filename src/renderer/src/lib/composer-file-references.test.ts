import { describe, expect, it } from 'vitest'
import { imageMimeTypeForReference } from './composer-file-references'

describe('imageMimeTypeForReference', () => {
  it('maps image extensions to their MIME type', () => {
    expect(imageMimeTypeForReference({ name: 'a.png', relativePath: '', path: '', type: 'file' })).toBe('image/png')
    expect(imageMimeTypeForReference({ name: 'b.JPG', relativePath: '', path: '', type: 'file' })).toBe('image/jpeg')
    expect(imageMimeTypeForReference({ name: 'c.jpeg', relativePath: '', path: '', type: 'file' })).toBe('image/jpeg')
    expect(imageMimeTypeForReference({ name: 'd.webp', relativePath: '', path: '', type: 'file' })).toBe('image/webp')
    expect(imageMimeTypeForReference({ name: 'e.gif', relativePath: '', path: '', type: 'file' })).toBe('image/gif')
  })

  it('returns null for non-image files and directories', () => {
    expect(imageMimeTypeForReference({ name: 'notes.md', relativePath: '', path: '', type: 'file' })).toBeNull()
    expect(imageMimeTypeForReference({ name: 'archive.zip', relativePath: '', path: '', type: 'file' })).toBeNull()
    expect(imageMimeTypeForReference({ name: 'pics.png', relativePath: '', path: '', type: 'directory' })).toBeNull()
  })

  it('falls back to relativePath or absolute path when name is missing', () => {
    expect(imageMimeTypeForReference({ name: '', relativePath: 'sub/x.png', path: '', type: 'file' })).toBe('image/png')
    expect(imageMimeTypeForReference({
      name: '',
      relativePath: '',
      path: 'C:/Users/Administrator/Downloads/photo.jpeg',
      type: 'file'
    })).toBe('image/jpeg')
  })
})
