import { DSEntity } from "./Entities";
import { StrapiFilterTypes } from "./Strapi";
import { TagEntity } from "./Tag";
import { TypeEntity } from "./Type";

export interface NodeEntity extends DSEntity {
	Slug: string,
	Type: TypeEntity,
	Tags: TagEntity[] | null
}

export type NodesQueryFilter = {
	NodeTypes?: NodeFilter,
	Tags?: NodeFilter,
}

export type NodeFilter = {
	values: string[],
	type: StrapiFilterTypes
}

export enum NodeEntityProperties {
	TITLE = 'Title',
	HIDETITLE = 'HideTitle',
	SLUG = 'Slug',
	ENTITY = 'Entity',
	UID = 'Uid',
	TYPE = 'Type',
	CREATEDAT = 'createdAt',
	UPDATEDAT = 'updatedAt',
	PUBLISHEDAT = 'publishedAt',
	TAGS = 'Tags',
	LOCALIZATIONS = 'localizations',
}