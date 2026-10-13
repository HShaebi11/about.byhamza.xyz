import type { Block } from 'payload'

import { Captions } from './Captions'
import { Divider } from './Divider'
import { Gallery } from './Gallery'
import { ImageBlock } from './ImageBlock'
import { ImagePair } from './ImagePair'
import { RichTextBlock } from './RichTextBlock'
import { Video } from './Video'

/**
 * The set of building blocks available when composing a project.
 *
 * These are the only content primitives the frontend knows how to render.
 * There is no arbitrary HTML/JS block by design — content can never inject
 * code into the site, and adding a new block type is a Git-reviewed change.
 */
export const compositionBlocks: Block[] = [
  RichTextBlock,
  ImageBlock,
  ImagePair,
  Gallery,
  Video,
  Captions,
  Divider,
]
