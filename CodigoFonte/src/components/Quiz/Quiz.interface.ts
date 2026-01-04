export interface QuizQuestion {
	id: number;
	question: string;
	options?: QuizOption[];
	type?: 'multiple-choice' | 'subjective';
	instruction?: string; // Instrução adicional para perguntas subjetivas
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
	transcript?: string;
}

export interface QuizAnswer {
	questionId: number;
	question: QuizQuestion;
	selectedOptionId?: string; // Para questões objetivas
	subjectiveAnswer?: string; // Para questões subjetivas
	audioBlobs?: Blob[]; // Para questões subjetivas
	isCorrect?: boolean; // Para questões objetivas
	correctAnswerId?: string; // Para questões objetivas quando errou
}

export interface QuizActivity {
	id: number;
	activityTitle: string;
	activityDescription: string;
	suggestionLabel?: string;
	downloadButtonText?: string;
	downloadUrl?: string;
	video?: QuizVideo; // Vídeo opcional para o feedback
}

export interface QuizProps {
	totalQuestions?: number;
	currentQuestion?: number;
	activities?: QuizActivity[]; // Array de atividades (etapas com upload)
	onAnswerSelect?: (questionId: number, optionId: string) => void;
	onActivitySubmit?: (activityId: number, files: File[]) => void;
	onAnswerSubmit?: (questionId: number, answer: string) => void; // Para respostas subjetivas
	onNext?: () => void;
	onPrevious?: () => void;
}

