'use client';

import React, { FunctionComponent, useState } from 'react';
import { SpeakerHigh, ArrowRight, Play } from 'phosphor-react';
import { QuizVideo } from '../../Quiz.interface';

interface QuizActivityFeedbackStepProps {
	currentQuestion: number;
	totalQuestions: number;
	activityTitle: string;
	activityDescription: string;
	feedbackText?: string; // Texto específico para a caixa verde de feedback
	submittedFiles: File[];
	video?: QuizVideo; // Vídeo opcional
	onNext: () => void;
}

/**
 * **QuizActivityFeedbackStep**
 *
 * Componente que exibe o feedback após o envio de arquivos de uma atividade.
 * Mostra os arquivos enviados, uma mensagem de confirmação e informações adicionais.
 *
 * @component
 */
export const QuizActivityFeedbackStep: FunctionComponent<QuizActivityFeedbackStepProps> = ({
	currentQuestion,
	totalQuestions,
	activityTitle,
	activityDescription,
	feedbackText,
	submittedFiles,
	video,
	onNext,
}) => {
	const [isVideoPlaying, setIsVideoPlaying] = useState(false);
	// Texto padrão para a caixa verde se não for fornecido
	const greenBoxText = feedbackText || 'Organizar o que você ganha e o que gasta ajuda a entender melhor seu dinheiro. Assim, você consegue se planejar, evitar dívidas e dar passos mais seguros no seu negócio e na sua vida.';
	// Gera URLs de preview para os arquivos (imagens)
	const getFilePreview = (file: File): string => {
		if (file.type.startsWith('image/')) {
			return URL.createObjectURL(file);
		}
		// Para outros tipos de arquivo, retorna um placeholder
		return '/document-icon.svg';
	};

	return (
		<div className='w-full'>
			{/* Indicador de Progresso */}
			<div className='mb-6 md:mb-8 w-full'>
				<div className='flex items-center justify-between mb-2'>
					<span className='text-xs md:text-sm font-medium text-white'>Perguntas</span>
				</div>
				<div className='flex items-center gap-2 md:gap-3'>
					{Array.from({ length: totalQuestions }, (_, index) => {
						const questionNumber = index + 1;
						const isActive = questionNumber === currentQuestion;
						const isCompleted = questionNumber < currentQuestion;

						return (
							<React.Fragment key={questionNumber}>
								<div
									className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all ${
										isActive
											? 'bg-[#1EFF9D] border-[#1EFF9D] text-[#0A1128]'
											: isCompleted
											? 'bg-[#1EFF9D] border-[#1EFF9D] text-[#0A1128]'
											: 'bg-transparent border-[#6E707A] text-[#6E707A]'
									}`}>
									<span className={`text-xs md:text-sm font-bold ${isActive || isCompleted ? 'text-[#0A1128]' : 'text-[#6E707A]'}`}>
										{questionNumber}
									</span>
								</div>
								{questionNumber < totalQuestions && (
									<div
										className={`flex-1 h-0.5 md:h-1 ${
											isCompleted || isActive ? 'bg-[#1EFF9D]' : 'bg-[#6E707A]'
										}`}
									/>
								)}
							</React.Fragment>
						);
					})}
				</div>
			</div>

			{/* Container principal com fundo escuro */}
			<div className='bg-[#222325] rounded-2xl p-4 md:p-6 lg:p-8'>
				{/* Texto introdutório */}
				<p className='text-sm md:text-base text-white mb-6 md:mb-8 leading-relaxed text-center'>
					<span>Seus arquivos foram recebidos e serão analisado pelo facilitador. Essa</span>
					<br />
					<span>atividade ajuda a reforçar o que você aprendeu e conta para o seu</span>
					<br />
					<span>certificado.</span>
				</p>

				{/* Título da atividade */}
				<h2 className='text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-6 md:mb-8 text-center'>
					<div className='text-[#06EBBD]'>Orçamento pessoal: equilibrando</div>
					<div className='text-center text-[#1EFF9D]'>receitas e despesas</div>
				</h2>

				{/* Container principal com boxes e vídeo */}
				<div className='flex flex-col lg:flex-row gap-6 md:gap-8 mb-6 md:mb-8 items-stretch'>
					{/* Container com arquivos e caixa verde centralizados */}
					<div className='flex-1 flex flex-col lg:flex-row gap-6 md:gap-8 justify-end items-stretch'>
						{/* Seção de arquivos enviados - Centralizada com borda verde */}
						<div className='max-w-[20rem] mx-auto lg:mx-0'>
						<div className='border-2 border-[#1EFF9D] rounded-2xl p-3 md:p-4 pt-5 md:pt-6 pb-14 md:pb-16 flex flex-col'>
							<div className='flex items-center justify-between mb-5'>
								<span className='text-sm md:text-base font-medium text-[#1EFF9D]'>Seus arquivos enviados</span>
								<span className='text-sm md:text-base font-bold text-[#1EFF9D]'>{submittedFiles.length}</span>
							</div>

							{/* Linha divisória verde - vai até o final em ambos os lados */}
							<div className='h-0.5 bg-[#1EFF9D] mb-5 -mx-3 md:-mx-4'></div>

							{/* Grid de thumbnails */}
							<div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4'>
								{submittedFiles.map((file, index) => (
									<div
										key={index}
										className='aspect-[3/4] rounded-lg overflow-hidden bg-[#F5F5F0] border-2 border-dashed border-[#D0D0D0] flex items-center justify-center shadow-sm'>
										{file.type.startsWith('image/') ? (
											<img
												src={getFilePreview(file)}
												alt={file.name}
												className='w-full h-full object-cover'
											/>
										) : (
											<div className='flex flex-col items-center justify-center p-3 w-full h-full'>
												{/* Documento desenhado com canto dobrado */}
												<svg
													className='w-full h-full max-w-[60%] max-h-[70%] text-[#8B8B7A]'
													viewBox='0 0 100 140'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'>
													{/* Contorno do documento */}
													<path 
														d='M 10 10 L 80 10 L 80 20 L 90 20 L 90 130 L 10 130 Z' 
														stroke='currentColor' 
														strokeWidth='2' 
														fill='none'
														strokeLinejoin='round'
													/>
													{/* Linha do canto dobrado */}
													<line x1='80' y1='10' x2='90' y2='20' stroke='currentColor' strokeWidth='2' />
													{/* Linhas de texto simuladas */}
													<line x1='20' y1='35' x2='75' y2='35' stroke='currentColor' strokeWidth='1.5' />
													<line x1='20' y1='50' x2='80' y2='50' stroke='currentColor' strokeWidth='1.5' />
													<line x1='20' y1='65' x2='70' y2='65' stroke='currentColor' strokeWidth='1.5' />
												</svg>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</div>

						{/* Caixa verde com informações - Centralizada */}
						<div className='lg:w-64 xl:w-72 flex-shrink-0 mx-auto lg:mx-0'>
							<div className='bg-gradient-to-br from-[#1EFF9D] to-[#1EFF9D] rounded-2xl p-3 md:p-4 pt-4 md:pt-5 pb-8 md:pb-10 flex flex-col'>
								{/* Ícone de alto-falante */}
								<div className='flex justify-center mb-3'>
									<div className='w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#0A1128] flex items-center justify-center'>
										<SpeakerHigh size={12} weight='fill' color='#1EFF9D' className='md:w-3.5 md:h-3.5' />
									</div>
								</div>

								{/* Texto explicativo */}
								<p className='text-sm md:text-base text-[#0A1128] leading-relaxed text-center flex-1 flex items-center font-bold'>
									{greenBoxText}
								</p>
							</div>
						</div>
					</div>

					{video && (
							<div className='flex flex-col items-end lg:w-[300px] xl:w-[350px] flex-shrink-0 lg:ml-8 xl:ml-12 -mt-12 md:-mt-14 lg:-mt-16'>
								<div className='bg-[#8156FF] rounded-2xl overflow-hidden relative w-full' style={{ aspectRatio: '3/4', height: 'auto' }}>
								{!isVideoPlaying ? (
									<>
										{video.thumbnail ? (
											<img
												src={video.thumbnail}
												alt={video.title || 'Video thumbnail'}
												className='w-full h-full object-cover'
											/>
										) : (
											<div className='w-full h-full bg-[#8156FF]'></div>
										)}
										{/* Botão de play preto centralizado */}
										<button
											type='button'
											onClick={() => setIsVideoPlaying(true)}
											className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all'>
											<div className='w-20 h-20 md:w-24 md:h-24 rounded-full bg-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform'>
												<Play size={40} weight='fill' color='#8156FF' className='ml-1' />
											</div>
										</button>
										{/* Banner com frase na parte inferior */}
										<div className='absolute bottom-0 left-0 right-0 bg-[#8156FF] px-4 py-4 md:py-5 flex items-center justify-center'>
											<button
												type='button'
												onClick={() => setIsVideoPlaying(true)}
												className='text-black font-bold text-sm md:text-base hover:opacity-90 transition-opacity'>
												Quer ver um vídeo sobre isso?
											</button>
										</div>
									</>
								) : (
									<video
										controls
										autoPlay
										className='w-full h-full'
										src={video.url}>
										Seu navegador não suporta o elemento de vídeo.
									</video>
								)}
							</div>
						</div>
					)}
				</div>

				{/* Botão Finalizar quiz ou Próxima pergunta - alinhado com o banner do vídeo */}
				<div className='flex justify-center ml-[320px] md:ml-[400px] -mt-16 md:-mt-20 lg:-mt-24'>
					<button
						type='button'
						onClick={onNext}
						className='bg-[#222325] hover:bg-[#2a2a2a] text-[#1EFF9D] font-bold rounded-full transition-all shadow-lg flex items-center gap-2 md:gap-3 justify-center px-6 md:px-8 py-3 md:py-4'>
						<span className='text-sm md:text-base'>{currentQuestion === totalQuestions ? 'Finalizar quiz' : 'Próxima pergunta'}</span>
						<div className='bg-[#1EFF9D] rounded-full p-1.5 md:p-2 flex items-center justify-center'>
							<ArrowRight size={16} weight='bold' color='#0A1128' className='md:w-5 md:h-5' />
						</div>
					</button>
				</div>
			</div>
		</div>
	);
};

