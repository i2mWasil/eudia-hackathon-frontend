import { parseMarkdownDiff } from "@/lib/markdown-parser"
import { DiffBlock } from "./DiffBlock"
import { UnderstandingBlock } from "./UnderstandingBlock"

interface EulaComparisonProps {
  content: string
}

export function EulaComparison({ content }: EulaComparisonProps) {
  const sections = parseMarkdownDiff(content)

  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        if (section.type === 'understanding') {
          return <UnderstandingBlock key={index} content={section.content} />
        }
        return <DiffBlock key={index} content={section.content} />
      })}
    </div>
  )
}
