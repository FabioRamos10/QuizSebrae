'use client';

import { FunctionComponent } from 'react';
import { Quiz } from '@/components/Quiz';
import { QuizActivity } from '@/components/Quiz/Quiz.interface';

const QuizPage: FunctionComponent = () => {
	// Exemplo de atividade para a etapa 3
	const activities: QuizActivity[] = [
		{
			id: 3, // ID deve corresponder ao número da etapa
			activityTitle: 'Orçamento pessoal: equilibrando receitas e despesas',
			activityDescription:
				'Invista um tempo na elaboração do seu fluxo de receitas e despesas pessoais. Você pode usar uma planilha no computador, um caderno ou mesmo um aplicativo dedicado a isso. A forma pouco importa, o fundamental é que você faça, ajuste, aprimore e não desista!',
			suggestionLabel: 'Confira nossa sugestão:',
			downloadButtonText: 'Planilha de receitas e despesas',
			downloadUrl: '/arquivos/planilha-exemplo.xlsx', // Ajuste o caminho conforme necessário
			
			 video: {
			 	thumbnail: 'https://via.placeholder.com/400x225/9333EA/FFFFFF?text=Video+Thumbnail',
			 	url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
			 	title: 'Vídeo sobre orçamento pessoal',
			 },
		},
	];

	const handleActivitySubmit = (activityId: number, files: File[]) => {
		console.log('Arquivos enviados para atividade:', activityId, files);
	};

	return (
		<section className='flex justify-center w-full min-h-screen bg-white px-[15px] sm:px-[20px] md:px-[70px] md:pl-[150px] 3xl:pl-[190px] py-[20px] sm:py-[30px] md:py-[40px] lg:py-[50px]'>
			<div className='max-w-[1640px] w-full'>
				{/* Componente do Quiz */}
				{/* 
					Etapa 1: Pergunta (automática quando currentQuestion=1)
					Etapa 2: Pergunta (automática quando currentQuestion=2)
					Etapa 3: Atividade com upload (quando currentQuestion=3 e activities contém id=3)
					Etapa 4+: Mais perguntas (automáticas)
				*/}
				<Quiz
					totalQuestions={5}
					currentQuestion={1}
					activities={activities}
					onActivitySubmit={handleActivitySubmit}
				/>
			</div>
		</section>
	);
};

export default QuizPage;

