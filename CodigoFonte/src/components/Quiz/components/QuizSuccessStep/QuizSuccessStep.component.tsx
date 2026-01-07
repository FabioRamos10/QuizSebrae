'use client';

import React, { FunctionComponent } from 'react';
import { CheckCircle, X, CaretLeft, CaretRight, Check, UsersThree, CurrencyDollar } from 'phosphor-react';

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
    onPrevious?: () => void;
    onNext?: () => void;
}

/**
 * **QuizSuccessStep**
 *
 * Componente que exibe a tela de sucesso após o envio do quiz completo.
 * Mostra todas as respostas do usuário com indicadores visuais.
 *
 * @component
 */
export const QuizSuccessStep: FunctionComponent<QuizSuccessStepProps> = ({ answers, quizTitle = 'Quiz Encontro 03', onPrevious, onNext }) => {
    // Debug: verificar respostas recebidas
    console.log('QuizSuccessStep - Answers recebidas:', answers);
    console.log('QuizSuccessStep - Resposta Orçamento pessoal:', answers.find(a => a.question.includes('Orçamento pessoal')));
    
    // CORREÇÃO: Força todas as respostas "Orçamento pessoal" para tipo 'activity' e remove duplicatas
    const seenOrcamentoPessoal = new Set<number>();
    const correctedAnswers = answers
        .map(answer => {
            if (answer.question.includes('Orçamento pessoal')) {
                // Se já vimos uma resposta "Orçamento pessoal", pula esta (remove duplicata)
                if (seenOrcamentoPessoal.has(answer.id)) {
                    return null;
                }
                seenOrcamentoPessoal.add(answer.id);
                
                console.log('Corrigindo resposta Orçamento pessoal:', {
                    antes: { type: answer.type, activityFiles: answer.activityFiles, textAnswer: answer.textAnswer },
                    depois: { type: 'activity', activityFiles: answer.activityFiles || 0 }
                });
                // FORÇA o tipo para activity e remove propriedades de texto
                const corrected = {
                    ...answer,
                    type: 'activity' as const,
                    activityFiles: answer.activityFiles || 0,
                };
                // Remove explicitamente textAnswer e audioFiles
                delete (corrected as any).textAnswer;
                delete (corrected as any).audioFiles;
                return corrected;
            }
            return answer;
        })
        .filter((answer): answer is QuizAnswer => answer !== null);
    
    // Reorganiza as respostas:
    // 1. "Qual é uma vantagem..." com ícone de pessoas (correta) - posição 1
    // 2. "Qual é uma vantagem..." com ícone de dinheiro (incorreta) - posição 2
    // 3. "Conte em poucas palavras..." - posição 3
    // 4. Atividades mantidas nas posições seguintes
    const reorganizedAnswers = [...correctedAnswers];
    
    // Encontra as respostas por tipo
    const correctAnswer = reorganizedAnswers.find(
        (a) => a.type === 'multiple-choice' && a.isCorrect && a.question.includes('Qual é uma vantagem')
    );
    const incorrectAnswer = reorganizedAnswers.find(
        (a) => a.type === 'multiple-choice' && !a.isCorrect && a.question.includes('Qual é uma vantagem')
    );
    const subjectiveAnswer = reorganizedAnswers.find(
        (a) => a.type === 'text' && a.question.includes('Conte em poucas palavras')
    );
    const activityAnswer = reorganizedAnswers.find(
        (a) => a.type === 'activity'
    );
    
    // Reorganiza: [correta, incorreta, subjetiva, atividade, ...outras]
    const otherAnswers = reorganizedAnswers.filter(
        (a) => a !== correctAnswer && 
              a !== incorrectAnswer && 
              a !== subjectiveAnswer && 
              a !== activityAnswer
    );
    
    // Sempre reorganiza se houver pelo menos uma resposta para reorganizar
    if (correctAnswer || incorrectAnswer || subjectiveAnswer || activityAnswer) {
        reorganizedAnswers.length = 0;
        if (correctAnswer) reorganizedAnswers.push(correctAnswer);
        if (incorrectAnswer) reorganizedAnswers.push(incorrectAnswer);
        if (subjectiveAnswer) reorganizedAnswers.push(subjectiveAnswer);
        if (activityAnswer) reorganizedAnswers.push(activityAnswer);
        reorganizedAnswers.push(...otherAnswers);
    }
    
    const finalAnswers = reorganizedAnswers;
    
    return (
        <div className='w-full'>
            {/* Barra de navegação do Quiz (Estilo Pill com bolinhas dentro) */}
            <div className='flex items-center justify-start mb-6 md:mb-8'>
                {/* Barra central: fundo cinza escuro arredondado com bolinhas dentro */}
                <div className='bg-[#222325] rounded-full px-2 py-1 md:px-2.5 md:py-1.5 flex items-center justify-between gap-3 md:gap-4 shadow-sm'>
                    {/* Botão esquerdo: bolinha verde dentro da barra (decorativo) */}
                    <div className='w-10 h-10 rounded-full bg-[#4ade80] flex items-center justify-center flex-shrink-0 shadow-md -ml-1 md:-ml-1.5'>
                        <CaretLeft size={20} weight='bold' color='#2d3748' />
                    </div>

                    {/* Texto central */}
                    <span className='text-base md:text-lg font-medium text-white whitespace-nowrap px-2 md:px-3'>
                        {quizTitle}
                    </span>

                    {/* Botão direito: bolinha verde dentro da barra (decorativo) */}
                    <div className='w-10 h-10 rounded-full bg-[#4ade80] flex items-center justify-center flex-shrink-0 shadow-md -mr-1 md:-mr-1.5'>
                        <CaretRight size={20} weight='bold' color='#2d3748' />
                    </div>
                </div>
            </div>

            {/* Título principal */}
            <h1 className='text-2xl md:text-3xl lg:text-4xl text-[#070D26] mb-8 md:mb-12'>
                <span className='font-bold'>Quiz enviado</span> com sucesso!
            </h1>

            <div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
                {/* Conteúdo principal - Suas respostas */}
                <div className='flex-1'>
                    <h2 className='text-xl md:text-2xl font-bold text-[#070D26] mb-6'>
                        Suas respostas
                    </h2>

                    <div className='relative pl-14'>
                        {/* Barra vertical contínua */}
                        <div className='absolute left-5 top-0 bottom-0 w-[2px] bg-[#E5E7EB]'></div>
                        
                        <div className='space-y-4'>
                            {finalAnswers.map((answer, index) => {
                                // Debug para "Orçamento pessoal"
                                const isOrcamentoPessoal = answer.question.includes('Orçamento pessoal');
                                if (isOrcamentoPessoal) {
                                    console.log('Renderizando Orçamento pessoal:', {
                                        type: answer.type,
                                        activityFiles: answer.activityFiles,
                                        textAnswer: answer.textAnswer,
                                        hasAudioFiles: !!answer.audioFiles
                                    });
                                }
                                
                                // Todas as bolinhas centralizadas na barra
                                const circleLeft = '-55px';
                                return (
                                <div key={answer.id} className='flex items-start gap-4 relative'>
                                    {/* Bolinha com número - centralizada na barra */}
                                    <div 
                                        className='absolute z-10' 
                                        style={{ 
                                            left: `${circleLeft}`,
                                            top: '32px'
                                        }}
                                    >
                                        <div className='w-10 h-10 rounded-full bg-white border-2 border-[#E5E7EB] flex items-center justify-center font-bold text-[#070D26]'>
                                            {index + 1}
                                        </div>
                                    </div>
                                    
                                    {/* Card de resposta */}
                                    <div className='flex-1 max-w-4xl bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4 md:p-6 relative'>
                                        {/* Bolinha verde com checkmark no canto superior esquerdo (apenas para resposta correta) */}
                                        {answer.type === 'multiple-choice' && answer.isCorrect && (
                                            <div className='absolute -top-2 -left-2 w-8 h-8 bg-[#4ade80] rounded-full flex items-center justify-center z-20 shadow-md'>
                                                <Check size={16} weight='bold' color='#070D26' />
                                            </div>
                                        )}
                                        {/* Bolinha coral com X no canto superior esquerdo (apenas para resposta incorreta) */}
                                        {answer.type === 'multiple-choice' && (answer.isCorrect === false || !answer.isCorrect) && (
                                            <div className='absolute -top-2 -left-2 w-8 h-8 bg-[#FF6F61] rounded-full flex items-center justify-center z-20 shadow-md'>
                                                <X size={16} weight='bold' color='#070D26' />
                                            </div>
                                        )}
                                        
                                        {/* Conteúdo da resposta */}
                                        <div className='flex items-center'>
                                            {/* Pergunta à esquerda */}
                                            <div className='flex-1 max-w-[40%]'>
                                                <p className='text-base md:text-lg text-[#070D26] mb-3 font-medium'>
                                                    {answer.question.includes('Qual é uma vantagem de divulgar') ? (
                                                        <>
                                                            Qual é uma vantagem de divulgar<br />
                                                            seu negócio nas redes sociais?
                                                        </>
                                                    ) : (
                                                        answer.question
                                                    )}
                                                </p>
                                            </div>

                                            {/* Atividade com arquivos - SEMPRE renderiza se for "Orçamento pessoal" */}
                                            {(answer.type === 'activity' || isOrcamentoPessoal) && (
                                                <div className='flex items-center gap-3 flex-shrink-0 ml-1'>
                                                    {/* Box de arquivos igual ao QuizActivityFeedbackStep */}
                                                    <div className='max-w-[20rem]'>
                                                        <div className='border-2 border-[#1EFF9D] rounded-2xl p-3 md:p-4 pt-5 md:pt-6 pb-14 md:pb-16 flex flex-col bg-transparent'>
                                                            <div className='flex items-center justify-between mb-5'>
                                                                <span className='text-sm md:text-base font-medium text-[#1EFF9D]'>Seus arquivos enviados</span>
                                                                <span className='text-sm md:text-base font-bold text-[#1EFF9D]'>{(answer.activityFiles || 0) > 0 ? answer.activityFiles : 8}</span>
                                                            </div>
                                                            {/* Linha divisória verde - vai até o final em ambos os lados */}
                                                            <div className='h-0.5 bg-[#1EFF9D] mb-5 -mx-3 md:-mx-4'></div>
                                                            {/* Grid de thumbnails */}
                                                            <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4'>
                                                                {[...Array((answer.activityFiles || 0) > 0 ? answer.activityFiles : 8)].map((_, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className='aspect-[3/4] rounded-lg overflow-hidden bg-[#F5F5F0] border-2 border-dashed border-[#D0D0D0] flex items-center justify-center shadow-sm'
                                                                    >
                                                                        {/* Documento desenhado com canto dobrado */}
                                                                        <div className='flex flex-col items-center justify-center p-3 w-full h-full'>
                                                                            <svg
                                                                                className='w-full h-full max-w-[60%] max-h-[70%] text-[#8B8B7A]'
                                                                                viewBox='0 0 100 140'
                                                                                fill='none'
                                                                                xmlns='http://www.w3.org/2000/svg'
                                                                            >
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
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Resposta múltipla escolha - NÃO renderiza se for "Orçamento pessoal" */}
                                            {answer.type === 'multiple-choice' && !answer.question.includes('Orçamento pessoal') && (
                                                <div className='flex items-center gap-3 flex-shrink-0 ml-1'>
                                                    {answer.isCorrect ? (
                                                        <>
                                                            {/* Resposta correta com quadradinho verde retangular */}
                                                            <div className='flex items-center gap-3 bg-[#4ade80] rounded-lg p-3 md:p-4 min-w-[280px]'>
                                                                <UsersThree size={24} weight='fill' color='#070D26' />
                                                                <p className='text-sm md:text-base text-[#070D26] font-medium'>
                                                                    {answer.selectedAnswer}
                                                                </p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* Resposta incorreta com fundo coral e ícone de dinheiro */}
                                                            <div className='flex flex-col gap-3'>
                                                                <div className='flex items-center gap-3 bg-[#FF6F61] rounded-lg p-3 md:p-4 min-w-[280px]'>
                                                                    <img 
                                                                        src='/IMG_1552.PNG' 
                                                                        alt='Ícone de dinheiro' 
                                                                        className='w-6 h-6 flex-shrink-0'
                                                                        style={{ filter: 'brightness(0) saturate(100%)' }}
                                                                    />
                                                                    <p className='text-sm md:text-base text-[#070D26] font-medium'>
                                                                        {answer.selectedAnswer}
                                                                    </p>
                                                                </div>
                                                                {/* Box com resposta correta - azul escuro com ícone de pessoas */}
                                                                {answer.correctAnswer && (
                                                                    <div className='bg-[#070D26] rounded-lg p-3 md:p-4 min-w-[280px]'>
                                                                        <p className='text-xs md:text-sm font-bold text-[#1EFF9D] mb-2'>
                                                                            Resposta correta:
                                                                        </p>
                                                                        <div className='flex items-center gap-3'>
                                                                            <UsersThree size={24} weight='fill' color='#1EFF9D' />
                                                                            <p className='text-sm md:text-base text-[#1EFF9D] font-medium'>
                                                                                {answer.correctAnswer}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {/* Bolinha de interrogação no canto superior direito */}
                                            <button
                                                type='button'
                                                className='absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-[#E5E7EB] transition-colors z-10'
                                            >
                                                <span className='text-[#6B7280] font-bold text-lg'>?</span>
                                            </button>

                                            {/* Resposta de texto com áudio - NÃO renderiza se for "Orçamento pessoal" */}
                                            {answer.type === 'text' && !isOrcamentoPessoal && (
                                                <div className='flex items-center gap-3 flex-shrink-0 ml-1'>
                                                    <div className='bg-white rounded-lg border border-[#E5E7EB] p-4 md:p-6 min-w-[280px]'>
                                                        {/* Texto da resposta (transcrição se houver áudio) */}
                                                        {answer.textAnswer && (
                                                            <p className='text-sm md:text-base text-[#070D26] mb-4'>
                                                                {answer.textAnswer}
                                                            </p>
                                                        )}
                                                        {/* Players de áudio */}
                                                        {answer.audioFiles && answer.audioFiles.length > 0 && (
                                                            <div className='space-y-3'>
                                                                {answer.audioFiles.map((audio: { url: string; duration: string }, audioIndex: number) => (
                                                                    <div
                                                                        key={audioIndex}
                                                                        className='bg-[#F9FAFB] rounded-lg p-3 md:p-4 flex items-center gap-3'
                                                                    >
                                                                        <button
                                                                            type='button'
                                                                            className='w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center hover:bg-[#059669] transition-colors flex-shrink-0'
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
                                                                        <span className='text-xs md:text-sm text-[#6B7280] font-medium flex-shrink-0'>
                                                                            {audio.duration}
                                                                        </span>
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
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar direita - Retorno em breve - COM FUNDO BRANCO */}
                <div className='lg:w-80 xl:w-96 flex-shrink-0'>
                    <div 
                        className='rounded-lg shadow-sm border border-[#E5E7EB] p-6'
                        style={{
                            backgroundColor: '#FFFFFF',
                            background: '#FFFFFF',
                        }}
                    >
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
