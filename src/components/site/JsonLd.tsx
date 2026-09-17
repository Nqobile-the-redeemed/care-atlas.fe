type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[]
}

function safeJson(data: JsonLdProps['data']) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function JsonLd({ data }: JsonLdProps) {
  return <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: safeJson(data) }} />
}
