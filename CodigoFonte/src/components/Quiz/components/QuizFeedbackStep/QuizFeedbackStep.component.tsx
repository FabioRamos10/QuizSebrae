'use client';

import React, { FunctionComponent, useState, useMemo } from 'react';
import { QuizQuestion, QuizVideo, QuizOption } from '../../Quiz.interface';
import { UsersThree, SpeakerHigh, ArrowRight, Play, CurrencyDollar, ThumbsDown, Check, X } from 'phosphor-react';

interface QuizFeedbackStepProps {
	question: QuizQuestion;
	currentQuestion: number;
	totalQuestions: number;
	selectedAnswerId: string;
	points: number;
	feedbackExplanation: string;
	isCorrect: boolean;
	correctAnswerId?: string;
	video?: QuizVideo;
	onNext: () => void;
}

export const QuizFeedbackStep: FunctionComponent<QuizFeedbackStepProps> = ({
	question,
	currentQuestion,
	totalQuestions,
	selectedAnswerId,
	points,
	feedbackExplanation,
	isCorrect,
	correctAnswerId,
	video,
	onNext,
}) => {
	const [showTranscript, setShowTranscript] = useState(false);
	
	// Validação: garantir que a pergunta tenha options (não é subjetiva)
	if (!question.options || question.options.length === 0) {
		return (
			<div className='w-full p-4 text-center'>
				<p className='text-[#6E707A]'>Erro: Esta pergunta não possui opções de resposta.</p>
			</div>
		);
	}
	
	// Encontra a resposta selecionada
	const selectedAnswer = useMemo(() => {
		if (!selectedAnswerId || !question.options) return null;
		return question.options.find((opt) => opt.id === selectedAnswerId);
	}, [question.options, selectedAnswerId]);
	
	// Encontra a resposta correta (quando errou)
	const correctAnswer = useMemo(() => {
		if (!correctAnswerId || !question.options) return null;
		return question.options.find((opt) => opt.id === correctAnswerId);
	}, [question.options, correctAnswerId]);
	
	// Função auxiliar para obter o componente de ícone padrão
	const getDefaultIconComponent = (optionId: string, color: string, size: number = 64) => {
		switch (optionId) {
			case 'option1':
				return <UsersThree size={size} weight='fill' color={color} />;
			case 'option2':
				return <CurrencyDollar size={size} weight='fill' color={color} />;
			case 'option3':
				return <ThumbsDown size={size} weight='fill' color={color} />;
			default:
				return <div className='w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gray-400 rounded-full' />;
		}
	};

	return (
		<div className='w-full'>
			<div className='mb-6 md:mb-8 w-full'>
				<div className='flex flex-col md:flex-row md:items-center gap-3 md:gap-0 mb-3 md:mb-4'>
					<p className='text-base md:text-lg text-[#6E707A] font-regular md:mr-4 flex-shrink-0'>Perguntas</p>
					<div className='flex items-center w-full md:flex-1 md:w-auto overflow-hidden'>
						<div className='flex items-center w-full gap-1 sm:gap-1.5 md:gap-2'>
							{Array.from({ length: totalQuestions }, (_, index) => {
								const questionNumber = index + 1;
								const isActive = questionNumber === currentQuestion;
								const isCompleted = questionNumber < currentQuestion;
								const isLast = questionNumber === totalQuestions;
								const isCompletedOrActive = isCompleted || isActive;

								return (
									<React.Fragment key={questionNumber}>
										<div className='relative flex items-center justify-center flex-shrink-0 z-10'>
											<div
												className={`relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full transition-all ${
													isCompletedOrActive
														? 'bg-[#1EFF9D] text-[#070D26] font-bold shadow-lg'
														: 'bg-white border-2 border-[#D0D1D4] text-[#6E707A]'
												}`}>
												<span className='text-sm sm:text-sm md:text-base lg:text-lg font-semibold'>{questionNumber}</span>
											</div>
										</div>
										{!isLast && (
											<div
												className={`flex-1 min-w-[20px] md:min-w-[40px] h-0.5 md:h-1 transition-all flex-shrink-0 ${
													isCompletedOrActive
														? 'bg-[#1EFF9D]'
														: 'bg-[#D0D1D4]'
												}`}
											/>
										)}
									</React.Fragment>
								);
							})}
						</div>
					</div>
				</div>
			</div>

			<div className='bg-[#1a1a1a] rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 xl:p-10 w-full'>
				<div className='flex flex-col items-center w-full'>
					<div className='mb-6 md:mb-8 w-full flex justify-center'>
						<div className='max-w-[800px] w-full'>
							<p className='text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-[#1EFF9D] font-bold leading-tight text-center'>
								{question.question}
							</p>
						</div>
					</div>

					<div
						className={
							video
								? 'flex flex-col lg:flex-row gap-4 md:gap-6 mb-6 md:mb-8 w-full items-center'
								: 'flex flex-col gap-4 md:gap-6 mb-6 md:mb-8 w-full items-center'
						}>
						<div
							className={
								video
									? 'flex flex-col flex-1 overflow-hidden rounded-2xl justify-start items-center'
									: 'flex flex-col w-full overflow-hidden rounded-2xl justify-start items-center'
							}>
							<div className='flex flex-col md:flex-row overflow-hidden rounded-2xl max-w-[800px] w-full mt-4 md:mt-6'>
								{isCorrect ? (
									<>
										<div className='bg-[#0A1128] rounded-l-2xl md:rounded-l-2xl rounded-r-none md:rounded-r-none rounded-r-2xl md:rounded-r-0 p-4 md:p-5 lg:p-6 flex flex-col items-center justify-center text-center flex-[1.2]'>
											<p className='text-sm md:text-base lg:text-lg text-[#1EFF9D] font-bold mb-3 md:mb-4'>
												Muito bem, você acertou!
											</p>

											<div className='flex items-center justify-center mb-3 md:mb-4 flex-shrink-0'>
												{selectedAnswer?.icon ? (
													<img
														src={selectedAnswer.icon}
														alt=''
														className='w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain'
													/>
												) : (
													getDefaultIconComponent(selectedAnswerId, '#1EFF9D', 64)
												)}
											</div>

											<p className='text-xs md:text-sm lg:text-base text-[#1EFF9D] font-regular leading-relaxed'>
												{selectedAnswer?.text || 'Resposta correta'}
											</p>
										</div>

										<div className='bg-[#1EFF9D] rounded-r-2xl md:rounded-r-2xl rounded-l-none md:rounded-l-none rounded-l-2xl md:rounded-l-0 p-4 md:p-5 lg:p-6 flex flex-col items-center justify-center text-center flex-1 min-h-[280px]'>
											<p className='text-sm md:text-base lg:text-lg text-[#070D26] font-bold mb-3 md:mb-4 text-center'>
												+{points} pontos
											</p>

											<div className='flex items-center justify-center mb-3 md:mb-4 flex-shrink-0'>
												<div className='bg-[#070D26] rounded-full p-2 md:p-2.5 flex items-center justify-center shadow-md'>
													<SpeakerHigh size={20} weight='fill' color='#1EFF9D' className='md:w-6 md:h-6' />
												</div>
											</div>

											<p className='text-xs md:text-sm lg:text-base text-[#070D26] font-bold leading-relaxed text-center'>
												{feedbackExplanation}
											</p>
										</div>
									</>
								) : (
									<>
										<div className='bg-[#0A1128] rounded-l-2xl md:rounded-l-2xl rounded-r-none md:rounded-r-none rounded-r-2xl md:rounded-r-0 p-4 md:p-5 lg:p-6 flex flex-col items-center justify-center text-center flex-[0.6] min-h-[280px]'>
											<p className='text-sm md:text-base lg:text-lg text-[#FF6F61] font-bold mb-3 md:mb-4'>
												Ops, essa não é a resposta certa.
											</p>

											<div className='flex items-center justify-center mb-3 md:mb-4 flex-shrink-0'>
												{selectedAnswer?.icon ? (
													<img
														src={selectedAnswer.icon}
														alt=''
														className='w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain'
														style={{
															filter: 'brightness(0) saturate(100%) invert(55%) sepia(98%) saturate(1352%) hue-rotate(320deg) brightness(110%) contrast(105%)',
														}}
													/>
												) : (
													getDefaultIconComponent(selectedAnswerId, '#FF6F61', 64)
												)}
											</div>

											<p className='text-xs md:text-sm lg:text-base text-[#FF6F61] font-regular leading-relaxed'>
												{selectedAnswer?.text || 'Resposta selecionada'}
											</p>
										</div>

										<div className='bg-[#1EFF9D] rounded-r-2xl md:rounded-r-2xl rounded-l-none md:rounded-l-none rounded-l-2xl md:rounded-l-0 p-4 md:p-5 lg:p-6 flex flex-col items-center justify-center text-center flex-1 min-h-[280px]'>
											<p className='text-sm md:text-base lg:text-lg text-[#070D26] font-bold mb-3 md:mb-4 text-center'>
												Resposta correta:
											</p>

											<div className='flex items-center justify-center mb-3 md:mb-4 flex-shrink-0'>
												{correctAnswer?.icon ? (
													<img
														src={correctAnswer.icon}
														alt=''
														className='w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain'
													/>
												) : (
													getDefaultIconComponent(correctAnswerId || '', '#070D26', 64)
												)}
											</div>

											<p className='text-xs md:text-sm lg:text-base text-[#070D26] font-bold mb-3 md:mb-4 leading-relaxed text-center'>
												{correctAnswer?.text || 'Resposta correta'}
											</p>

											<p className='text-xs md:text-sm lg:text-base text-[#070D26] font-bold leading-relaxed text-center'>
												{feedbackExplanation}
											</p>
										</div>
									</>
								)}
							</div>
						</div>

						{video && (
							<div className='flex flex-col items-end lg:w-[300px] xl:w-[350px] flex-shrink-0 lg:ml-8 xl:ml-12'>
								<div className='bg-[#6B46C1] rounded-t-2xl overflow-hidden relative w-full' style={{ aspectRatio: '16/9', height: 'auto' }}>
									{video.thumbnail ? (
										<div className='relative w-full h-full'>
											<img
												src={video.thumbnail}
												alt={video.title || 'Vídeo'}
												className='w-full h-full object-cover'
											/>
											<div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-20'>
												<button className='bg-[#1a1a1a] rounded-full p-3 md:p-4 hover:scale-110 transition-transform shadow-lg'>
													<Play size={28} weight='fill' color='white' className='md:w-8 md:h-8 ml-1' />
												</button>
											</div>
										</div>
									) : (
										<div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-[#6B46C1] to-[#4C1D95]'>
											<button className='bg-[#1a1a1a] rounded-full p-3 md:p-4 hover:scale-110 transition-transform shadow-lg'>
												<Play size={28} weight='fill' color='white' className='md:w-8 md:h-8 ml-1' />
											</button>
										</div>
									)}
								</div>
								<div className='bg-[#6B46C1] rounded-b-2xl w-full p-3 md:p-4'>
									<p className='text-sm md:text-base text-white font-regular text-center'>
										Quer ver um vídeo sobre isso?
									</p>
								</div>
								<button
									onClick={() => setShowTranscript(!showTranscript)}
									className='text-sm md:text-base text-[#6B46C1] font-regular hover:underline text-center mt-2'>
									Ver transcrição
								</button>
								{showTranscript && video.transcript && (
									<div className='mt-3 p-4 bg-white rounded-lg border border-[#D0D1D4] w-full'>
										<p className='text-sm text-[#6E707A] leading-relaxed'>{video.transcript}</p>
									</div>
								)}
							</div>
						)}
					</div>

					<div className='flex justify-end w-full max-w-[800px] mt-2 md:mt-3' style={{ marginLeft: 'auto', marginRight: 'auto' }}>
						<button
							onClick={onNext}
							className='bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#1EFF9D] font-bold px-5 md:px-6 lg:px-8 py-2.5 md:py-3 rounded-full transition-all flex items-center gap-2 md:gap-3 text-sm md:text-base group shadow-lg border border-[#2a2a2a]'
							style={{ backgroundColor: '#1a1a1a' }}>
							<span>Próxima pergunta</span>
							<div className='bg-[#1EFF9D] rounded-full p-1.5 md:p-2 flex items-center justify-center flex-shrink-0'>
								<ArrowRight size={16} weight='bold' color='#070D26' className='md:w-4 md:h-4' />
							</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
