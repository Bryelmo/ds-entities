import { Entity } from "./Strapi";
import nodeViewConfiguration from './../config/views/node.json';
import blockViewConfiguration from './../config/views/block.json';
import viewViewConfiguration from './../config/views/view.json';
import referencesComponentViewConfiguration from './../config/views/references.component.json';
import sectionsComponentViewConfiguration from './../config/views/sections.component.json';
import viewComponentViewConfiguration from './../config/views/view.component.json';
import { NodeEntity } from "./Node";
import { BlockEntity } from "./Block";
import { ViewEntity } from "./View";

export interface DSEntity extends Entity {
	documentId: string,
	Entity: string,
	Uid: string,
	createdBy: any,
	updatedBy: any,
}

export enum DSEntities {
	NODE = 'plugin::ds-entities.node',
	TYPE = 'plugin::ds-entities.entitytype',
	BLOCK = 'plugin::ds-entities.block',
	REGION = 'plugin::ds-entities.region',
	TAG = 'plugin::ds-entities.tag',
	VIEW = 'plugin::ds-entities.view'
}

export enum DSEntityTypes {
	NODE = 'node',
	TYPE = 'entitytype',
	BLOCK = 'block',
	REGION = 'region',
	TAG = 'tag',
	VIEW = 'view'
}

export const DSEntityReferences = {
	[DSEntityTypes.NODE]: DSEntities.NODE,
	[DSEntityTypes.BLOCK]: DSEntities.BLOCK,
	[DSEntityTypes.VIEW]: DSEntities.VIEW,
}

export enum DSEComponentTypes {
	REFERENCES = 'components_dsentities_references',
	SECTIONS = 'components_dsentities_sections',
	VIEW = 'components_dsentities_view'
}

export const viewConfigs = {
	[DSEntityTypes.NODE]: nodeViewConfiguration,
	[DSEntityTypes.BLOCK]: blockViewConfiguration,
	[DSEntityTypes.VIEW]: viewViewConfiguration,
	[DSEComponentTypes.REFERENCES]: referencesComponentViewConfiguration,
	[DSEComponentTypes.SECTIONS]: sectionsComponentViewConfiguration,
	[DSEComponentTypes.VIEW]: viewComponentViewConfiguration,
}

export enum EntityProperties {
	UID = 'Uid',
	Name = 'Name',
	TITLE = 'Title',
	HIDETITLE = 'HideTitle',
	SLUG = 'Slug',
	ENTITY = 'Entity',
	TYPE = 'Type',
	IMAGE = 'Image',
	CREATEDAT = 'createdAt',
	UPDATEDAT = 'updatedAt',
	PUBLISHEDAT = 'publishedAt',
	TAGS = 'Tags',
	LOCALIZATIONS = 'localizations',
}

export type EntitiesTypeMap = {
	[type: string]: { 
		[uid: string]: DSEntity 
	}
}