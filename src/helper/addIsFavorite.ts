import { isFavorite } from './isFavorite';

export async function addIsFavorite(
	item: {
		id: string;
		isFavorite?: boolean;
	},
	user: { [key in 'id']: string } | null,
) {
	//

	const boolean = await isFavorite(item.id, user);

	item.isFavorite = boolean;

	return item;
}
