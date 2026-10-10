interface ExplanationProps {
  text: string
  source: 'claude' | 'template'
}

export function Explanation({ text, source }: ExplanationProps) {
  return (
    <div className="explanation">
      <p className="explanation-text">{text}</p>
      <span className={`explanation-source ${source}`}>
        {source === 'claude' ? 'Written by Claude' : 'Template text'}
      </span>
    </div>
  )
}

export default Explanation