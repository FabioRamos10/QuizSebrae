'use client';

import React, { FunctionComponent } from 'react';
import { CheckCircle, X, Question, CaretLeft, CaretRight } from 'phosphor-react';

export interface QuizAnswer {
    id: number;
    question: string;
    type: 'multiple-choice' | 'text' | 'activity';
    isCorrect?: boolean;
    selectedAnswer?: string;
    correctAnswer?: string;
    textAnswer?: string;
    audioFiles?: { url: string; duration: string }[];
    activityFiles?: number;
}

interface QuizSuccessStepProps {
    answers: QuizAnswer[];
    quizTitle?: string;
}

/**
 * **QuizSuccessStep**
 *
 * Componente que exibe a tela de sucesso após o envio do quiz completo.
 * Mostra todas as respostas do usuário com indicadores visuais.
 * * Atualização: Header ajustado para estilo "Pill" sobreposto.
 *
 * @component
 */
export const QuizSuccessStep: FunctionComponent<QuizSuccessStepProps> = ({ answers, quizTitle = 'Quiz Encontro 03' }) => {
    return (
        <div className='w-full'>
            {/* Barra de navegação do Quiz (Estilo Pill Sobreposto) */}
            <div className='flex items-center justify-center mb-6 md:mb-8'>
                <div className='relative flex items-center'>
                    {/* Botão esquerdo: bolinha verde sobreposta */}
                    <button
                        type='button'
                        className='w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#06EBBD] flex items-center justify-center hover:bg-[#05D4A8] transition-colors flex-shrink-0 relative z-20 -mr-5 md:-mr-6 shadow-md'
                    >
                        <CaretLeft size={20} weight='bold' color='#070D26' />
                    </button>

                    {/* Barra central: fundo cinza escuro arredondado */}
                    <div className='bg-[#222325] rounded-full px-8 py-2.5 md:px-12 md:py-3 flex items-center relative z-10 shadow-sm'>
                        <span className='text-base md:text-lg font-medium text-white whitespace-nowrap'>
                            {quizTitle}
                        </span>
                    </div>

                    {/* Botão direito: bolinha verde sobreposta */}
                    <button
                        type='button'
                        className='w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#06EBBD] flex items-center justify-center hover:bg-[#05D4A8] transition-colors flex-shrink-0 relative z-20 -ml-5 md:-ml-6 shadow-md'
                    >
                        <CaretRight size={20} weight='bold' color='#070D26' />
                    </button>
                </div>
            </div>

            {/* Título principal */}
            <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-[#070D26] mb-8 md:mb-12'>
                Quiz enviado com sucesso!
            </h1>

            <div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
                {/* Conteúdo principal - Suas respostas */}
                <div className='flex-1'>
                    <h2 className='text-xl md:text-2xl font-bold text-[#070D26] mb-6'>
                        Suas respostas
                    </h2>

                    <div className='space-y-4'>
                        {answers.map((answer, index) => (
                            <div
                                key={answer.id}
                                className='bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4 md:p-6 flex items-start gap-4'
                            >
                                {/* Número da questão */}
                                <div className='flex-shrink-0 w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center font-bold text-[#070D26]'>
                                    {index + 1}
                                </div>

                                {/* Conteúdo da resposta */}
                                <div className='flex-1'>
                                    {/* Pergunta */}
                                    <p className='text-base md:text-lg text-[#070D26] mb-3 font-medium'>
                                        {answer.question}
                                    </p>

                                    {/* Resposta múltipla escolha */}
                                    {answer.type === 'multiple-choice' && (
                                        <div className='space-y-3'>
                                            {answer.isCorrect ? (
                                                <>
                                                    {/* Resposta correta */}
                                                    <div className='flex items-center gap-3'>
                                                        <CheckCircle size={24} weight='fill' color='#10B981' />
                                                        <p className='text-sm md:text-base text-[#10B981] font-medium'>
                                                            {answer.selectedAnswer}
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Resposta incorreta */}
                                                    <div className='flex items-center gap-3 mb-3'>
                                                        <X size={24} weight='fill' color='#EF4444' />
                                                        <p className='text-sm md:text-base text-[#F97316] font-medium'>
                                                            {answer.selectedAnswer}
                                                        </p>
                                                    </div>
                                                    {/* Box com resposta correta */}
                                                    {answer.correctAnswer && (
                                                        <div className='bg-[#065F46] rounded-lg p-3 md:p-4'>
                                                            <p className='text-xs md:text-sm font-bold text-white mb-2'>
                                                                Resposta correta:
                                                            </p>
                                                            <p className='text-sm md:text-base text-white'>
                                                                {answer.correctAnswer}
                                                            </p>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Resposta de texto com áudio */}
                                    {answer.type === 'text' && (
                                        <div className='space-y-4'>
                                            <p className='text-sm md:text-base text-[#070D26] mb-4'>
                                                {answer.textAnswer}
                                            </p>
                                            {/* Players de áudio */}
                                            {answer.audioFiles && answer.audioFiles.length > 0 && (
                                                <div className='space-y-3'>
                                                    {answer.audioFiles.map((audio, audioIndex) => (
                                                        <div
                                                            key={audioIndex}
                                                            className='bg-[#F9FAFB] rounded-lg p-3 md:p-4 flex items-center gap-3'
                                                        >
                                                            <button
                                                                type='button'
                                                                className='w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center hover:bg-[#059669] transition-colors'
                                                            >
                                                                <svg
                                                                    width='20'
                                                                    height='20'
                                                                    viewBox='0 0 24 24'
                                                                    fill='none'
                                                                    xmlns='http://www.w3.org/2000/svg'
                                                                >
                                                                    <path
                                                                        d='M8 5v14l11-7z'
                                                                        fill='white'
                                                                    />
                                                                </svg>
                                                            </button>
                                                            {/* Waveform visual */}
                                                            <div className='flex-1 flex items-center gap-1 h-8'>
                                                                {[...Array(20)].map((_, i) => {
                                                                    // Valores fixos para o waveform (simulando ondas de áudio)
                                                                    const heights = [45, 30, 60, 25, 50, 35, 55, 40, 30, 50, 45, 35, 60, 25, 50, 40, 55, 30, 45, 50];
                                                                    return (
                                                                        <div
                                                                            key={i}
                                                                            className='flex-1 bg-[#10B981] rounded-sm'
                                                                            style={{
                                                                                height: `${heights[i % heights.length]}%`,
                                                                            }}
                                                                        />
                                                                    );
                                                                })}
                                                            </div>
                                                            <span className='text-xs md:text-sm text-[#6B7280] font-medium'>
                                                                {audio.duration}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Atividade com arquivos */}
                                    {answer.type === 'activity' && (
                                        <div className='space-y-3'>
                                            <div className='flex items-center justify-between mb-3'>
                                                <p className='text-sm md:text-base font-bold text-[#070D26]'>
                                                    Seus arquivos enviados
                                                </p>
                                                {answer.activityFiles !== undefined && (
                                                    <span className='text-sm md:text-base text-[#6B7280]'>
                                                        {answer.activityFiles}
                                                    </span>
                                                )}
                                            </div>
                                            {/* Grid de thumbnails de documentos */}
                                            <div className='grid grid-cols-4 gap-2 md:gap-3'>
                                                {[...Array(answer.activityFiles || 8)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className='aspect-[3/4] bg-[#F5F5F0] border-2 border-dashed border-[#D0D0D0] rounded-lg flex items-center justify-center p-2'
                                                    >
                                                        <svg
                                                            width='100%'
                                                            height='100%'
                                                            viewBox='0 0 100 133'
                                                            xmlns='http://www.w3.org/2000/svg'
                                                        >
                                                            {/* Página */}
                                                            <rect
                                                                x='5'
                                                                y='5'
                                                                width='90'
                                                                height='123'
                                                                rx='2'
                                                                fill='white'
                                                                stroke='#D0D0D0'
                                                                strokeWidth='1'
                                                            />
                                                            {/* Canto dobrado */}
                                                            <path
                                                                d='M 85 5 L 85 20 L 95 20 Z'
                                                                fill='#E5E7EB'
                                                                stroke='#D0D0D0'
                                                                strokeWidth='1'
                                                            />
                                                            <line
                                                                x1='85'
                                                                y1='20'
                                                                x2='95'
                                                                y2='20'
                                                                stroke='#D0D0D0'
                                                                strokeWidth='1'
                                                            />
                                                            {/* Linhas de texto simuladas */}
                                                            {[...Array(8)].map((_, lineIndex) => {
                                                                // Valores fixos para as linhas de texto
                                                                const lineLengths = [80, 75, 82, 70, 78, 73, 85, 72];
                                                                return (
                                                                    <line
                                                                        key={lineIndex}
                                                                        x1='15'
                                                                        y1={25 + lineIndex * 12}
                                                                        x2={lineLengths[lineIndex % lineLengths.length]}
                                                                        y2={25 + lineIndex * 12}
                                                                        stroke='#9CA3AF'
                                                                        strokeWidth='1.5'
                                                                        strokeLinecap='round'
                                                                    />
                                                                );
                                                            })}
                                                        </svg>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Ícone de interrogação */}
                                <button
                                    type='button'
                                    className='flex-shrink-0 w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-[#E5E7EB] transition-colors'
                                >
                                    <Question size={18} weight='fill' color='#6B7280' />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar direita - Retorno em breve */}
                <div className='lg:w-80 xl:w-96 flex-shrink-0'>
                    <div className='bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6'>
                        <h3 className='text-xl md:text-2xl font-bold text-[#070D26] mb-4'>
                            Retorno em breve!
                        </h3>
                        <div className='space-y-4 text-sm md:text-base text-[#6B7280] leading-relaxed'>
                            <p>
                                Suas respostas foram enviadas para o facilitador, que vai ler e te dar um retorno em breve.
                            </p>
                            <p>
                                Com essa atividade, o facilitador vai confirmar sua presença nesta aula.
                            </p>
                            <p className='font-medium text-[#070D26]'>
                                Parabéns por participar ativamente!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};