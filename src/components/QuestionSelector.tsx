import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getQuestionsList } from "@/lib/questions";

interface QuestionSelectorProps {
  selectedQuestionUid?: string;
  onQuestionSelect: (uid: string) => void;
}

export function QuestionSelector({ selectedQuestionUid, onQuestionSelect }: QuestionSelectorProps) {
  const questions = getQuestionsList();

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return "text-green-600 dark:text-green-400";
    if (difficulty <= 3) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getDifficultyText = (difficulty: number) => {
    if (difficulty === 1) return "Very Easy";
    if (difficulty === 2) return "Easy";
    if (difficulty === 3) return "Medium";
    if (difficulty === 4) return "Hard";
    if (difficulty === 5) return "Very Hard";
    return "Unknown";
  };

  const selectedQuestion = questions.find(q => q.uid === selectedQuestionUid);

  return (
    <div className="w-full max-w-md">
      <Select value={selectedQuestionUid} onValueChange={onQuestionSelect}>
        <SelectTrigger className="w-full h-12">
          <SelectValue placeholder="Select a question...">
            {selectedQuestion && (
              <div className="flex flex-col items-start gap-1 text-left">
                <div className="font-medium text-sm truncate w-full">
                  {selectedQuestion.name}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-0.5 bg-secondary rounded-sm">
                    {selectedQuestion.category}
                  </span>
                  <span className={`font-medium ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                    {getDifficultyText(selectedQuestion.difficulty)}
                  </span>
                </div>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-96 w-full">
          {questions.map((question) => (
            <SelectItem key={question.uid} value={question.uid} className="py-3">
              <div className="flex flex-col items-start gap-1.5 w-full">
                <div className="font-medium text-sm leading-tight">
                  {question.name}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-1 bg-secondary rounded-sm">
                    {question.category}
                  </span>
                  <span className={`font-medium ${getDifficultyColor(question.difficulty)}`}>
                    {getDifficultyText(question.difficulty)}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}