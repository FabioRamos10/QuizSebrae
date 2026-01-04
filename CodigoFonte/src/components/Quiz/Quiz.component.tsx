'use client';

import { FunctionComponent, useState } from 'react';
import { QuizProps, QuizQuestion, QuizAnswer } from './Quiz.interface';
import { QuizQuestionStep } from './components/QuizQuestionStep';
import { QuizSubjectiveQuestionStep } from './components/QuizSubjectiveQuestionStep';
import { QuizFeedbackStep } from './components/QuizFeedbackStep';
import { QuizSubjectiveFeedbackStep } from './components/QuizSubjectiveFeedbackStep';
import { QuizCompletionStep } from './components/QuizCompletionStep';

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
	onAnswerSelect: externalOnAnswerSelect,
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
	const [showCompletion, setShowCompletion] = useState(false);

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

	// Busca a pergunta atual (por enquanto usa mock)
	// Usa o índice do array (currentQuestion - 1) para garantir que sempre encontre a pergunta correta
	// Valida se o índice está dentro do range do array
	const questionIndex = currentQuestion - 1;
	const currentQuestionData = 
		questionIndex >= 0 && questionIndex < mockQuestions.length 
			? mockQuestions[questionIndex] 
			: mockQuestions[0];

	// Verifica se deve mostrar feedback ou a pergunta
	const isShowingFeedback = showFeedback[currentQuestion] || false;

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
		// video: {
		// 	thumbnail: 'https://via.placeholder.com/400x225/6B46C1/FFFFFF?text=Video+Thumbnail',
		// 	url: 'https://example.com/video.mp4',
		// 	title: 'Vídeo sobre redes sociais',
		// },
	} : {
		points: 0,
		explanation: '',
	};

	// Feedback específico para perguntas subjetivas
	const subjectiveFeedbackData = {
		explanation: 'Divulgar seu trabalho é importante para mais pessoas conhecerem o que você faz. Continue divulgando seu trabalho e/ou serviço para outras pessoas nas suas redes sociais.',
		// video: {
		// 	thumbnail: 'https://via.placeholder.com/400x225/6B46C1/FFFFFF?text=Video+Thumbnail',
		// 	url: 'https://example.com/video.mp4',
		// 	title: 'Vídeo sobre divulgação',
		// },
	};

	const selectedAnswerId = selectedAnswers[currentQuestion] || '';
	const subjectiveAnswer = subjectiveAnswers[currentQuestion] || '';

	// Prepara dados das respostas para a tela de conclusão
	const prepareCompletionAnswers = (): QuizAnswer[] => {
		return mockQuestions.map((question, index) => {
			const questionId = question.id || index + 1;
			const isSubjective = question.type === 'subjective';
			
			if (isSubjective) {
				// Para questões subjetivas, usa dados reais ou mockados
				let mockAnswer = '';
				if (questionId === 3) {
					mockAnswer = 'Eu mando mensagem no WhatsApp pros meus clientes quando tenho bolo novo e posto Foto no meu Facebook pra mostrar os bolos que faço.';
				}
				
				return {
					questionId,
					question,
					subjectiveAnswer: subjectiveAnswers[questionId] || mockAnswer || 'Resposta de exemplo para questões subjetivas',
					audioBlobs: subjectiveAudios[questionId] || [],
				};
			} else {
				// Para questões objetivas, simula respostas corretas e incorretas
				const correctAnswerId = question.options?.[0]?.id || 'option1';
				let selectedOptionId = selectedAnswers[questionId];
				
				// Se não houver resposta selecionada, usa mock: primeira correta, segunda incorreta
				if (!selectedOptionId) {
					selectedOptionId = questionId === 1 ? correctAnswerId : 'option2';
				}
				
				const isCorrect = selectedOptionId === correctAnswerId;
				
				return {
					questionId,
					question,
					selectedOptionId,
					isCorrect,
					correctAnswerId: isCorrect ? undefined : correctAnswerId,
				};
			}
		});
	};

	// Validação: garantir que temos uma pergunta válida
	if (!currentQuestionData && !showCompletion) {
		return (
			<div className='w-full p-4 text-center'>
				<p className='text-[#6E707A]'>Pergunta não encontrada.</p>
			</div>
		);
	}

	// Se está na tela de conclusão, mostra ela
	if (showCompletion) {
		return (
			<div className='w-full max-w-full overflow-x-hidden box-border'>
				<QuizCompletionStep answers={prepareCompletionAnswers()} />
			</div>
		);
	}

	// Renderização com tratamento de erro
	try {
		return (
			<div className='w-full max-w-full overflow-x-hidden box-border'>
				{/* Botão temporário para visualizar tela de conclusão - remover em produção */}
				<div className='mb-4 flex justify-end'>
					<button
						onClick={handleShowCompletion}
						className='bg-[#FF6F61] hover:bg-[#FF5A4A] text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors'>
						[DEV] Ver Tela Final
					</button>
				</div>
				{isShowingFeedback ? (
					isSubjective ? (
						<QuizSubjectiveFeedbackStep
							question={currentQuestionData}
							currentQuestion={currentQuestion}
							totalQuestions={totalQuestions}
							userAnswer={subjectiveAnswer}
							audioBlobs={subjectiveAudios[currentQuestion] || []}
							feedbackExplanation={subjectiveFeedbackData.explanation}
							video={undefined}
							onNext={handleNextFromFeedback}
						/>
					) : currentQuestionData.options && currentQuestionData.options.length > 0 ? (
						<QuizFeedbackStep
							question={currentQuestionData}
							currentQuestion={currentQuestion}
							totalQuestions={totalQuestions}
							selectedAnswerId={selectedAnswerId}
							points={feedbackData.points}
							feedbackExplanation={feedbackData.explanation}
							isCorrect={isCorrect}
							correctAnswerId={correctAnswerId}
							video={undefined}
							onNext={handleNextFromFeedback}
						/>
					) : (
						<div className='w-full p-4 text-center'>
							<p className='text-[#6E707A]'>Erro ao carregar feedback. Por favor, tente novamente.</p>
						</div>
					)
				) : isSubjective ? (
				<QuizSubjectiveQuestionStep
					question={currentQuestionData}
					currentQuestion={currentQuestion}
					totalQuestions={totalQuestions}
					answer={subjectiveAnswers[currentQuestion]}
					audioBlobs={subjectiveAudios[currentQuestion] || []}
					onAnswerChange={handleAnswerChange}
					onAudioChange={handleAudioChange}
					onConfirmAnswer={handleConfirmAnswer}
				/>
				) : currentQuestionData.options && currentQuestionData.options.length > 0 ? (
					<QuizQuestionStep
						question={currentQuestionData}
						currentQuestion={currentQuestion}
						totalQuestions={totalQuestions}
						selectedAnswer={selectedAnswerId || undefined}
						onAnswerSelect={handleAnswerSelect}
						onConfirmAnswer={handleConfirmAnswer}
					/>
				) : (
					<div className='w-full p-4 text-center'>
						<p className='text-[#6E707A]'>Erro ao carregar pergunta. Por favor, tente novamente.</p>
					</div>
				)}
			</div>
		);
	} catch (error) {
		console.error('Erro ao renderizar quiz:', error);
		return (
			<div className='w-full p-4 text-center'>
				<p className='text-[#FF6F61]'>Ocorreu um erro ao carregar o quiz. Por favor, recarregue a página.</p>
			</div>
		);
	}
};

