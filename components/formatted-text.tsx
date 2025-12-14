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
          // قم بتحويل السلاسل النصية (strings) إلى أرقام (numbers) هنا
          const numericWidth = parseInt(width, 10) || 100;
          const numericHeight = parseInt(height, 10) || 100;

          // استخدم القيم الرقمية المحولة في مكون Image
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

// يبدو أن هذا التعريف (interface FormattedTextProps) هو ما يستخدم في الدالة أدناه
// تأكد من أنه معرف بشكل صحيح لاستقبال "processed"
interface FormattedTextProps {
  processed: string;
  // أضف أي props أخرى يتم تمريرها هنا إذا لزم الأمر
}


export function FormattedText({ processed, ...props }: FormattedTextProps) {
  return (
    <div data-cy="node--body" {...props}>
      {parse(processed, options)}
    </div>
  )
}
