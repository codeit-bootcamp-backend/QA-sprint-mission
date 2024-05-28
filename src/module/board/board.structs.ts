import { object, string, array, partial } from 'superstruct';

export const CreateBoard = object({
	title: string(),
	content: string(),
	imageUrl: array(string()),
});

export const PatchBoard = partial(CreateBoard);
