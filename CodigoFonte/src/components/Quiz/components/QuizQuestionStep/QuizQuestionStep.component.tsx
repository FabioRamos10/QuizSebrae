'use client';

import React, { FunctionComponent } from 'react';
import { QuizQuestion, QuizOption } from '../../Quiz.interface';
import { UsersThree, CurrencyDollar, ThumbsDown, ArrowRight } from 'phosphor-react';

interface QuizQuestionStepProps {
	question: QuizQuestion;
	currentQuestion: number;
	totalQuestions: number;
	selectedAnswer?: string;
	onAnswerSelect: (optionId: string) => void;
	onConfirmAnswer?: () => void;
}

export const QuizQuestionStep: FunctionComponent<QuizQuestionStepProps> = ({
	question,
	currentQuestion,
	totalQuestions,
	selectedAnswer,
	onAnswerSelect,
	onConfirmAnswer,
}) => {
	return (
		<div className='w-full'>
			<div className='mb-6 md:mb-8'>
				<div className='flex flex-col md:flex-row md:items-center gap-3 md:gap-0 mb-3 md:mb-4'>
					<p className='text-base md:text-lg text-[#6E707A] font-regular md:mr-4 flex-shrink-0'>Perguntas</p>
					<div className='flex items-center w-full md:flex-1 md:w-auto overflow-hidden'>
						<div className='flex items-center w-full gap-1 sm:gap-1.5 md:gap-2'>
							{Array.from({ length: totalQuestions }, (_, index) => {
								const questionNumber = index + 1;
								const isActive = questionNumber === currentQuestion;
								const isCompleted = questionNumber < currentQuestion;
								const isLast = questionNumber === totalQuestions;

								return (
									<React.Fragment key={questionNumber}>
										<div className='relative flex items-center justify-center flex-shrink-0 z-10'>
											<div
												className={`relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full border-2 transition-all ${
													isActive
														? 'bg-[#1EFF9D] border-white text-[#070D26] font-bold shadow-lg'
														: isCompleted
															? 'bg-[#1EFF9D] border-white text-[#070D26] font-bold'
															: 'bg-white border-[#D0D1D4] text-[#6E707A]'
												}`}>
												<span className='text-sm sm:text-sm md:text-base lg:text-lg font-semibold'>{questionNumber}</span>
											</div>
										</div>
										{!isLast && (
											<div
												className={`w-2 sm:w-3 md:flex-1 md:min-w-0 h-0.5 md:h-1 transition-all flex-shrink-0 ${
													isCompleted || isActive
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

			<div className='bg-gradient-to-b from-[#1EFF9D] to-[#14E48A] rounded-2xl p-4 md:p-5 lg:p-6 xl:p-8'>
				<div className='flex items-start gap-2 md:gap-3 lg:gap-4 mb-4 md:mb-6 lg:mb-8'>
					<div className='flex-shrink-0 mt-0.5 md:mt-1'>
						<svg
							width='20'
							height='20'
							className='md:w-6 md:h-6'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z'
								fill='#070D26'
							/>
							<path
								d='M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10H3V12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12V10H19Z'
								fill='#070D26'
							/>
						</svg>
					</div>
					<p className='text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-[#070D26] font-bold flex-1 leading-tight'>
						{question.question}
					</p>
				</div>

				{question.options && question.options.length > 0 ? (
					<div className='grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-5 xl:gap-6 mb-4 md:mb-6'>
						{question.options.map((option: QuizOption) => {
						const isSelected = selectedAnswer === option.id;

						return (
						<button
							key={option.id}
							onClick={() => onAnswerSelect(option.id)}
							className={`rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 xl:p-8 border-2 transition-all text-left w-full ${
								isSelected
									? 'bg-[#070D26] border-[#070D26] shadow-xl'
									: 'bg-white border-white hover:border-[#070D26] hover:shadow-lg'
							}`}>
							<div className='flex flex-col md:flex-row md:items-center gap-3 md:gap-4 text-left md:text-center'>
								<div className='w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 flex items-center justify-center flex-shrink-0 md:mx-auto'>
									{option.icon ? (
										<img
											src={option.icon}
											alt=''
											className='w-full h-full object-contain'
										/>
									) : (
										<DefaultIcon optionId={option.id} isSelected={isSelected} />
									)}
								</div>
								<p
									className={`text-sm md:text-base lg:text-lg font-regular leading-relaxed flex-1 ${
										isSelected ? 'text-[#1EFF9D] font-bold' : 'text-[#6E707A]'
									}`}>
									{option.text}
								</p>
							</div>
						</button>
						);
					})}
					</div>
				) : (
					<div className='mb-4 md:mb-6 p-4 bg-white rounded-xl'>
						<p className='text-[#6E707A]'>Nenhuma opção de resposta disponível.</p>
					</div>
				)}

				{selectedAnswer && onConfirmAnswer && (
					<div className='flex justify-center mt-4 md:mt-6'>
						<button
							onClick={onConfirmAnswer}
							className='bg-[#070D26] hover:bg-[#0a1424] text-[#1EFF9D] font-bold px-5 md:px-6 lg:px-8 py-3 md:py-3.5 rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-3 md:gap-4 text-base md:text-lg w-full md:w-auto justify-center group'>
							<span>Confirmar Resposta</span>
							<div className='bg-[#1EFF9D] rounded-full p-1.5 md:p-2 flex items-center justify-center flex-shrink-0'>
								<ArrowRight size={16} weight='bold' color='#070D26' className='md:w-5 md:h-5' />
							</div>
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

const DefaultIcon: FunctionComponent<{ optionId: string; isSelected?: boolean }> = ({ optionId, isSelected = false }) => {
	const iconColor = isSelected ? '#1EFF9D' : '#070D26';
	
	const icons: { [key: string]: JSX.Element } = {
		option1: (
			<UsersThree size={40} weight='fill' color={iconColor} className='md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16' />
		),
		option2: (
			<CurrencyDollar size={40} weight='fill' color={iconColor} className='md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16' />
		),
		option3: (
			<ThumbsDown size={40} weight='fill' color={iconColor} className='md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16' />
		),
	};

	return icons[optionId] || (
		<div className='w-12 h-12 md:w-16 md:h-16 bg-[#D0D1D4] rounded-full' />
	);
};

