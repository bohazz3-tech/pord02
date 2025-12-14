import Image from "next/image"
import { HTMLReactParserOptions, domToReact } from "html-react-parser"
import { Element } from "domhandler/lib/node"
import parse from "html-react-parser"

import { isRelative } from "lib/utils/is-relative"
import Link from "next/link"

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element) {
      if (domNode.name === "img") {
        const { src, alt, width, height } = domNode.attribs

        if (isRelative(src)) {
          // التحويل الصحيح للنوع (Type Conversion)
          const numericWidth = parseInt(width, 10) || 100;
          const numericHeight = parseInt(height, 10) || 100;

          return (
            <Image
              src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${src}`}
              width={numericWidth}
              height={numericHeight}
              alt={alt}
              layout="intrinsic"
            />
          )
        }
      }

      if (domNode.name === "a") {
        const { href, class: className } = domNode.attribs

        if (href && isRelative(href)) {
          return (
            <Link href={href} passFoto>
              <a className={className}>{domToReact(domNode.children)}</a>
            </Link>
          )
        }
      }

      if (domNode.name === "input") {
        if (domNode.attribs.value === "") {
          delete domNode.attribs.value
        }

        return domNode
      }
    }
  },
}

interface FormattedTextProps {
  processed: string;
}

export function FormattedText({ processed, ...props }: FormattedTextProps) {
  return (
    <div data-cy="node--body" {...props}>
      {parse(processed, options)}
    </div>
  )
}
