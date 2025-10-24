export interface InterviewQuestion {
  id: number;
  question: string;
  timeAppear: number; // seconds after start
}

export const interviewQuestions = {
  easy: [
    {
      id: 1,
      question: "Tell me about yourself and your background.",
      timeAppear: 5
    },
    {
      id: 2,
      question: "Why are you interested in this position?",
      timeAppear: 20
    },
    {
      id: 3,
      question: "What are your greatest strengths?",
      timeAppear: 35
    },
    {
      id: 4,
      question: "Thank you for your time. Do you have any questions for me?",
      timeAppear: 50
    }
  ],
  medium: [
    {
      id: 1,
      question: "Describe a challenging project you worked on and how you handled it.",
      timeAppear: 5
    },
    {
      id: 2,
      question: "How do you prioritize tasks when working on multiple projects?",
      timeAppear: 20
    },
    {
      id: 3,
      question: "Tell me about a time you had to work with a difficult team member.",
      timeAppear: 35
    },
    {
      id: 4,
      question: "That's all for today. Do you have any final thoughts or questions?",
      timeAppear: 50
    }
  ],
  hard: [
    {
      id: 1,
      question: "Describe a situation where you had to make a critical decision with incomplete information.",
      timeAppear: 5
    },
    {
      id: 2,
      question: "How would you approach solving a complex technical problem that your team has never encountered before?",
      timeAppear: 20
    },
    {
      id: 3,
      question: "Tell me about a time when you failed. What did you learn and how did you apply it?",
      timeAppear: 35
    },
    {
      id: 4,
      question: "Thank you. Any questions about our company culture or the role?",
      timeAppear: 50
    }
  ]
};
