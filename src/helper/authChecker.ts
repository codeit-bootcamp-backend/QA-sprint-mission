export const authChecker = ({
	cookies,
}: {
	cookies: Record<string, string>;
}) => {
	if (!cookies.email) {
		throw new Error('로그인이 필요한 서비스입니다');
	}
};
