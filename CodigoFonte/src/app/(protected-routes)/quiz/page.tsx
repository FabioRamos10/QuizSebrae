'use client';

import { FunctionComponent } from 'react';
import { Quiz } from '@/components/Quiz';

const QuizPage: FunctionComponent = () => {
	// Título do quiz baseado no encontro (pode vir de configuração)
	const quizTitle = 'Quiz Encontro 03';

	return (
		<section className='flex justify-center w-full min-h-screen bg-white px-[15px] sm:px-[20px] md:px-[70px] md:pl-[150px] 3xl:pl-[190px] py-[20px] sm:py-[30px] md:py-[40px] lg:py-[50px]'>
			<div className='max-w-[1640px] w-full'>
				{/* Componente do Quiz */}
				<Quiz totalQuestions={5} currentQuestion={1} />
			</div>
		</section>
	);
};

export default QuizPage;

