const isArray = <T extends { [key in 'ownerId']: { id: string } }>(
	dbData: T | Array<T>,
): dbData is Array<T> => {
	return 'at' in dbData;
};

// TODO: 나중에 이 함수를 수정해서 ownerId외에도 다양한 타입을 받을 수 있게 처리하려고 함.
export const ownerIdFormatter = <
	T extends { [key in 'ownerId']: { id: string } },
>(
	dbData: T[] | T,
) => {
	if (isArray(dbData)) {
		return dbData.map((item) => ({
			...item,
			ownerId: item.ownerId.id,
		}));
	} else {
		return {
			...dbData,
			ownerId: dbData.ownerId.id,
		};
	}
};
