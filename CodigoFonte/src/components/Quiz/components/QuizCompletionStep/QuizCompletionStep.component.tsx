'use client';

import React, { FunctionComponent } from 'react';
import { QuizQuestion, QuizAnswer, QuizOption } from '../../Quiz.interface';
import { Check, X, UsersThree, CurrencyDollar, ThumbsDown, Info } from 'phosphor-react';

interface QuizCompletionStepProps {
	answers: QuizAnswer[];
}

export const QuizCompletionStep: FunctionComponent<QuizCompletionStepProps> = ({
	answers,
}) => {
	// Função auxiliar para obter o componente de ícone padrão
	const getDefaultIconComponent = (optionId: string, color: string, size: number = 24) => {
		switch (optionId) {
			case 'option1':
				return <UsersThree size={size} weight='fill' color={color} />;
			case 'option2':
				return <CurrencyDollar size={size} weight='fill' color={color} />;
			case 'option3':
				return <ThumbsDown size={size} weight='fill' color={color} />;
			default:
				return null;
		}
	};

	// Encontra a resposta selecionada
	const getSelectedOption = (answer: QuizAnswer): QuizOption | null => {
		if (!answer.selectedOptionId || !answer.question.options) return null;
		return answer.question.options.find((opt) => opt.id === answer.selectedOptionId) || null;
	};

	// Encontra a resposta correta
	const getCorrectOption = (answer: QuizAnswer): QuizOption | null => {
		if (!answer.correctAnswerId || !answer.question.options) return null;
		return answer.question.options.find((opt) => opt.id === answer.correctAnswerId) || null;
	};

	return (
		<div className='w-full max-w-full overflow-x-hidden box-border'>
			{/* Mensagem de sucesso */}
			<div className='mb-6 md:mb-8'>
				<h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#070D26] font-bold mb-4'>
					Quiz enviado com sucesso!
				</h2>
			</div>

			<div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
				{/* Seção principal - Suas respostas */}
				<div className='flex-1 lg:flex-[2]'>
					<h3 className='text-xl md:text-2xl lg:text-3xl text-[#070D26] font-bold mb-6'>
						Suas respostas
					</h3>

					<div className='space-y-6'>
						{answers.map((answer, index) => {
							const isSubjective = answer.question.type === 'subjective';
							const isMultipleChoice = !isSubjective && answer.question.options;

							if (isMultipleChoice && answer.selectedOptionId) {
								const selectedOption = getSelectedOption(answer);
								const correctOption = !answer.isCorrect ? getCorrectOption(answer) : null;

								return (
									<div
										key={answer.questionId}
										className='bg-white rounded-2xl p-5 md:p-6 lg:p-8 border border-[#E5E7EB]'>
										{/* Título da pergunta */}
										<div className='flex items-start gap-3 mb-4'>
											<div className='flex-shrink-0 mt-1'>
												{answer.isCorrect ? (
													<Check size={24} weight='bold' color='#1EFF9D' className='md:w-6 md:h-6' />
												) : (
													<X size={24} weight='bold' color='#FF6F61' className='md:w-6 md:h-6' />
												)}
											</div>
											<p className='text-base md:text-lg lg:text-xl text-[#070D26] font-bold flex-1'>
												{answer.question.question}
											</p>
											<div className='flex-shrink-0'>
												<div className='w-5 h-5 rounded-full bg-[#6E707A] bg-opacity-20 flex items-center justify-center'>
													<Info size={16} weight='regular' color='#6E707A' />
												</div>
											</div>
										</div>

										{/* Resposta do usuário */}
										<div
											className={`p-4 rounded-xl mb-3 ${
												answer.isCorrect ? 'bg-[#1EFF9D]' : 'bg-[#FF6F61]'
											}`}>
											<p
												className={`text-sm md:text-base font-medium ${
													answer.isCorrect ? 'text-[#070D26]' : 'text-white'
												}`}>
												{selectedOption?.text || 'Resposta selecionada'}
											</p>
										</div>

										{/* Resposta correta (apenas se errou) */}
										{!answer.isCorrect && correctOption && (
											<div className='bg-[#070D26] rounded-xl p-4'>
												<p className='text-xs md:text-sm text-white font-bold mb-2'>
													Resposta correta:
												</p>
												<p className='text-sm md:text-base text-white font-medium'>
													{correctOption.text}
												</p>
											</div>
										)}
									</div>
								);
							}

							if (isSubjective && (answer.subjectiveAnswer || (answer.audioBlobs && answer.audioBlobs.length > 0))) {
								return (
									<div
										key={answer.questionId}
										className='bg-white rounded-2xl p-5 md:p-6 lg:p-8 border border-[#E5E7EB]'>
										{/* Título da pergunta */}
										<div className='flex items-start gap-3 mb-4'>
											<p className='text-base md:text-lg lg:text-xl text-[#070D26] font-bold flex-1'>
												{answer.question.question}
											</p>
											<div className='flex-shrink-0'>
												<div className='w-5 h-5 rounded-full bg-[#6E707A] bg-opacity-20 flex items-center justify-center'>
													<Info size={16} weight='regular' color='#6E707A' />
												</div>
											</div>
										</div>

										{/* Resposta de texto */}
										{answer.subjectiveAnswer && (
											<div className='bg-white border border-[#E5E7EB] rounded-xl p-4 mb-4'>
												<p className='text-sm md:text-base text-[#070D26] leading-relaxed whitespace-pre-wrap break-words'>
													{answer.subjectiveAnswer}
												</p>
											</div>
										)}

										{/* Áudios */}
										{answer.audioBlobs && answer.audioBlobs.length > 0 && (
											<div className='space-y-3'>
												{answer.audioBlobs.map((audioBlob, audioIndex) => (
													<div
														key={audioIndex}
														className='bg-white border border-[#E5E7EB] rounded-xl p-3'>
														<audio controls className='w-full'>
															<source src={URL.createObjectURL(audioBlob)} type='audio/webm' />
															Seu navegador não suporta o elemento de áudio.
														</audio>
													</div>
												))}
											</div>
										)}
									</div>
								);
							}

							return null;
						})}
					</div>
				</div>

				{/* Barra lateral - Informações de retorno */}
				<div className='lg:w-80 lg:flex-shrink-0'>
					<div className='bg-gradient-to-b from-[#1EFF9D] to-[#14E48A] rounded-2xl p-5 md:p-6 lg:p-8 sticky top-6'>
						<h4 className='text-xl md:text-2xl text-[#070D26] font-bold mb-4'>
							Retorno em breve!
						</h4>
						<div className='space-y-4'>
							<p className='text-sm md:text-base text-[#070D26] leading-relaxed'>
								Suas respostas foram enviadas para o facilitador, que vai ler e te dar um retorno em breve.
							</p>
							<p className='text-sm md:text-base text-[#070D26] leading-relaxed'>
								Com essa atividade, o facilitador vai confirmar sua presença nesta aula.
							</p>
							<p className='text-sm md:text-base text-[#070D26] font-bold leading-relaxed'>
								Parabéns por participar ativamente!
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

