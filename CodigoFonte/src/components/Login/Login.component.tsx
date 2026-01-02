'use client';

import * as React from 'react';
import { useEffect, useState, type FunctionComponent } from 'react';
import {
	Content,
	FieldWrapper,
	ImageCover,
	Label,
	Section,
	Submit,
} from './Login.styles';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { cpfMask } from '@/utils/cpfMask';
import Image from 'next/image';
import Link from 'next/link';
import { WPImage } from '@/types/IWordpress';
import { GlobalThis } from 'global-this';

interface LoginProps {
	/**
	 * Dados da página de login incluindo banner, logo e informações do curso
	 */
	pageData: {
		banner: WPImage | null;
		logo: WPImage | null;
		course_id: string | number | null;
		title?: string;
		excerpt?: string;
		slug?: string;
	};
	/**
	 * Tipo de usuário acessando o login (afeta o texto exibido)
	 */
	userType?: 'supervisor' | 'facilitador' | 'participante' | null;
	/**
	 * Host/domínio da aplicação
	 */
	host?: string | null;
}

/**
 * **Login**
 *
 * ### 🧩 Funcionalidade
 * - Página completa de autenticação com design split-screen.
 * - Exibe banner, logo e informações do curso.
 * - Gerencia login via CPF, redireciona para /home após sucesso.
 * - Integra next-auth para sessão.
 * - Adapta texto baseado no userType (participante, facilitador).
 * - Suporte a projetos (Sebrae, Essência) com nomes customizados.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <Login
 *   pageData={{
 *     banner: bannerImage,
 *     logo: logoImage,
 *     course_id: 123,
 *     title: "Curso Exemplo"
 *   }}
 *   userType="participante"
 *   host="example.com"
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - Layout split-screen com ImageCover e Content.
 * - Formulário com campos CPF, botão submit.
 * - Tipografia responsiva com classes Tailwind.
 * - Links para privacidade e marca parceira.
 * - Fundo genérico se banner não disponível.
 *
 * @component
 */
export const Login: FunctionComponent<LoginProps> = ({
	pageData,
	userType,
	host,
}) => {
	const router = useRouter();

	const [user, setUser] = useState<string>('');
	const [pass, setPass] = useState<string>('');
	const [error, setError] = useState<boolean>(false);
	const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState('');
	const [projectName, setProjectName] = useState('');

	useEffect(() => {
		const url = (globalThis as GlobalThis).privacyPolicyUrl ?? '';
		setPrivacyPolicyUrl(url);

		const name = (globalThis as GlobalThis).projectName ?? '';
		setProjectName(name);
	}, []);

	const { banner, logo, course_id, title, excerpt } = pageData;

	async function handleLogin(event: React.SyntheticEvent) {
		if (course_id) {
			localStorage.setItem('course_id', `${course_id}`);
		}
		if (userType === 'supervisor' || userType === 'facilitador') {
			localStorage.removeItem('isParticipantMode');
		}

		event.preventDefault();
		
		// Remove todos os caracteres não numéricos
		const cpfOnlyNumbers = user.replace(/\D/g, '');
		
		// Valida se o CPF tem exatamente 11 dígitos
		if (cpfOnlyNumbers.length !== 11) {
			setError(true);
			return;
		}

		// Garante que o CPF tenha exatamente 11 dígitos (preserva zeros à esquerda)
		// O padStart só adiciona zeros se tiver menos de 11 dígitos
		const cpfFormatted = cpfOnlyNumbers.padStart(11, '0');
		
		const result = await signIn('credentials', {
			redirect: false,
			username: cpfFormatted,
			password: cpfFormatted,
		});

		if (result?.error) {
			setError(true);
			return console.error(result);
		}
		setError(false);
		router.push('/home');
	}

	const handleLoginCpf = (pass: HTMLInputElement['value']) => {
		setUser(pass);
		setPass(pass);
	};

	return (
		<Section>
			<ImageCover>
				<div className='marca-produto'>
					{logo ? (
						<Image
							src={logo.url}
							width={logo.width}
							height={logo.height}
							alt={logo.alt}
						/>
					) : (
						''
					)}
				</div>
				{banner ? (
					<Image
						src={banner.url}
						width={banner.width}
						height={banner.height}
						alt={banner.alt}
					/>
				) : (
					<img decoding='async' src='/bgs/generic_bg_man.webp' alt='' />
				)}
			</ImageCover>

			<Content>
				<Label>
					<span>
						<Image src='/raio.svg' width='14' height={16} alt='' />
					</span>
					<h3>sua jornada digital</h3>
				</Label>

				{userType === 'participante' || !userType ? (
					<>
						<h1 className='text-[#070D26] font-bold text-5xl 3xl:text-57 leading-[1.1] mt-[50px] 3xl:mt-[83px]'>
							Ingresse no {title ? title : 'Seu Curso'}
						</h1>
						<h2 className='text-[#6E707A] font-light text-xl md:text-2xl mt-[16px] mb-[38px]'>
							{excerpt
								? excerpt
								: 'Acesse para encontrar o próximo nível do seu negócio :)'}
						</h2>
					</>
				) : (
					<>
						<h1 className='text-[#070D26] font-bold text-5xl 3xl:text-57 leading-[1.1] mt-[50px] 3xl:mt-[83px]'>{`Boas-vindas, ${userType}!`}</h1>
						<h2 className='text-[#6E707A] font-light text-xl md:text-2xl mt-[16px] mb-[38px]'>
							Vem com a gente ajudar o empreendedorismo avançar
						</h2>
					</>
				)}

				<form onSubmit={handleLogin}>
					<FieldWrapper>
						<label className='text-[#070D26] text-3xl font-bold'>
							Digite seu CPF
						</label>
						<input
							value={user}
							onChange={(e) => handleLoginCpf(cpfMask(e.target.value))}
							type='tel'
							name='cpf'
							id='cpf'
							placeholder='000.000.000-00'
							required
						/>
					</FieldWrapper>
					{error ? (
						<p style={{ color: 'tomato' }}>Usuário ou senha incorretos</p>
					) : (
						''
					)}

					<div className='flex justify-end'>
						<Submit
							type='submit'
							onClick={handleLogin}
							className='bt-dhedalos transition-all cursor-pointer'>
							Entrar
							<span>
								<Image src='/seta-right.svg' width='24' height={24} alt='' />
							</span>
						</Submit>
					</div>
				</form>

				<p className='text-[#6E707A] mt-[40px] leading-[1]'>
					Ao continuar você confirma que <br />
					está ciente de nossos{' '}
					<Link
						href={privacyPolicyUrl ?? '/'}
						target='_blank'
						className='text-black-light font-bold underline'>
						Termos de Uso e Privacidade
					</Link>
				</p>

				<div className='marca-parceiro'>
					{projectName === 'sebrae' && (
						<Image src='/sebrae.svg' width='80' alt='' height={40} />
					)}
				</div>
			</Content>
		</Section>
	);
};
