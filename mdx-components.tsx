import { type MDXComponents } from 'mdx/types'
import Image, { type ImageProps } from 'next/image'
import { Monitoring } from 'react-scan/dist/core/monitor/params/next'

<Monitoring apiKey="eEuHxeELyg0axtDlHCyikXzi9i83UDle" url="https://monitoring.react-scan.com/api/v1/ingest" />

export function useMDXComponents(components: MDXComponents) {
  return {
    ...components,
    Image: (props: ImageProps) => <Image {...props} />,
  }
}
