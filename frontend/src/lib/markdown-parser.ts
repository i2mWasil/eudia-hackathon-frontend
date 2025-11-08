const DELIMITER = '$#69#$';

export interface Section {
  type: 'diff' | 'understanding';
  content: string;
}

export interface ParsedLine {
  type: 'removed' | 'added' | 'normal' | 'heading';
  content: string;
}

export function parseMarkdownDiff(markdown: string): Section[] {
  const sections: Section[] = [];
  const parts = markdown.split(DELIMITER);

  parts.forEach((part, index) => {
    const trimmedPart = part.trim();
    if (!trimmedPart) return;

    // Odd indices (1, 3, 5...) are understanding sections
    // Even indices (0, 2, 4...) are diff sections
    if (index % 2 === 1) {
      sections.push({
        type: 'understanding',
        content: trimmedPart,
      });
    } else {
      sections.push({
        type: 'diff',
        content: trimmedPart,
      });
    }
  });

  return sections;
}

export function parseMarkdownLine(line: string): ParsedLine {
  // Check for removed lines (starting with -)
  if (line.match(/^-[^-]/)) {
    return {
      type: 'removed',
      content: line.substring(1),
    };
  }

  // Check for added lines (starting with +)
  if (line.match(/^\+[^+]/)) {
    return {
      type: 'added',
      content: line.substring(1),
    };
  }

  // Check for headings
  if (line.startsWith('#')) {
    return {
      type: 'heading',
      content: line,
    };
  }

  // Normal line
  return {
    type: 'normal',
    content: line,
  };
}
