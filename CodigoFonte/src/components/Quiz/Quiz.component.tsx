'use client';

import { FunctionComponent, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { QuizProps, QuizQuestion, QuizActivity, QuizAnswer as QuizAnswerInterface } from './Quiz.interface';
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
		question: 'Conte em poucas palavras como você divulga hoje o seu trabalho ou serviço para outras pessoas.',
		type: 'subjective',
		instruction: 'Não precisa escrever muito, pode ser só 2 ou 3 frases contando como você faz hoje para que mais pessoas conheçam seu trabalho.',
	},
	{
		id: 3,
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
	encounterNumber = 3,
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
	const [activityFiles, setActivityFiles] = useState<{
		[activityId: number]: File[];
	}>({});
	const [showActivityFeedback, setShowActivityFeedback] = useState<{
		[activityId: number]: boolean;
	}>({});

	const [showCompletion, setShowCompletion] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	const router = useRouter();
	const pathname = usePathname();

	// Pula automaticamente questões subjetivas de "Orçamento pessoal" (escrita e áudio)
	// Mas mantém as atividades de upload de arquivos
	useEffect(() => {
		if (showSuccess || showCompletion) return;

		const questionData = mockQuestions.find((q) => q.id === currentQuestion) || null;
		const activity = activities.find((a) => a.id === currentQuestion);
		
		// Verifica se é questão subjetiva de "Orçamento pessoal" (não é atividade)
		const isOrcamentoSubjective = questionData?.type === 'subjective' && 
		                              questionData?.question?.includes('Orçamento pessoal') &&
		                              !activity; // Só pula se não for uma atividade (upload de arquivos)
		
		if (isOrcamentoSubjective && currentQuestion <= totalQuestions) {
			// Pula automaticamente para a próxima questão válida
			let foundNext = false;
			for (let i = currentQuestion + 1; i <= totalQuestions; i++) {
				const nextQuestionData = mockQuestions.find((q) => q.id === i);
				const nextActivity = activities.find((a) => a.id === i);
				// Se encontrou uma questão ou atividade válida, vai para ela
				if (nextQuestionData || nextActivity) {
					setCurrentQuestion(i);
					foundNext = true;
					break;
				}
			}
			// Se não encontrou próxima questão válida, finaliza o quiz
			if (!foundNext) {
				setShowSuccess(true);
			}
		}
	}, [currentQuestion, totalQuestions, showSuccess, showCompletion, activities]);

	// Funções de navegação entre encontros
	const handlePreviousEncounter = (e?: React.MouseEvent) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		
		if (!pathname) return;
		
		// Extrai o número do encontro atual do pathname (ex: /quiz/encontro-03 -> 03)
		const match = pathname.match(/encontro-(\d+)/i);
		if (match) {
			const currentEncounter = parseInt(match[1], 10);
			if (currentEncounter > 1) {
				const previousEncounter = currentEncounter - 1;
				const newPath = `/quiz/encontro-${String(previousEncounter).padStart(2, '0')}`;
				router.push(newPath);
			}
		} else {
			// Se não houver padrão no pathname, navega para encontro anterior assumindo que estamos no encontro 3
			router.push('/quiz/encontro-02');
		}
	};

	const handleNextEncounter = (e?: React.MouseEvent) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		
		if (!pathname) return;
		
		// Extrai o número do encontro atual do pathname (ex: /quiz/encontro-03 -> 03)
		const match = pathname.match(/encontro-(\d+)/i);
		if (match) {
			const currentEncounter = parseInt(match[1], 10);
			const nextEncounter = currentEncounter + 1;
			const newPath = `/quiz/encontro-${String(nextEncounter).padStart(2, '0')}`;
			router.push(newPath);
		} else {
			// Se não houver padrão no pathname, navega para próximo encontro assumindo que estamos no encontro 3
			router.push('/quiz/encontro-04');
		}
	};

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
			// Busca a próxima questão que existe no array
			let foundNext = false;
			for (let i = nextQuestion; i <= totalQuestions; i++) {
				const nextQuestionData = mockQuestions.find((q) => q.id === i);
				const nextActivity = activities.find((a) => a.id === i);
				// Se encontrou uma questão ou atividade válida, vai para ela
				if (nextQuestionData || nextActivity) {
					setCurrentQuestion(i);
					if (onNext) {
						onNext();
					}
					foundNext = true;
					break;
				}
			}
			// Se não encontrou próxima questão válida, mostra a tela de conclusão
			if (!foundNext) {
				setShowCompletion(true);
			}
		} catch (error) {
			console.error('Erro ao navegar para próxima pergunta:', error);
		}
	};

	const handleActivitySubmit = (files: File[]) => {
		// Busca a atividade atual
		const currentActivity = activities.find((a) => a.id === currentQuestion);
		const currentQuestionData = mockQuestions.find((q) => q.id === currentQuestion);
		
		// Verifica se é "Orçamento pessoal" - salva com o ID da questão também
		const isOrcamentoPessoal = currentQuestionData?.question.includes('Orçamento pessoal');
		
		if (currentActivity || isOrcamentoPessoal) {
			const activityId = currentActivity?.id || currentQuestion;
			
			setActivityFiles((prev) => {
				const newState = {
					...prev,
					[activityId]: files,
				};
				// Se for "Orçamento pessoal", salva também com o ID da questão
				if (isOrcamentoPessoal) {
					newState[currentQuestion] = files;
				}
				return newState;
			});
			
			setShowActivityFeedback((prev) => ({
				...prev,
				[activityId]: true,
			}));

			if (externalOnActivitySubmit) {
				externalOnActivitySubmit(activityId, files);
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
					return (activityFiles[activity.id]?.length || 0) > 0;
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
						if ((activityFiles[activity.id]?.length || 0) === 0) {
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

	const handleShowCompletion = () => {
		setShowCompletion(true);
	};

	// Prepara as respostas para a tela de sucesso - apenas questões respondidas
	const prepareAnswers = (): QuizAnswer[] => {
		const answers: QuizAnswer[] = [];
		let orcamentoPessoalProcessed = false; // Flag para evitar duplicatas
		
		// Itera sobre todas as questões, mas só inclui as que foram realmente respondidas
		for (let i = 1; i <= totalQuestions; i++) {
			const activity = activities.find((a) => a.id === i);
			const questionData = mockQuestions.find((q) => q.id === i);
			// Se não encontrou questão nem atividade, pula
			if (!questionData && !activity) {
				continue;
			}
			const selectedAnswerId = selectedAnswers[i];
			
			// Verifica se é atividade de "Orçamento pessoal" (id 3) - prioridade
			if (activity && activity.activityTitle.includes('Orçamento pessoal')) {
				// Só processa se ainda não foi processada
				if (!orcamentoPessoalProcessed) {
					const filesCount = activityFiles[activity.id]?.length || 0;
					if (filesCount > 0) {
						answers.push({
							id: i,
							question: activity.activityTitle,
							type: 'activity',
							activityFiles: filesCount,
						});
						orcamentoPessoalProcessed = true;
					}
				}
				continue; // Pula para a próxima iteração
			}
			
			// PRIMEIRO: Verifica se é questão "Orçamento pessoal" (id 4) - só se não foi processada a atividade
			if (questionData && questionData.question.includes('Orçamento pessoal')) {
				// Só processa se ainda não foi processada a atividade (id 3)
				if (!orcamentoPessoalProcessed) {
					// Busca arquivos pelo ID da questão ou pelo ID da atividade correspondente
					const foundActivity = activities.find((a) => a.id === i || a.id === 3); // Busca por id da questão ou id 3
					const activityId = foundActivity?.id || 3; // Usa id 3 como padrão se não encontrar
					
					// Busca arquivos em todas as chaves possíveis (prioridade: ID da questão, depois ID da atividade, depois id 3)
					const filesCount = activityFiles[i]?.length || 
					                  activityFiles[activityId]?.length || 
					                  activityFiles[3]?.length ||
					                  activityFiles[4]?.length ||
					                  (Object.keys(activityFiles).length > 0 ? Object.values(activityFiles)[0]?.length || 0 : 0);
					
					// Só inclui se houver arquivos enviados
					if (filesCount > 0) {
						answers.push({
							id: i,
							question: questionData.question,
							type: 'activity',
							activityFiles: filesCount,
						});
						orcamentoPessoalProcessed = true;
					}
				}
				continue; // Pula para a próxima iteração
			}
			
			if (activity) {
				// É uma atividade - só inclui se houver arquivos enviados
				const filesCount = activityFiles[activity.id]?.length || 0;
				if (filesCount > 0) {
					answers.push({
						id: i,
						question: activity.activityTitle,
						type: 'activity',
						activityFiles: filesCount,
					});
				}
			} else if (questionData) {
				// É uma pergunta
				const selectedAnswer = questionData.options?.find((opt) => opt.id === selectedAnswerId);
				const isCorrectAnswer = selectedAnswerId === questionData.options?.[0]?.id; // Primeira opção é sempre correta (mock)
				const correctAnswer = questionData.options?.find((opt) => opt.id === questionData.options?.[0]?.id);
				
				// Verifica se é pergunta de texto (subjetiva)
				if (questionData.type === 'subjective') {
					// Verifica novamente se é "Orçamento pessoal" - não deve ser texto
					if (questionData.question.includes('Orçamento pessoal')) {
						// Já foi tratado acima, mas se chegou aqui, trata como atividade
						const foundActivity = activities.find((a) => a.id === i);
						const activityId = foundActivity?.id || i;
						const filesCount = activityFiles[activityId]?.length || 
						                  activityFiles[i]?.length || 
						                  activityFiles[3]?.length ||
						                  activityFiles[4]?.length ||
						                  (Object.keys(activityFiles).length > 0 ? Object.values(activityFiles).reduce((sum, files) => sum + (files?.length || 0), 0) : 0);
						
						// Só inclui se houver arquivos enviados
						if (filesCount > 0) {
							answers.push({
								id: i,
								question: questionData.question,
								type: 'activity',
								activityFiles: filesCount,
							});
						}
					} else {
						// É uma resposta de texto subjetiva (não é Orçamento pessoal)
						// Só inclui se houver texto ou áudio
						const hasTextAnswer = subjectiveAnswers[i] && subjectiveAnswers[i].trim().length > 0;
						const hasAudio = subjectiveAudios[i] && subjectiveAudios[i].length > 0;
						
						if (hasTextAnswer || hasAudio) {
							answers.push({
								id: i,
								question: questionData.question,
								type: 'text',
								textAnswer: subjectiveAnswers[i] || '',
								audioFiles: (subjectiveAudios[i] || []).map((blob, index) => ({
									url: URL.createObjectURL(blob),
									duration: '0:30', // Duração mockada
								})),
							});
						}
					}
				} else {
					// Pergunta de múltipla escolha - só inclui se houver resposta selecionada
					if (selectedAnswerId) {
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
		}
		
		return answers;
	};


	// Verifica se a etapa atual é uma atividade
	const currentActivity = activities.find((a) => a.id === currentQuestion);
	const isActivityStep = !!currentActivity;

	// Busca a pergunta atual por ID em vez de índice do array
	const currentQuestionData = mockQuestions.find((q) => q.id === currentQuestion) || null;

	// Verifica se deve mostrar feedback ou a pergunta/atividade
	const isShowingFeedback = showFeedback[currentQuestion];
	const isShowingActivityFeedback = currentActivity ? showActivityFeedback[currentActivity.id] : false;
	// Verifica se deve mostrar feedback ou a pergunta

	// Verifica se é pergunta subjetiva (só se tiver currentQuestionData)
	// Mas NÃO é subjetiva se for "Orçamento pessoal" (essa deve ser tratada como atividade)
	const isSubjective = (currentQuestionData?.type === 'subjective' && !currentQuestionData?.question?.includes('Orçamento pessoal')) || false;

	// Determina a resposta correta (em produção viria de uma API)
	// Só define correctAnswerId se a pergunta for de múltipla escolha
	const correctAnswerId = !isSubjective && currentQuestionData?.options 
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


	// return (
	// 	<div className='w-full'>
	// 		{showSuccess ? (
	// 			<QuizSuccessStep answers={prepareAnswers()} quizTitle='Quiz Encontro 03' />
	// 		) : isShowingFeedback ? (
	// 			<QuizFeedbackStep
	// 				question={currentQuestionData}
	// 				currentQuestion={currentQuestion}
	// 				totalQuestions={totalQuestions}
	// 				selectedAnswerId={selectedAnswers[currentQuestion]}
	// 				points={feedbackData.points}
	// 				feedbackExplanation={feedbackData.explanation}
	// 				isCorrect={isCorrect}
	// 				correctAnswerId={correctAnswerId}
	// 				video={feedbackData.video}
	// 				onNext={handleNextFromFeedback}
	// 			/>
	// 		) : isShowingActivityFeedback && currentActivity ? (
	// 			<QuizActivityFeedbackStep
	// 				currentQuestion={currentQuestion}
	// 				totalQuestions={totalQuestions}
	// 				activityTitle={currentActivity.activityTitle}
	// 				activityDescription={currentActivity.activityDescription}
	// 				feedbackText='Organizar o que você ganha e o que gasta ajuda a entender melhor seu dinheiro. Assim, você consegue se planejar, evitar dívidas e dar passos mais seguros no seu negócio e na sua vida.'
	// 				submittedFiles={activityFiles[currentActivity.id] || []}
	// 				video={currentActivity.video}
	// 				onNext={handleActivityFeedbackNext}
	// 			/>
	// 		) : isActivityStep && currentActivity ? (
	// 			<QuizActivityStep
	// 				currentQuestion={currentQuestion}
	// 				totalQuestions={totalQuestions}
	// 				activityTitle={currentActivity.activityTitle}
	// 				activityDescription={currentActivity.activityDescription}
	// 				suggestionLabel={currentActivity.suggestionLabel}
	// 				downloadButtonText={currentActivity.downloadButtonText}
	// 				downloadUrl={currentActivity.downloadUrl}
	// 				onSubmit={handleActivitySubmit}
	// 				onNext={handleActivityNext}
	// 			/>
	// 		) : (
	// 			<QuizQuestionStep
	// 				question={currentQuestionData}
	// 				currentQuestion={currentQuestion}
	// 				totalQuestions={totalQuestions}
	// 				selectedAnswer={selectedAnswers[currentQuestion]}
	// 				onAnswerSelect={handleAnswerSelect}
	// 				onConfirmAnswer={handleConfirmAnswer}
	// 			/>
	// 		)}
	// 	</div>
	// );
	
	// Feedback específico para perguntas subjetivas
	const subjectiveFeedbackData = {
		explanation: 'Divulgar seu trabalho é importante para mais pessoas conhecerem o que você faz. Continue divulgando seu trabalho e/ou serviço para outras pessoas nas suas redes sociais.',
	};

	const selectedAnswerId = selectedAnswers[currentQuestion] || '';
	const subjectiveAnswer = subjectiveAnswers[currentQuestion] || '';

	// Prepara dados das respostas para a tela de conclusão
	const prepareCompletionAnswers = (): QuizAnswerInterface[] => {
		return mockQuestions.map((question, index) => {
			const questionId = question.id || index + 1;
			const isSubjective = question.type === 'subjective';
			
			// Verifica se é "Orçamento pessoal" - deve incluir arquivos
			const isOrcamentoPessoal = question.question.includes('Orçamento pessoal');
			
			if (isSubjective) {
				// Para questões subjetivas, usa dados reais ou mockados
				let mockAnswer = '';
				if (questionId === 3) {
					mockAnswer = 'Eu mando mensagem no WhatsApp pros meus clientes quando tenho bolo novo e posto Foto no meu Facebook pra mostrar os bolos que faço.';
				}
				
				// Se for "Orçamento pessoal", inclui os arquivos enviados
				if (isOrcamentoPessoal) {
					// Busca arquivos em todas as chaves possíveis (prioridade: ID da questão, depois ID da atividade, depois id 3 ou 4)
					const files = activityFiles[questionId] || 
					              activityFiles[3] || 
					              activityFiles[4] ||
					              (Object.keys(activityFiles).length > 0 ? Object.values(activityFiles)[0] : []);
					
					return {
						questionId,
						question,
						submittedFiles: files || [],
					};
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

	// Validação: se não encontrou questão e não é atividade, tenta encontrar próxima válida ou finaliza
	if (!currentQuestionData && !currentActivity && !showCompletion && !showSuccess) {
		// Busca próxima questão válida
		let foundNext = false;
		for (let i = currentQuestion + 1; i <= totalQuestions; i++) {
			const nextQuestionData = mockQuestions.find((q) => q.id === i);
			const nextActivity = activities.find((a) => a.id === i);
			if (nextQuestionData || nextActivity) {
				setCurrentQuestion(i);
				foundNext = true;
				break;
			}
		}
		// Se não encontrou, finaliza o quiz
		if (!foundNext) {
			setShowSuccess(true);
			return null;
		}
		return null;
	}

	// Se está na tela de conclusão, mostra ela
	if (showCompletion) {
		return (
			<div className='w-full max-w-full overflow-x-hidden box-border'>
				<QuizCompletionStep 
					answers={prepareCompletionAnswers()} 
					quizTitle='Quiz Encontro 03'
					onPrevious={handlePreviousEncounter}
					onNext={handleNextEncounter}
				/>
			</div>
		);
	}

	// Renderização com tratamento de erro
	try {
		return (
			<div className='w-full max-w-full overflow-x-hidden box-border'>
				{showSuccess ? (
					<QuizSuccessStep 
						answers={prepareAnswers()} 
						quizTitle='Quiz Encontro 03'
						onPrevious={handlePreviousEncounter}
						onNext={handleNextEncounter}
					/>
				) : isShowingFeedback ? (
					isSubjective && currentQuestionData && !currentQuestionData.question?.includes('Orçamento pessoal') ? (
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
					) : currentQuestionData && currentQuestionData.options && currentQuestionData.options.length > 0 ? (
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
					/>
				) : isSubjective ? (
					currentQuestionData && !currentQuestionData.question?.includes('Orçamento pessoal') ? (
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
					) : (
						<div className='w-full p-4 text-center'>
							<p className='text-[#6E707A]'>Carregando...</p>
						</div>
					)
				) : currentQuestionData && currentQuestionData.options && currentQuestionData.options.length > 0 ? (
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

