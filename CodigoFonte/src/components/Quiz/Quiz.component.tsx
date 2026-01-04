'use client';

import { FunctionComponent, useState } from 'react';
import { QuizProps, QuizQuestion, QuizActivity } from './Quiz.interface';
import { QuizQuestionStep } from './components/QuizQuestionStep';
import { QuizSubjectiveQuestionStep } from './components/QuizSubjectiveQuestionStep';
import { QuizFeedbackStep } from './components/QuizFeedbackStep';
import { QuizActivityStep } from './components/QuizActivityStep';
import { QuizActivityFeedbackStep } from './components/QuizActivityFeedbackStep';
import { QuizSubjectiveFeedbackStep } from './components/QuizSubjectiveFeedbackStep';
import { QuizCompletionStep } from './components/QuizCompletionStep';
import { QuizSuccessStep, QuizAnswer } from './components/QuizSuccessStep';

// Dados mockados do quiz - em produção viriam de uma API
const mockQuestions: QuizQuestion[] = [
	{
		id: 1,
		question: 'Qual é uma vantagem de divulgar seu negócio nas redes sociais?',
		type: 'multiple-choice',
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
	{
		id: 2,
		question: 'Qual é uma vantagem de divulgar seu negócio nas redes sociais?',
		type: 'multiple-choice',
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
	{
		id: 3,
		question: 'Conte em poucas palavras como você divulga hoje o seu trabalho ou serviço para outras pessoas.',
		type: 'subjective',
		instruction: 'Não precisa escrever muito, pode ser só 2 ou 3 frases contando como você faz hoje para que mais pessoas conheçam seu trabalho.',
	},
	{
		id: 4,
		question: 'Orçamento pessoal: equilibrando receitas e despesas',
		type: 'subjective',
		instruction: 'Envie arquivos relacionados ao orçamento pessoal.',
	},
	// Adicione mais perguntas aqui conforme necessário
];

export const Quiz: FunctionComponent<QuizProps> = ({
	totalQuestions: externalTotalQuestions,
	currentQuestion: initialQuestion = 1,
	activities = [],
	onAnswerSelect: externalOnAnswerSelect,
	onActivitySubmit: externalOnActivitySubmit,
	onNext,
	onPrevious,
}) => {
	// Usa o tamanho do array de perguntas como totalQuestions padrão
	const totalQuestions = externalTotalQuestions || mockQuestions.length;
	const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
	const [selectedAnswers, setSelectedAnswers] = useState<{
		[questionId: number]: string;
	}>({});
	const [subjectiveAnswers, setSubjectiveAnswers] = useState<{
		[questionId: number]: string;
	}>({});
	const [subjectiveAudios, setSubjectiveAudios] = useState<{
		[questionId: number]: Blob[];
	}>({});
	const [showFeedback, setShowFeedback] = useState<{
		[questionId: number]: boolean;
	}>({});
	const [submittedActivities, setSubmittedActivities] = useState<{
		[activityId: number]: boolean;
	}>({});
	const [activityFiles, setActivityFiles] = useState<{
		[activityId: number]: File[];
	}>({});
	const [showActivityFeedback, setShowActivityFeedback] = useState<{
		[activityId: number]: boolean;
	}>({});

	const [showCompletion, setShowCompletion] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

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

	const handleAnswerChange = (answer: string) => {
		const questionId = currentQuestion;
		setSubjectiveAnswers((prev) => ({
			...prev,
			[questionId]: answer,
		}));
	};

	const handleAudioChange = (audioBlobs: Blob[]) => {
		const questionId = currentQuestion;
		setSubjectiveAudios((prev) => ({
			...prev,
			[questionId]: audioBlobs,
		}));
	};

	const handleConfirmAnswer = () => {
		const questionId = currentQuestion;
		const currentQuestionData = mockQuestions.find((q) => q.id === questionId) || mockQuestions[0];
		
		// Para perguntas subjetivas, usa subjectiveAnswers
		if (currentQuestionData.type === 'subjective') {
			console.log('Resposta subjetiva confirmada:', subjectiveAnswers[questionId]);
			// Aqui você pode adicionar lógica para processar a resposta subjetiva
			// Por exemplo, enviar para API, etc.
		} else {
			console.log('Resposta confirmada:', selectedAnswers[questionId]);
		}
		
		// Mostra o feedback para a pergunta atual
		setShowFeedback((prev) => ({
			...prev,
			[questionId]: true,
		}));
	};

	const handleNextFromFeedback = () => {
		try {
			// Limpa o feedback da pergunta atual
			setShowFeedback((prev) => {
				const newState = { ...prev };
				delete newState[currentQuestion];
				return newState;
			});
			
			// Vai para a próxima pergunta
			const nextQuestion = currentQuestion + 1;
			// Valida se a próxima pergunta existe no array
			if (nextQuestion <= mockQuestions.length && nextQuestion <= totalQuestions) {
				setCurrentQuestion(nextQuestion);
				if (onNext) {
					onNext();
				}
			} else {
				// Se não há mais perguntas, mostra a tela de conclusão
				setShowCompletion(true);
			}
		} catch (error) {
			console.error('Erro ao navegar para próxima pergunta:', error);
		}
	};
		
	// Função temporária para visualizar a tela de conclusão
	const handleShowCompletion = () => {
		setShowCompletion(true);
	};

	const handleActivitySubmit = (files: File[]) => {
		// Busca a atividade atual
		const currentActivity = activities.find((a) => a.id === currentQuestion);
		if (currentActivity) {
			setSubmittedActivities((prev) => ({
				...prev,
				[currentActivity.id]: true,
			}));
			setActivityFiles((prev) => ({
				...prev,
				[currentActivity.id]: files,
			}));
			setShowActivityFeedback((prev) => ({
				...prev,
				[currentActivity.id]: true,
			}));

			if (externalOnActivitySubmit) {
				externalOnActivitySubmit(currentActivity.id, files);
			}
		}
	};

	const handleActivityFeedbackNext = () => {
		// Limpa o feedback e vai para a próxima etapa
		const currentActivity = activities.find((a) => a.id === currentQuestion);
		if (currentActivity) {
			setShowActivityFeedback((prev) => ({
				...prev,
				[currentActivity.id]: false,
			}));
		}
		
		// Verifica se é a última questão e se todas foram respondidas
		if (currentQuestion >= totalQuestions) {
			// Verifica se todas as questões foram respondidas
			const allQuestionsAnswered = Array.from({ length: totalQuestions }, (_, i) => {
				const questionNum = i + 1;
				const activity = activities.find((a) => a.id === questionNum);
				if (activity) {
					// Para atividades, verifica se foram enviados arquivos
					return submittedActivities[activity.id] && (activityFiles[activity.id]?.length || 0) > 0;
				} else {
					// Para perguntas, verifica se foi selecionada uma resposta
					return !!selectedAnswers[questionNum];
				}
			}).every(Boolean);
			
			if (allQuestionsAnswered) {
				setShowSuccess(true);
			} else {
				// Se não completou todas, volta para a primeira não respondida
				for (let i = 1; i <= totalQuestions; i++) {
					const activity = activities.find((a) => a.id === i);
					if (activity) {
						if (!submittedActivities[activity.id] || (activityFiles[activity.id]?.length || 0) === 0) {
							setCurrentQuestion(i);
							return;
						}
					} else {
						if (!selectedAnswers[i]) {
							setCurrentQuestion(i);
							return;
						}
					}
				}
			}
		} else {
			handleNext();
		}
	};

	const handleActivityNext = () => {
		// Avança para próxima etapa após enviar atividade
		handleNext();
	};

	// Verifica se a etapa atual é uma atividade
	const currentActivity = activities.find((a) => a.id === currentQuestion);
	const isActivityStep = !!currentActivity;

	// Busca a pergunta atual (por enquanto usa mock)
	// Usa o índice do array (currentQuestion - 1) para garantir que sempre encontre a pergunta correta
	// Valida se o índice está dentro do range do array
	const questionIndex = currentQuestion - 1;
	const currentQuestionData = 
		questionIndex >= 0 && questionIndex < mockQuestions.length 
			? mockQuestions[questionIndex] 
			: mockQuestions[0];

	// Verifica se deve mostrar feedback ou a pergunta/atividade
	const isShowingFeedback = showFeedback[currentQuestion];
	const isShowingActivityFeedback = currentActivity ? showActivityFeedback[currentActivity.id] : false;
	// Verifica se deve mostrar feedback ou a pergunta

	// Verifica se é pergunta subjetiva (só se tiver currentQuestionData)
	const isSubjective = currentQuestionData?.type === 'subjective' || false;

	// Determina a resposta correta (em produção viria de uma API)
	// Só define correctAnswerId se a pergunta for de múltipla escolha
	const correctAnswerId = !isSubjective && currentQuestionData.options 
		? currentQuestionData.options[0]?.id || 'option1' 
		: undefined;
	
	// Verifica se a resposta selecionada está correta (apenas para múltipla escolha)
	const isCorrect = !isSubjective && correctAnswerId 
		? selectedAnswers[currentQuestion] === correctAnswerId 
		: false;
	
	// Dados mockados do feedback - em produção viriam de uma API
	// Só cria feedbackData se não for pergunta subjetiva
	const feedbackData = !isSubjective ? {
		points: isCorrect ? 2 : 0,
		explanation: isCorrect 
			? 'Usar as redes sociais ajuda seu negócio a alcançar mais pessoas e pode aumentar suas vendas.'
			: 'Divulgar seu negócio nas redes sociais é importante porque ajuda você a alcançar mais pessoas sem gastar muito.',
		video: undefined,
		// video: {
		// 	thumbnail: 'https://via.placeholder.com/400x225/6B46C1/FFFFFF?text=Video+Thumbnail',
		// 	url: 'https://example.com/video.mp4',
		// 	title: 'Vídeo sobre redes sociais',
		// },
	} : {
		points: 0,
		explanation: '',
		video: undefined,
	};

	// Prepara as respostas para a tela de sucesso
	const prepareAnswers = (): QuizAnswer[] => {
		const answers: QuizAnswer[] = [];
		
		// Itera sobre todas as questões
		for (let i = 1; i <= totalQuestions; i++) {
			const activity = activities.find((a) => a.id === i);
			const questionData = mockQuestions.find((q) => q.id === i) || mockQuestions[0];
			const selectedAnswerId = selectedAnswers[i];
			
			if (activity) {
				// É uma atividade
				answers.push({
					id: i,
					question: activity.activityTitle,
					type: 'activity',
					activityFiles: activityFiles[activity.id]?.length || 0,
				});
			} else if (questionData) {
				// É uma pergunta
				const selectedAnswer = questionData.options?.find((opt) => opt.id === selectedAnswerId);
				const isCorrectAnswer = selectedAnswerId === 'option1'; // Mock: option1 é sempre correta
				const correctAnswer = questionData.options?.find((opt) => opt.id === 'option1');
				
				// Verifica se é pergunta de texto (mock: questão 3)
				if (i === 3) {
					answers.push({
						id: i,
						question: 'Conte em poucas palavras como você divulga hoje o seu trabalho ou serviço para outras pessoas.',
						type: 'text',
						textAnswer: 'Eu mando mensagem no WhatsApp pros meus clientes quando tenho bolo novo e posto foto no meu Facebook pra mostrar os bolos que faço.',
						audioFiles: [
							{ url: '/audio/audio1.mp3', duration: '0:35' },
							{ url: '/audio/audio2.mp3', duration: '0:25' },
						],
					});
				} else {
					// Pergunta de múltipla escolha
					answers.push({
						id: i,
						question: questionData.question,
						type: 'multiple-choice',
						isCorrect: isCorrectAnswer,
						selectedAnswer: selectedAnswer?.text || '',
						correctAnswer: !isCorrectAnswer ? correctAnswer?.text : undefined,
					});
				}
			}
		}
		
		return answers;
	};

	return (
		<div className='w-full'>
			{showSuccess ? (
				<QuizSuccessStep answers={prepareAnswers()} quizTitle='Quiz Encontro 03' />
			) : isShowingFeedback ? (
				<QuizFeedbackStep
					question={currentQuestionData}
					currentQuestion={currentQuestion}
					totalQuestions={totalQuestions}
					selectedAnswerId={selectedAnswers[currentQuestion]}
					points={feedbackData.points}
					feedbackExplanation={feedbackData.explanation}
					isCorrect={isCorrect}
					correctAnswerId={correctAnswerId}
					video={feedbackData.video}
					onNext={handleNextFromFeedback}
				/>
			) : isShowingActivityFeedback && currentActivity ? (
				<QuizActivityFeedbackStep
					currentQuestion={currentQuestion}
					totalQuestions={totalQuestions}
					activityTitle={currentActivity.activityTitle}
					activityDescription={currentActivity.activityDescription}
					feedbackText='Organizar o que você ganha e o que gasta ajuda a entender melhor seu dinheiro. Assim, você consegue se planejar, evitar dívidas e dar passos mais seguros no seu negócio e na sua vida.'
					submittedFiles={activityFiles[currentActivity.id] || []}
					video={currentActivity.video}
					onNext={handleActivityFeedbackNext}
				/>
			) : isActivityStep && currentActivity ? (
				<QuizActivityStep
					currentQuestion={currentQuestion}
					totalQuestions={totalQuestions}
					activityTitle={currentActivity.activityTitle}
					activityDescription={currentActivity.activityDescription}
					suggestionLabel={currentActivity.suggestionLabel}
					downloadButtonText={currentActivity.downloadButtonText}
					downloadUrl={currentActivity.downloadUrl}
					onSubmit={handleActivitySubmit}
					onNext={handleActivityNext}
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

