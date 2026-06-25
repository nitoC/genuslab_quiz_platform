import QuizOptions from "./QuizOptions";

interface Props {
  question: QuizQuestion;
  selectedAnswer?: string;
  onSelect: (value: string) => void;
}

export default function QuizQuestion({
  question,
  selectedAnswer,
  onSelect,
}: Props) {
  return (
    <>
      <h1>{question.questionText}</h1>

      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option: string, index: number) => (
          <QuizOptions
            key={option}
            index={index}
            label={option}
            selected={selectedAnswer === option}
            handleSelect={onSelect}
          />
        ))}
      </div>
    </>
  );
}
