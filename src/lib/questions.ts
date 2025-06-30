interface Question {
  uid: string;
  name: string;
  category: string;
  difficulty: number;
  prompt: string;
  hints: string[];
  resources: {
    javascript: {
      startingCode: string;
      solutions: string[];
    };
  };
}

// Import all question files dynamically
const questionModules = import.meta.glob('../data/questions/*.json', { eager: true });

export const questions: Question[] = Object.values(questionModules).map((module: any) => module.default);

export const getQuestionByUid = (uid: string): Question | undefined => {
  return questions.find(question => question.uid === uid);
};

export const getQuestionsList = () => {
  return questions.map(question => ({
    uid: question.uid,
    name: question.name,
    category: question.category,
    difficulty: question.difficulty
  })).sort((a, b) => a.name.localeCompare(b.name));
};