import { object, string, partial } from 'superstruct';

export const CreateComment = object({
	content: string(),
});

export const PatchComment = partial(CreateComment);
