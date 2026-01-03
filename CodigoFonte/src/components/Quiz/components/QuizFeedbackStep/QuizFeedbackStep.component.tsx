'use client';

import React, { FunctionComponent } from 'react';
import { QuizQuestion, QuizVideo } from '../../Quiz.interface';
import { UsersThree, SpeakerHigh, ArrowRight, Play, CurrencyDollar } from 'phosphor-react';

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

/**
 * **QuizFeedbackStep**
 *
 * Componente que exibe o feedback após responder uma pergunta do quiz.
 * Mostra se a resposta está correta, pontos ganhos, explicação adicional e vídeo opcional.
 *
 * @component
 */
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
	// Encontra a resposta selecionada
	const selectedAnswer = question.options.find((opt) => opt.id === selectedAnswerId);
	// Encontra a resposta correta (quando errou)
	const correctAnswer = correctAnswerId ? question.options.find((opt) => opt.id === correctAnswerId) : null;

	return (
		<div className='w-full'>
			{/* Indicador de Progresso com linha conectando - FORA do quadro preto */}
			<div className='mb-6 md:mb-8 w-full'>
				<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 mb-3 md:mb-4 w-full'>
					<div className='flex flex-col md:flex-row md:items-center gap-3 md:gap-0 flex-1 min-w-0'>
						<p className='text-base md:text-lg text-[#6E707A] font-regular md:mr-4 flex-shrink-0'>Perguntas</p>
						<div className='flex items-center flex-1 w-full min-w-0'>
							<div className='flex items-center w-full gap-1 sm:gap-1.5 md:gap-2 min-w-0'>
								{Array.from({ length: totalQuestions }, (_, index) => {
									const questionNumber = index + 1;
									const isActive = questionNumber === currentQuestion;
									const isCompleted = questionNumber < currentQuestion;
									const isLast = questionNumber === totalQuestions;
									const isCompletedOrActive = isCompleted || isActive;

									return (
										<React.Fragment key={questionNumber}>
											{/* Círculo do número */}
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
											{/* Linha conectando (exceto no último) */}
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
					{/* Indicador de Pontos */}
					<p className='text-base md:text-lg text-[#070D26] font-bold md:ml-4 flex-shrink-0'>
						{points} PONTOS
					</p>
				</div>
			</div>

			{/* Container do conteúdo do quiz com fundo preto - largura total */}
			<div className='bg-[#1a1a1a] rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 xl:p-10 w-full' style={{ backgroundColor: '#1a1a1a' }}>
				{/* Container principal com pergunta e boxes centralizados */}
				<div className='flex flex-col items-center w-full'>
					{/* Pergunta em texto verde claro - um pouco à esquerda acima dos boxes */}
					<div className='mb-6 md:mb-8 w-full flex justify-center'>
						<div className='max-w-[800px] w-full ml-[-20px] md:ml-[-40px] lg:ml-[-60px]'>
							<p className='text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-[#1EFF9D] font-bold leading-tight text-center'>
								{question.question}
							</p>
						</div>
					</div>

					{/* Container com Boxes de Feedback e Vídeo lado a lado */}
					<div className={`flex flex-col ${video ? 'lg:flex-row' : ''} gap-4 md:gap-6 mb-6 md:mb-8 w-full ${!video ? 'items-start' : ''}`}>
						{/* Boxes de Feedback - Card completo com bordas arredondadas - Centralizado */}
						<div className={`flex flex-col ${video ? 'flex-1' : 'w-full'} overflow-hidden rounded-2xl justify-start ${!video ? 'items-start' : 'items-center'}`}>
							<div className='flex flex-col md:flex-row overflow-hidden rounded-2xl max-w-[800px] w-full mt-4 md:mt-6' style={{ marginLeft: video ? '300px' : 'auto', marginRight: 'auto' }}>
								{isCorrect ? (
									<>
										{/* Box Esquerdo - Feedback da Resposta Correta - Mais largo e menos alto */}
										<div className='bg-[#0A1128] rounded-l-2xl md:rounded-l-2xl rounded-r-none md:rounded-r-none rounded-r-2xl md:rounded-r-0 p-4 md:p-5 lg:p-6 flex flex-col items-center justify-center text-center flex-[1.2]'>
											{/* Título "Muito bem, você acertou!" */}
											<p className='text-sm md:text-base lg:text-lg text-[#1EFF9D] font-bold mb-3 md:mb-4'>
												Muito bem, você acertou!
											</p>
											
											{/* Ícone de pessoas */}
											<div className='flex items-center justify-center mb-3 md:mb-4 flex-shrink-0'>
												<UsersThree size={48} weight='fill' color='#1EFF9D' className='md:w-16 md:h-16 lg:w-20 lg:h-20' />
											</div>
											
											{/* Texto da resposta correta */}
											<p className='text-xs md:text-sm lg:text-base text-[#1EFF9D] font-regular leading-relaxed'>
												{selectedAnswer?.text || 'Resposta correta'}
											</p>
										</div>

										{/* Box Direito - Pontos e Explicação - Mais alto/comprido e menos largo (mais quadrado) */}
										<div className='bg-[#1EFF9D] rounded-r-2xl md:rounded-r-2xl rounded-l-none md:rounded-l-none rounded-l-2xl md:rounded-l-0 p-4 md:p-5 lg:p-6 flex flex-col items-center justify-center text-center flex-1 min-h-[280px]'>
											{/* Pontos */}
											<p className='text-sm md:text-base lg:text-lg text-[#070D26] font-bold mb-3 md:mb-4 text-center'>
												+{points} pontos
											</p>
											
											{/* Ícone de speaker - círculo preto com símbolo verde claro dentro */}
											<div className='flex items-center justify-center mb-3 md:mb-4 flex-shrink-0'>
												<div className='bg-[#070D26] rounded-full p-2 md:p-2.5 flex items-center justify-center shadow-md'>
													<SpeakerHigh size={20} weight='fill' color='#1EFF9D' className='md:w-6 md:h-6' />
												</div>
											</div>
											
											{/* Explicação */}
											<p className='text-xs md:text-sm lg:text-base text-[#070D26] font-bold leading-relaxed text-center'>
												{feedbackExplanation}
											</p>
										</div>
									</>
								) : (
									<>
										{/* Box Esquerdo - Feedback da Resposta Errada - Retangular (menos largo, mais alto) */}
										<div className='bg-[#0A1128] rounded-l-2xl md:rounded-l-2xl rounded-r-none md:rounded-r-none rounded-r-2xl md:rounded-r-0 p-4 md:p-5 lg:p-6 flex flex-col items-center justify-center text-center flex-[0.6] min-h-[280px]'>
											{/* Título "Ops, essa não é a resposta certa." */}
											<p className='text-sm md:text-base lg:text-lg text-[#FF6F61] font-bold mb-3 md:mb-4'>
												Ops, essa não é a resposta certa.
											</p>
											
											{/* Ícone de notas empilhadas */}
											<div className='flex items-center justify-center mb-3 md:mb-4 flex-shrink-0'>
												<img 
													src="/IMG_1552.PNG" 
													alt="Notas empilhadas" 
													className='w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24'
													style={{ 
														filter: 'brightness(0) saturate(100%) invert(55%) sepia(98%) saturate(1352%) hue-rotate(320deg) brightness(110%) contrast(105%)'
													}}
												/>
											</div>
											
											{/* Texto da resposta errada */}
											<p className='text-xs md:text-sm lg:text-base text-[#FF6F61] font-regular leading-relaxed'>
												{selectedAnswer?.text || 'Resposta selecionada'}
											</p>
										</div>

										{/* Box Direito - Resposta Correta e Explicação - Mais alto/comprido e menos largo (mais quadrado) */}
										<div className='bg-[#1EFF9D] rounded-r-2xl md:rounded-r-2xl rounded-l-none md:rounded-l-none rounded-l-2xl md:rounded-l-0 p-4 md:p-5 lg:p-6 flex flex-col items-center justify-center text-center flex-1 min-h-[280px]'>
											{/* Título "Resposta correta:" */}
											<p className='text-sm md:text-base lg:text-lg text-[#070D26] font-bold mb-3 md:mb-4 text-center'>
												Resposta correta:
											</p>
											
											{/* Ícone de pessoas */}
											<div className='flex items-center justify-center mb-3 md:mb-4 flex-shrink-0'>
												<UsersThree size={48} weight='fill' color='#070D26' className='md:w-16 md:h-16 lg:w-20 lg:h-20' />
											</div>
											
											{/* Texto da resposta correta */}
											<p className='text-xs md:text-sm lg:text-base text-[#070D26] font-bold mb-3 md:mb-4 leading-relaxed text-center'>
												{correctAnswer?.text || 'Resposta correta'}
											</p>
											
											{/* Explicação */}
											<p className='text-xs md:text-sm lg:text-base text-[#070D26] font-bold leading-relaxed text-center'>
												{feedbackExplanation}
											</p>
										</div>
									</>
								)}
							</div>
							
							{/* Botão Próxima Pergunta - alinhado com o texto do vídeo */}
							<div className='flex justify-end w-full max-w-[800px] mt-2 md:mt-3' style={{ marginLeft: 'auto', marginRight: 'auto' }}>
								<button
									onClick={onNext}
									className='bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#1EFF9D] font-bold px-5 md:px-6 lg:px-8 py-2.5 md:py-3 rounded-full transition-all flex items-center gap-2 md:gap-3 text-sm md:text-base group shadow-lg border border-[#2a2a2a]'
									style={{ backgroundColor: '#1a1a1a', marginTop: video ? 'calc((300px * 4 / 3) - 250px)' : '0', marginLeft: '100px' }}>
									<span>Próxima pergunta</span>
									<div className='bg-[#1EFF9D] rounded-full p-1.5 md:p-2 flex items-center justify-center flex-shrink-0'>
										<ArrowRight size={16} weight='bold' color='#070D26' className='md:w-4 md:h-4' />
									</div>
								</button>
							</div>
						</div>

						{/* Seção de Vídeo - mais à direita */}
						{video && (
							<div className='flex flex-col items-end lg:w-[300px] xl:w-[350px] flex-shrink-0 lg:ml-8 xl:ml-12'>
								{/* Player de Vídeo - retângulo vertical proporcional */}
								<div className='bg-[#6B46C1] rounded-t-2xl overflow-hidden relative w-full' style={{ aspectRatio: '3/4', height: 'auto' }}>
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
								{/* Barra roxa com texto "Quer ver um vídeo sobre isso?" */}
								<div className='bg-[#6B46C1] rounded-b-2xl w-full p-3 md:p-4'>
									<p className='text-sm md:text-base text-white font-regular text-center'>
										Quer ver um vídeo sobre isso?
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
