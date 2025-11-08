import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface UnderstandingBlockProps {
  content: string
}

export function UnderstandingBlock({ content }: UnderstandingBlockProps) {
  return (
    <div className="bg-gradient-to-br from-primary/5 via-background to-background rounded-xl border-2 border-primary/20 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b-2 border-primary/20 px-6 py-4 flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="w-6 h-6 text-primary"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" 
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">AI Understanding</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Context-aware analysis of policy changes</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-7 py-6 bg-gradient-to-b from-background to-muted/10">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node, ...props}) => (
              <h1 {...props} className="text-3xl font-bold text-foreground mt-8 first:mt-0 mb-5 pb-3 border-b-2 border-primary/20" />
            ),
            h2: ({node, ...props}) => (
              <h2 {...props} className="text-2xl font-bold text-foreground mt-7 first:mt-0 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full"></span>
                <span>{props.children}</span>
              </h2>
            ),
            h3: ({node, ...props}) => (
              <h3 {...props} className="text-xl font-semibold text-foreground mt-6 first:mt-0 mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary/70 rounded-full"></span>
                <span>{props.children}</span>
              </h3>
            ),
            h4: ({node, ...props}) => (
              <h4 {...props} className="text-lg font-medium text-foreground mt-5 first:mt-0 mb-2" />
            ),
            p: ({node, ...props}) => (
              <p {...props} className="text-foreground/95 mb-4 leading-[1.8] text-[15px]" />
            ),
            ul: ({node, ...props}) => (
              <ul {...props} className="space-y-2.5 mb-5 ml-1" />
            ),
            ol: ({node, ...props}) => (
              <ol {...props} className="space-y-2.5 mb-5 ml-1" />
            ),
            li: ({node, ...props}) => (
              <li {...props} className="text-foreground/90 leading-[1.7] pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[0.7em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/60" />
            ),
            strong: ({node, ...props}) => (
              <strong {...props} className="font-bold text-foreground bg-primary/10 px-1 py-0.5 rounded" />
            ),
            em: ({node, ...props}) => (
              <em {...props} className="italic text-foreground/90 not-italic font-medium" />
            ),
            a: ({node, ...props}) => (
              <a 
                {...props} 
                className="text-primary font-medium underline decoration-primary/40 decoration-2 underline-offset-4 hover:decoration-primary hover:bg-primary/5 transition-all px-1 py-0.5 rounded" 
                target="_blank" 
                rel="noopener noreferrer" 
              />
            ),
            blockquote: ({node, ...props}) => (
              <blockquote {...props} className="border-l-4 border-primary/50 bg-primary/5 pl-6 pr-4 py-4 my-5 rounded-r-lg italic" />
            ),
            code: ({node, ...props}) => (
              <code {...props} className="bg-muted/80 border border-muted-foreground/20 px-2 py-1 rounded text-sm font-mono text-foreground shadow-sm" />
            ),
            pre: ({node, ...props}) => (
              <pre {...props} className="bg-muted border border-muted-foreground/20 p-4 rounded-lg overflow-x-auto my-5 shadow-sm" />
            ),
            hr: ({node, ...props}) => (
              <hr {...props} className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            ),
            table: ({node, ...props}) => (
              <div className="overflow-x-auto my-5">
                <table {...props} className="min-w-full border-collapse border border-border rounded-lg" />
              </div>
            ),
            th: ({node, ...props}) => (
              <th {...props} className="bg-primary/10 border border-border px-4 py-3 text-left font-semibold text-foreground" />
            ),
            td: ({node, ...props}) => (
              <td {...props} className="border border-border px-4 py-3 text-foreground/90" />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
