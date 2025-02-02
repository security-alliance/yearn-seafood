import React, {useEffect, useMemo} from 'react';
import axios from 'axios';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from '../context/useAuth';
import Spinner from '../components/controls/Spinner';

export default function GithubCallback() {
	const location = useLocation();
	const navigate = useNavigate();
	const query = useMemo(() => new URLSearchParams(location.search), [location]);
	const {setToken} = useAuth();

	useEffect(() => {
		const deployment = query.get('deployment');
		const code = query.get('code');
		if(deployment === 'localhost') {
			navigate(`/github/callback?code=${code}`);
		} else if(deployment) {
			window.location = `https://${deployment}.${process.env.REACT_APP_STAGING_HOST}`
				+ `/github/callback?code=${code}`;
		} else {
			axios.post('/seafood/api/github/callback', {code}).then(result => {
				setToken(result.data);
				navigate('/seafood');
			});
		}
	}, [query, navigate, setToken]);

	return <div className={'w-full h-screen flex items-center justify-center'}>
		<Spinner size={16} bloom={18} />
	</div>;
}