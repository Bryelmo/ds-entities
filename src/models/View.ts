import { BlockEntity } from "./Block";
import { DSEntity, DSEntityTypes } from "./Entities";
import { NodeEntity } from "./Node";
import { TagEntity } from "./Tag";
import { TypeEntity } from "./Type";

export interface ViewEntity extends DSEntity {
	Title: string,
	Entity: DSEntityTypes.VIEW,
	Type: TypeEntity,
	Header?: ViewRegion,
	Body?: ViewBody,
	Footer?: ViewRegion,
}

export type ViewRegion = {
	id: number,
	Body?: any[],
	Blocks: BlockEntity[]
}

export type ViewBody = {
	id: number,
	Nodes?: NodeEntity[] | null,
	NodeTypes?: TypeEntity[] | null,
	Tags?: TagEntity[] | null
}

export enum ViewBodyProperties {
	NODES = 'Nodes',
	NODETYPES = 'NodeTypes',
	TAGS = 'Tags'
}