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
        const { src, alt, width = "100px", height = "100px" } = domNode.attribs

        if (isRelative(src)) {
          return (
                         {width && height && (
               <Image
                 src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${src}`}
                 width={parseInt(width as string, 10)}
                 height={parseInt(height as string, 10)}
                 alt={alt}
                 layout="intrinsic"
               />
             )}
             <Image
               src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${src}`}
               width={width}
               height={height}
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
            <Link href={href} passHref>
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

interface FormattedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  format?: string
  processed: string
  value?: string
}

export function FormattedText({ processed, ...props }: FormattedTextProps) {
  return (
    <div data-cy="node--body" {...props}>
      {parse(processed, options)}
    </div>
  )
}
