import React from 'react';

interface ParseContentProps {
  code: string;
}

export const codeToTextParser: React.FC<ParseContentProps> = ({ code }) => {
  const parseContentFunction = (code: string) => {
    const boldRegex = /<strong>(.*?)<\/strong>/g;
    const lines = code.split('<br />');
    const parsed = lines.map((line, index) => {
      let currentIndex = 0;
      const elements = [];
      let match = boldRegex.exec(line);
      while (match !== null) {
        const before = line.slice(currentIndex, match.index);
        if (before) {
          elements.push(before);
        }
        const text = match[1];
        elements.push(<strong key={index}>{text}</strong>);
        currentIndex = match.index + match[0].length;
        match = boldRegex.exec(line);
      }
      const remaining = line.slice(currentIndex);
      if (remaining) {
        elements.push(remaining);
      }
      return (
        <React.Fragment key={index}>
          {elements}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
    return parsed;
  };

  return <>{parseContentFunction(code)}</>;
};

export default codeToTextParser;