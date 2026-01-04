'use client';

import React, { FunctionComponent, useState, useRef, useEffect } from 'react';
import { QuizQuestion } from '../../Quiz.interface';
import { ArrowRight, Microphone, MicrophoneSlash, Trash } from 'phosphor-react';
import { BaseModal } from '@/components/BaseModal';
import { ModalButton } from '@/components/AppointmentModal/AppointmentModal.styles';
import { Divider, Box } from '@mui/material';

interface QuizSubjectiveQuestionStepProps {
	question: QuizQuestion;
	currentQuestion: number;
	totalQuestions: number;
	answer?: string;
	audioBlobs?: Blob[];
	onAnswerChange: (answer: string) => void;
	onAudioChange?: (audioBlobs: Blob[]) => void;
	onConfirmAnswer?: () => void;
}

export const QuizSubjectiveQuestionStep: FunctionComponent<QuizSubjectiveQuestionStepProps> = ({
	question,
	currentQuestion,
	totalQuestions,
	answer,
	audioBlobs: externalAudioBlobs = [],
	onAnswerChange,
	onAudioChange,
	onConfirmAnswer,
}) => {
	const [isRecording, setIsRecording] = useState(false);
	const [audioBlobs, setAudioBlobs] = useState<Blob[]>(externalAudioBlobs || []);
	const [confirmModalOpen, setConfirmModalOpen] = useState(false);
	const [audioIndexToRemove, setAudioIndexToRemove] = useState<number | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);

	const handleStartRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			
			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				const mimeType = mediaRecorder.mimeType || 'audio/webm'; 
				const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

				setAudioBlobs((prevAudioBlobs) => {
					const newAudioBlobs = [...prevAudioBlobs, audioBlob];
					
					setTimeout(() => {
						if (onAudioChange) onAudioChange(newAudioBlobs);
					}, 0);

					return newAudioBlobs;
				});

				stream.getTracks().forEach(track => track.stop());
			};

			mediaRecorder.start();
			setIsRecording(true);

		} catch (error) {
			console.error('Erro ao iniciar gravação:', error);
			alert('Não foi possível acessar o microfone. Verifique as permissões.');
		}
	};

	const handleStopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
			setIsRecording(false);
		}
	};

	const handleToggleRecording = () => {
		if (isRecording) {
			handleStopRecording();
		} else {
			handleStartRecording();
		}
	};

	// Sincronizar áudios externos
	useEffect(() => {
		if (externalAudioBlobs !== undefined) {
			setAudioBlobs(externalAudioBlobs);
		}
	}, [externalAudioBlobs]);

	const handleOpenConfirmModal = (index: number) => {
		setAudioIndexToRemove(index);
		setConfirmModalOpen(true);
	};

	const handleCloseConfirmModal = () => {
		setConfirmModalOpen(false);
		setAudioIndexToRemove(null);
	};

	const handleConfirmRemove = () => {
		if (audioIndexToRemove !== null) {
			const newAudioBlobs = audioBlobs.filter((_, i) => i !== audioIndexToRemove);
			setAudioBlobs(newAudioBlobs);
			if (onAudioChange) {
				onAudioChange(newAudioBlobs);
			}
		}
		handleCloseConfirmModal();
	};
	
	return (
		<div className='w-full max-w-full overflow-x-hidden box-border'>
			<div className='mb-6 md:mb-8'>
				<div className='flex flex-col md:flex-row md:items-center gap-3 md:gap-0 mb-3 md:mb-4'>
					<p className='text-base md:text-lg text-[#6E707A] font-regular md:mr-4 flex-shrink-0'>Perguntas</p>
					<div className='flex items-center w-full md:flex-1 md:w-auto overflow-hidden'>
						<div className='flex items-center w-full gap-1 sm:gap-1.5 md:gap-2 min-w-0'>
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
													isCompleted || isActive ? 'bg-[#1EFF9D]' : 'bg-[#D0D1D4]'
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

			<div className='bg-gradient-to-b from-[#1EFF9D] to-[#14E48A] rounded-2xl p-4 md:p-5 lg:p-6 xl:p-8 max-w-full overflow-x-hidden box-border'>
				<div className='flex items-start gap-2 md:gap-3 lg:gap-4 mb-4 md:mb-6 lg:mb-8 min-w-0'>
					<div className='flex-shrink-0 mt-0.5 md:mt-1'>
						<svg width='20' height='20' className='md:w-6 md:h-6 flex-shrink-0' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
							<circle cx='12' cy='12' r='8' fill='#070D26' />
						</svg>
					</div>
					<p className='text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-[#070D26] font-bold flex-1 leading-tight break-words min-w-0' style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
						{question.question}
					</p>
				</div>

				{question.instruction && (
					<div className='mb-4 md:mb-6'>
						<p className='text-sm md:text-base lg:text-lg text-[#070D26] font-regular leading-relaxed break-words' style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
							{question.instruction}
						</p>
					</div>
				)}

				<div className='mb-4 md:mb-6 max-w-full'>
					<div className='relative max-w-full box-border'>
						<textarea
							value={answer || ''}
							onChange={(e) => onAnswerChange(e.target.value)}
							placeholder='Escreva sua resposta aqui ou grave um áudio'
							maxLength={1000}
							className='w-full min-h-[120px] md:min-h-[150px] lg:min-h-[180px] max-h-[300px] md:max-h-[400px] rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 text-sm md:text-base lg:text-lg text-[#070D26] bg-white border-2 border-white focus:border-[#070D26] focus:outline-none resize-none placeholder:text-[#6E707A] overflow-y-auto overflow-x-hidden break-words whitespace-pre-wrap box-border'
							style={{ wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '100%', boxSizing: 'border-box' }}
							rows={6}
							wrap='soft'
						/>
						<button
							type='button'
							onClick={handleToggleRecording}
							className={`absolute bottom-4 right-4 p-3 md:p-4 rounded-full transition-all shadow-lg ${
								isRecording
									? 'bg-[#FF6F61] hover:bg-[#FF5A4A] text-white'
									: 'bg-[#070D26] hover:bg-[#0a1424] text-[#1EFF9D]'
							}`}>
							{isRecording ? (
								<MicrophoneSlash size={24} weight='fill' className='md:w-6 md:h-6' />
							) : (
								<Microphone size={24} weight='fill' className='md:w-6 md:h-6' />
							)}
						</button>
					</div>
					{isRecording && (
						<div className='mt-2 flex items-center gap-2'>
							<div className='w-2 h-2 bg-[#FF6F61] rounded-full animate-pulse'></div>
							<p className='text-sm text-[#FF6F61] font-regular'>Gravando...</p>
						</div>
					)}
					{audioBlobs.length > 0 && !isRecording && (
						<div className='mt-3 space-y-3'>
							{audioBlobs.map((audioBlob, index) => (
								<div key={index} className='p-3 bg-white rounded-lg border-2 border-[#1EFF9D] flex items-center gap-3'>
									<audio controls className='flex-1'>
										<source src={URL.createObjectURL(audioBlob)} type='audio/wav' />
										Seu navegador não suporta o elemento de áudio.
									</audio>
									<button
										type='button'
										onClick={() => handleOpenConfirmModal(index)}
										className='p-2 text-[#FF6F61] hover:text-[#FF5A4A] transition-colors flex-shrink-0'>
										<Trash size={20} weight='regular' />
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				{((answer && answer.trim().length > 0) || audioBlobs.length > 0) && onConfirmAnswer && (
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

			<BaseModal
				width='500px'
				open={confirmModalOpen}
				onClose={handleCloseConfirmModal}
				header={
					<h3 className='text-[#070D26] text-2xl md:text-3xl font-bold mb-4'>
						Confirmar <span className='font-light'>remoção</span>
					</h3>
				}
				footer={
					<Box className='flex gap-3 justify-center'>
						<ModalButton 
							onClick={handleCloseConfirmModal} 
							className='!m-0 !justify-center !px-6'
							sx={{
								paddingRight: '24px !important',
								paddingLeft: '24px !important',
								justifyContent: 'center',
							}}
						>
							<span className='text-base font-bold text-[#1EFF9D]'>
								Cancelar
							</span>
						</ModalButton>
						<ModalButton 
							onClick={handleConfirmRemove} 
							className='!m-0 !bg-[#FF6F61] hover:!bg-[#FF5A4A] !justify-center !px-6'
							sx={{
								paddingRight: '24px !important',
								paddingLeft: '24px !important',
								justifyContent: 'center',
							}}
						>
							<span className='text-base font-bold text-white'>
								Remover
							</span>
						</ModalButton>
					</Box>
				}>
				<Divider />
				<div className='text-center mt-6 mb-6'>
					<p className='text-[#070D26] text-base md:text-lg'>
						Tem certeza que deseja remover este áudio?
						<br />
						<strong>Esta ação não poderá ser desfeita.</strong>
					</p>
				</div>
				<Divider />
			</BaseModal>
		</div>
	);
};

