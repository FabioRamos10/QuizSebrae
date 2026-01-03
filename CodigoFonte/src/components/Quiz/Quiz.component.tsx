'use client';

import { FunctionComponent, useState } from 'react';
import { QuizProps, QuizQuestion } from './Quiz.interface';
import { QuizQuestionStep } from './components/QuizQuestionStep';
import { QuizFeedbackStep } from './components/QuizFeedbackStep';

// Dados mockados do quiz - em produção viriam de uma API
const mockQuestions: QuizQuestion[] = [
	{
		id: 1,
		question: 'Qual é uma vantagem de divulgar seu negócio nas redes sociais?',
		options: [
			{
				id: 'option1',
				text: 'Você alcança mais pessoas sem gastar muito.',
			},
			{
				id: 'option2',
				text: 'Você precisa pagar muito para ser visto.',
			},
			{
				id: 'option3',
				text: 'Não ajuda em nada no seu negócio.',
			},
		],
	},
	// Adicione mais perguntas aqui conforme necessário
];

/**
 * **Quiz**
 *
 * Componente principal do wizard de quiz.
 * Gerencia o estado das perguntas, respostas selecionadas e navegação entre etapas.
 *
 * @component
 */
export const Quiz: FunctionComponent<QuizProps> = ({
	totalQuestions = 5,
	currentQuestion: initialQuestion = 1,
	onAnswerSelect: externalOnAnswerSelect,
	onNext,
	onPrevious,
}) => {
	const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
	const [selectedAnswers, setSelectedAnswers] = useState<{
		[questionId: number]: string;
	}>({});
	const [showFeedback, setShowFeedback] = useState<{
		[questionId: number]: boolean;
	}>({});

	const handleAnswerSelect = (optionId: string) => {
		const questionId = currentQuestion;
		setSelectedAnswers((prev) => ({
			...prev,
			[questionId]: optionId,
		}));

		if (externalOnAnswerSelect) {
			externalOnAnswerSelect(questionId, optionId);
		}
	};

	const handleNext = () => {
		if (currentQuestion < totalQuestions) {
			setCurrentQuestion((prev) => prev + 1);
			if (onNext) {
				onNext();
			}
		}
	};

	const handlePrevious = () => {
		if (currentQuestion > 1) {
			setCurrentQuestion((prev) => prev - 1);
			if (onPrevious) {
				onPrevious();
			}
		}
	};

	const handleConfirmAnswer = () => {
		// Aqui você pode adicionar lógica para processar a resposta
		// Por exemplo, validar, enviar para API, etc.
		console.log('Resposta confirmada:', selectedAnswers[currentQuestion]);
		
		// Mostra o feedback para a pergunta atual
		setShowFeedback((prev) => ({
			...prev,
			[currentQuestion]: true,
		}));
	};

	const handleNextFromFeedback = () => {
		// Limpa o feedback e vai para a próxima pergunta
		setShowFeedback((prev) => ({
			...prev,
			[currentQuestion]: false,
		}));
		handleNext();
	};

	// Busca a pergunta atual (por enquanto usa mock)
	const currentQuestionData =
		mockQuestions.find((q) => q.id === currentQuestion) || mockQuestions[0];

	// Verifica se deve mostrar feedback ou a pergunta
	const isShowingFeedback = showFeedback[currentQuestion];

	// Determina a resposta correta (em produção viria de uma API)
	const correctAnswerId = 'option1'; // Para a primeira pergunta, option1 é a correta
	
	// Verifica se a resposta selecionada está correta
	const isCorrect = selectedAnswers[currentQuestion] === correctAnswerId;
	
	// Dados mockados do feedback - em produção viriam de uma API
	const feedbackData = {
		points: isCorrect ? 2 : 0,
		explanation: isCorrect 
			? 'Usar as redes sociais ajuda seu negócio a alcançar mais pessoas e pode aumentar suas vendas.'
			: 'Divulgar seu negócio nas redes sociais é importante porque ajuda você a alcançar mais pessoas sem gastar muito.',
		//video: {
			//thumbnail: 'https://via.placeholder.com/400x225/6B46C1/FFFFFF?text=Video+Thumbnail',
			//url: 'https://example.com/video.mp4',
			//title: 'Vídeo sobre redes sociais',
		//},
	};

	return (
		<div className='w-full'>
			{isShowingFeedback ? (
				<QuizFeedbackStep
					question={currentQuestionData}
					currentQuestion={currentQuestion}
					totalQuestions={totalQuestions}
					selectedAnswerId={selectedAnswers[currentQuestion]}
					points={feedbackData.points}
					feedbackExplanation={feedbackData.explanation}
					isCorrect={isCorrect}
					correctAnswerId={correctAnswerId}
					video={undefined}
					onNext={handleNextFromFeedback}
				/>
			) : (
				<QuizQuestionStep
					question={currentQuestionData}
					currentQuestion={currentQuestion}
					totalQuestions={totalQuestions}
					selectedAnswer={selectedAnswers[currentQuestion]}
					onAnswerSelect={handleAnswerSelect}
					onConfirmAnswer={handleConfirmAnswer}
				/>
			)}
		</div>
	);
};

