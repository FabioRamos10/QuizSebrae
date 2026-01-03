export interface QuizQuestion {
	id: number;
	question: string;
	options: QuizOption[];
}

export interface QuizOption {
	id: string;
	text: string;
	icon?: string;
}

export interface QuizVideo {
	thumbnail?: string;
	url?: string;
	title?: string;
}

export interface QuizProps {
	totalQuestions?: number;
	currentQuestion?: number;
	onAnswerSelect?: (questionId: number, optionId: string) => void;
	onNext?: () => void;
	onPrevious?: () => void;
}

