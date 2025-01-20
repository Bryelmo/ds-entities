import { DSEntity } from "./Entities";
import { NodeEntity } from "./Node";
import { RegionEntity } from "./Region";
import { TypeEntity } from "./Type";
import { ViewEntity } from "./View";

export interface BlockEntity extends DSEntity {
	Type: TypeEntity,
	Context?: BlockContext,
	Region: RegionEntity,
	Weight: number,
	Views?: ViewEntity | null,
}

export type BlockContext = {
	id?: number,
	Nodes?: NodeEntity[] | string[] | undefined | null,
	NodeTypes?: TypeEntity[] | string[] | undefined | null
}

export type BlockPerRegionResponse = { [region:string]: BlockEntity[] }

