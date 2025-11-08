import { parseMarkdownLine } from "@/lib/markdown-parser"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface DiffBlockProps {
  content: string
}

export function DiffBlock({ content }: DiffBlockProps) {
  const lines = content.split('\n')

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <div className="text-sm leading-relaxed">
        {lines.map((line, index) => {
          const parsed = parseMarkdownLine(line)
          
          // Empty line
          if (line.trim() === '') {
            return (
              <div key={index} className="h-6 bg-card/50 border-l-4 border-transparent">
                <div className="px-5 py-1.5">&nbsp;</div>
              </div>
            )
          }

          // Removed line (GitHub red style)
          if (parsed.type === 'removed') {
            return (
              <div
                key={index}
                className="bg-red-50/80 dark:bg-red-950/30 border-l-4 border-red-500 dark:border-red-600 hover:bg-red-100/80 dark:hover:bg-red-950/40 transition-colors"
              >
                <div className="px-5 py-2 flex items-start gap-3">
                  <span className="text-red-600 dark:text-red-400 select-none font-semibold flex-shrink-0 pt-0.5">−</span>
                  <div className="text-red-900 dark:text-red-50 flex-1 markdown-content">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({node, ...props}) => <span {...props} className="leading-relaxed" />,
                        a: ({node, ...props}) => (
                          <a {...props} className="text-red-700 dark:text-red-300 underline decoration-red-400 dark:decoration-red-600 underline-offset-2 hover:decoration-2 transition-all" target="_blank" rel="noopener noreferrer" />
                        ),
                        strong: ({node, ...props}) => <strong {...props} className="font-bold" />,
                        em: ({node, ...props}) => <em {...props} className="italic" />,
                        code: ({node, ...props}) => <code {...props} className="bg-red-200/50 dark:bg-red-900/30 px-1.5 py-0.5 rounded text-xs font-mono" />,
                        ul: ({node, ...props}) => <ul {...props} className="list-disc ml-5 space-y-1" />,
                        li: ({node, ...props}) => <li {...props} className="leading-relaxed" />,
                      }}
                    >
                      {parsed.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )
          }

          // Added line (GitHub green style)
          if (parsed.type === 'added') {
            return (
              <div
                key={index}
                className="bg-green-50/80 dark:bg-green-950/30 border-l-4 border-green-500 dark:border-green-600 hover:bg-green-100/80 dark:hover:bg-green-950/40 transition-colors"
              >
                <div className="px-5 py-2 flex items-start gap-3">
                  <span className="text-green-600 dark:text-green-400 select-none font-semibold flex-shrink-0 pt-0.5">+</span>
                  <div className="text-green-900 dark:text-green-50 flex-1 markdown-content">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({node, ...props}) => <span {...props} className="leading-relaxed" />,
                        a: ({node, ...props}) => (
                          <a {...props} className="text-green-700 dark:text-green-300 underline decoration-green-400 dark:decoration-green-600 underline-offset-2 hover:decoration-2 transition-all" target="_blank" rel="noopener noreferrer" />
                        ),
                        strong: ({node, ...props}) => <strong {...props} className="font-bold" />,
                        em: ({node, ...props}) => <em {...props} className="italic" />,
                        code: ({node, ...props}) => <code {...props} className="bg-green-200/50 dark:bg-green-900/30 px-1.5 py-0.5 rounded text-xs font-mono" />,
                        ul: ({node, ...props}) => <ul {...props} className="list-disc ml-5 space-y-1" />,
                        li: ({node, ...props}) => <li {...props} className="leading-relaxed" />,
                      }}
                    >
                      {parsed.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )
          }

          // Code block markers (```diff, ```, etc.)
          if (line.trim().startsWith('```')) {
            return (
              <div
                key={index}
                className="bg-muted/50 border-l-4 border-muted"
              >
                <div className="px-5 py-2">
                  <span className="text-muted-foreground text-xs font-mono">{line}</span>
                </div>
              </div>
            )
          }

          // Heading
          if (parsed.type === 'heading') {
            return (
              <div
                key={index}
                className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary/60"
              >
                <div className="px-5 py-3">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({node, ...props}) => <h1 {...props} className="text-xl font-bold text-foreground m-0 tracking-tight" />,
                      h2: ({node, ...props}) => <h2 {...props} className="text-lg font-semibold text-foreground m-0 tracking-tight" />,
                      h3: ({node, ...props}) => <h3 {...props} className="text-base font-medium text-foreground m-0" />,
                      h4: ({node, ...props}) => <h4 {...props} className="text-sm font-medium text-foreground m-0" />,
                    }}
                  >
                    {line}
                  </ReactMarkdown>
                </div>
              </div>
            )
          }

          // Regular line
          return (
            <div
              key={index}
              className="bg-card/30 border-l-4 border-transparent hover:bg-muted/20 transition-colors"
            >
              <div className="px-5 py-2 markdown-content">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({node, ...props}) => <span {...props} className="text-muted-foreground leading-relaxed" />,
                    a: ({node, ...props}) => (
                      <a {...props} className="text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary hover:decoration-2 transition-all" target="_blank" rel="noopener noreferrer" />
                    ),
                    strong: ({node, ...props}) => <strong {...props} className="font-semibold text-foreground" />,
                    em: ({node, ...props}) => <em {...props} className="italic" />,
                    code: ({node, ...props}) => <code {...props} className="bg-muted/80 px-1.5 py-0.5 rounded text-xs font-mono text-foreground" />,
                    ul: ({node, ...props}) => <ul {...props} className="list-disc ml-5 space-y-1" />,
                    li: ({node, ...props}) => <li {...props} className="leading-relaxed text-muted-foreground" />,
                  }}
                >
                  {parsed.content}
                </ReactMarkdown>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

