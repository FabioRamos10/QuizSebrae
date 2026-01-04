'use client';

import React, { FunctionComponent, useState } from 'react';
import { QuizQuestion, QuizVideo } from '../../Quiz.interface';
import { ArrowRight, Play, SpeakerHigh } from 'phosphor-react';

interface QuizSubjectiveFeedbackStepProps {
	question: QuizQuestion;
	currentQuestion: number;
	totalQuestions: number;
	userAnswer: string;
	audioBlobs?: Blob[];
	feedbackExplanation: string;
	video?: QuizVideo;
	onNext: () => void;
}

export const QuizSubjectiveFeedbackStep: FunctionComponent<QuizSubjectiveFeedbackStepProps> = ({
	question,
	currentQuestion,
	totalQuestions,
	userAnswer,
	audioBlobs = [],
	feedbackExplanation,
	video,
	onNext,
}) => {
	const [showTranscript, setShowTranscript] = useState(false);

	return (
		<div className='w-full'>
			<div className='mb-6 md:mb-8 w-full bg-white'>
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
													isCompletedOrActive ? 'bg-[#1EFF9D]' : 'bg-[#D0D1D4]'
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

			<div className='w-full flex flex-col items-center bg-[#222325] py-6 md:py-8 px-4 md:px-6 lg:px-8 rounded-2xl md:rounded-3xl'>
				<div className='mb-4 md:mb-6 text-center max-w-3xl'>
					<p className='text-sm md:text-base text-white font-regular leading-relaxed'>
						Sua resposta foi enviada para o facilitador, que irá ler e te dar um retorno em breve. Isso ajuda a completar sua aula.
					</p>
				</div>

				<div className='mb-6 md:mb-8 text-center max-w-4xl'>
					<p className='text-xl md:text-2xl lg:text-3xl xl:text-4xl text-[#1EFF9D] font-bold leading-tight'>
						{question.question}
					</p>
				</div>

				<div className='flex flex-col lg:flex-row gap-4 md:gap-6 w-full max-w-6xl mb-6 md:mb-8 px-4 md:px-6 lg:px-8'>
					{(userAnswer || audioBlobs.length > 0) && (
						<div className={`bg-[#222325] border-2 border-[#1EFF9D] rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-8 ${video ? 'flex-1 lg:flex-[0.5]' : 'flex-1 lg:flex-[0.6]'} max-w-full overflow-x-hidden box-border`}>
							{userAnswer && (
								<div className={audioBlobs.length > 0 ? 'mb-5' : ''}>
									<p className='text-base md:text-lg lg:text-xl text-[#1EFF9D] font-regular leading-relaxed whitespace-pre-wrap break-words max-w-full' 
										style={{ wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>
										{userAnswer}
									</p>
								</div>
							)}
							{audioBlobs.length > 0 && (
								<div className={userAnswer ? 'mt-5 pt-5 border-t border-[#1EFF9D]' : ''}>
									<div className='space-y-3'>
										{audioBlobs.map((audioBlob, index) => (
											<audio key={index} controls className='w-full'>
												<source src={URL.createObjectURL(audioBlob)} type='audio/wav' />
												Seu navegador não suporta o elemento de áudio.
											</audio>
										))}
									</div>
								</div>
							)}
						</div>
					)}

					<div className={`bg-[#1EFF9D] rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-8 ${video ? 'flex-1 lg:flex-[0.3]' : 'flex-1 lg:flex-[0.4]'}`}>
						<div className='mb-3 md:mb-4'>
							<SpeakerHigh size={24} weight='bold' color='#070D26' className='md:w-6 md:h-6' />
						</div>
						<p className='text-base md:text-lg lg:text-xl text-[#070D26] font-regular leading-relaxed'>
							{feedbackExplanation}
						</p>
					</div>

				{video && (
					<div className='flex flex-col lg:w-[300px] xl:w-[350px] flex-shrink-0'>
						<div className='bg-[#6B46C1] rounded-2xl overflow-hidden relative w-full mb-3' style={{ aspectRatio: '16/9' }}>
							{video.thumbnail ? (
								<div className='relative w-full h-full'>
									<img
										src={video.thumbnail}
										alt={video.title || 'Vídeo'}
										className='w-full h-full object-cover'
									/>
									<div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-20'>
										<button className='bg-white bg-opacity-90 rounded-full p-3 md:p-4 hover:scale-110 transition-transform shadow-lg'>
											<Play size={28} weight='fill' color='#6B46C1' className='md:w-8 md:h-8 ml-1' />
										</button>
									</div>
								</div>
							) : (
								<div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-[#6B46C1] to-[#4C1D95]'>
									<button className='bg-white bg-opacity-90 rounded-full p-3 md:p-4 hover:scale-110 transition-transform shadow-lg'>
										<Play size={28} weight='fill' color='#6B46C1' className='md:w-8 md:h-8 ml-1' />
									</button>
								</div>
							)}
						</div>
						<button
							type='button'
							className='text-sm md:text-base text-[#6B46C1] font-regular hover:underline text-center mb-2'>
							Quer ver um vídeo sobre isso?
						</button>
						<button
							onClick={() => setShowTranscript(!showTranscript)}
							className='text-sm md:text-base text-[#6B46C1] font-regular hover:underline text-center'>
							Ver transcrição
						</button>
						{showTranscript && video.transcript && (
							<div className='mt-3 p-4 bg-white rounded-lg border border-[#D0D1D4]'>
								<p className='text-sm text-[#6E707A] leading-relaxed'>{video.transcript}</p>
							</div>
						)}
					</div>
				)}
			</div>

				<div className='flex justify-center mt-6 md:mt-8 w-full'>
					<button
						onClick={onNext}
						className='bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#1EFF9D] font-bold px-5 md:px-6 lg:px-8 py-2.5 md:py-3 rounded-full transition-all flex items-center gap-2 md:gap-3 text-sm md:text-base group shadow-lg'>
						<span>Próxima pergunta</span>
						<div className='bg-[#1EFF9D] rounded-full p-1.5 md:p-2 flex items-center justify-center flex-shrink-0'>
							<ArrowRight size={16} weight='bold' color='#070D26' className='md:w-4 md:h-4' />
						</div>
					</button>
				</div>
			</div>
		</div>
	);
};

