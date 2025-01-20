import { Entity } from "./Strapi";
import { DSEntities, DSEntityTypes } from "./Entities";

export interface TypeEntity extends Entity {
	documentId: string,
	Label: string,
	Name: string,
	Default: boolean,
	Reference: DSEntityTypes,
}

export enum TypeEntityProperties {
	LABEL = 'Label',
	NAME = 'Name'
}

export const DSEntityReferenceTypes = {
	[DSEntities.NODE]: DSEntityTypes.NODE,
	[DSEntities.BLOCK]: DSEntityTypes.BLOCK,
	[DSEntities.VIEW]: DSEntityTypes.VIEW
}