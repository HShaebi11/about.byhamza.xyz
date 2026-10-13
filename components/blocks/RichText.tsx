import React from 'react'

import type { RichTextData, SerializedLexicalNode } from '@/lib/payload/types'

const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8
const IS_CODE = 16
const IS_SUBSCRIPT = 32
const IS_SUPERSCRIPT = 64

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Node = any

function renderText(node: Node, key: React.Key): React.ReactNode {
  let element: React.ReactNode = node.text ?? null
  const format: number = node.format ?? 0

  if (format & IS_CODE) element = <code>{element}</code>
  if (format & IS_BOLD) element = <strong>{element}</strong>
  if (format & IS_ITALIC) element = <em>{element}</em>
  if (format & IS_UNDERLINE) element = <u>{element}</u>
  if (format & IS_STRIKETHROUGH) element = <s>{element}</s>
  if (format & IS_SUBSCRIPT) element = <sub>{element}</sub>
  if (format & IS_SUPERSCRIPT) element = <sup>{element}</sup>

  return <React.Fragment key={key}>{element}</React.Fragment>
}

function renderChildren(children?: SerializedLexicalNode[]): React.ReactNode {
  if (!Array.isArray(children)) return null
  return children.map((child, index) => renderNode(child, index))
}

function renderNode(node: SerializedLexicalNode, key: React.Key): React.ReactNode {
  const n = node as Node

  switch (n.type) {
    case 'text':
      return renderText(n, key)
    case 'linebreak':
      return <br key={key} />
    case 'paragraph':
      return <p key={key}>{renderChildren(n.children)}</p>
    case 'heading': {
      const tag = (n.tag as string) ?? 'h2'
      const Heading = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag) ? tag : 'h2') as
        | 'h1'
        | 'h2'
        | 'h3'
        | 'h4'
        | 'h5'
        | 'h6'
      return <Heading key={key}>{renderChildren(n.children)}</Heading>
    }
    case 'quote':
      return <blockquote key={key}>{renderChildren(n.children)}</blockquote>
    case 'list': {
      const ordered = n.listType === 'number' || n.tag === 'ol'
      return ordered ? <ol key={key}>{renderChildren(n.children)}</ol> : <ul key={key}>{renderChildren(n.children)}</ul>
    }
    case 'listitem':
      return <li key={key}>{renderChildren(n.children)}</li>
    case 'link':
    case 'autolink': {
      const url: string = n.fields?.url ?? n.url ?? '#'
      const newTab: boolean = Boolean(n.fields?.newTab)
      return (
        <a
          key={key}
          href={url}
          rel={newTab ? 'noopener noreferrer' : undefined}
          target={newTab ? '_blank' : undefined}
        >
          {renderChildren(n.children)}
        </a>
      )
    }
    case 'horizontalrule':
      return <hr key={key} />
    default:
      // Unknown node: render its children if any so content is never lost.
      return <React.Fragment key={key}>{renderChildren(n.children)}</React.Fragment>
  }
}

export default function RichText({ className, data }: { className?: string; data: RichTextData }) {
  if (!data?.root?.children?.length) return null
  return <div className={className}>{renderChildren(data.root.children)}</div>
}
