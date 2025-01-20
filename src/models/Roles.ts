export type StrapiAdminRole = {
	id: number,
	documentId: string,
	name: string,
	code: string,
	description: string,
	createdAt: string,
	updatedAt: string,
	publishedAt: string,
	locale: string | null
}

export enum StrapiAdminRoles {
	SUPERADMIN = 'strapi-super-admin',
	EDITOR = 'strapi-editor',
	AUTHOR = 'strapi-author',
}