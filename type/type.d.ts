export type FeatureInfo = {
  icon: React.ReactNode; // The type for a JSX element
  label: string;
  title: string;
  description: string;
};

type StatData = {
  stat_label: string;
  value: string;
  description: string;
};

declare interface IQuestion {
  _id: string;
  questionText: string;
  options: string[];
  // correctAnswer: string;
  correctAnswerIndex: number;
}

declare interface IQuiz {
  _id: string;
  title: string;
  description: string;
  topic: string;
  passMark: number;
  questions: IQuestion[];
  createdAt: string;
}
