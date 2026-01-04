'use client';

import React, { FunctionComponent } from 'react';
import { Quiz } from '@/components/Quiz';

interface QuizPageProps {
	params: {
		slug: string;
	};
}

const QuizPage: FunctionComponent<QuizPageProps> = ({ params }) => {
	return (
		<section className='flex justify-center w-full min-h-screen bg-white px-[20px] md:px-[70px] md:pl-[150px] 3xl:pl-[190px] py-[50px]'>
			<div className='max-w-[1640px] w-full'>
				{/* Componente do Quiz */}
				<Quiz totalQuestions={5} currentQuestion={1} />
			</div>
		</section>
	);
};

export default QuizPage;

