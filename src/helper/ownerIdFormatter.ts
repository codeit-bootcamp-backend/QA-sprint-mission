type DbData = { [key in 'ownerId']: { id: string } };

const isArray = <T extends DbData>(
	dbData: T | Array<T>,
): dbData is Array<T> => {
	return 'at' in dbData;
};

export function ownerIdFormatter<T extends DbData>(dbData: T): T;
export function ownerIdFormatter<T extends DbData>(dbData: T[]): T[];

export function ownerIdFormatter<T extends DbData>(dbData: T[] | T) {
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
}
