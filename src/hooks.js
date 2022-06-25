import * as cookie from 'cookie';
import { sequence } from '@sveltejs/kit/hooks';


async function processCookies({ event, resolve }) {
	// pre-process here
	const { request, locals } = event;
	const cookiesToSet = {};
	locals.cookies = cookie.parse(request.headers.get('cookie') || '');
	locals.setCookies = (cookies) => {
			Object.assign(cookiesToSet, cookies);
	};

	const response = await resolve(event);
	// post-process here

	const setCookieHeader = Object.entries(cookiesToSet)
		.map(([ key, data ]) => {
			 const [value, options] = typeof data === 'string' ? [data, {}] :  data;

			 return cookie.serialize(key, value, options);
		});
	response.headers.set('set-cookie', setCookieHeader);

	return response;
}

async function processSessionId({ event, resolve }) {
	const { request, locals } = event;

	const sessionId = locals.sessionId = locals.cookies.sessionId || crypto.randomUUID();

	const response = await resolve(event);

	locals.setCookies({
		sessionId: [sessionId, { httpOnly: true, maxAge: 60 * 60 * 24 }],
	});

	return response;
}
export const handle = sequence(processCookies, processSessionId);

export function getSession(event) {
	const { locals } = event;
	const { sessionId } = locals;

	return {
		sessionId,
	};
  }
