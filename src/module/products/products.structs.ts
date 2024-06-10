import { object, string, min, array, partial, number } from 'superstruct';

export const CreateProduct = object({
	name: string(),
	description: string(),
	price: min(number(), 0),
	tags: array(string()),
	images: array(string()),
});

export const PatchProduct = partial(CreateProduct);
