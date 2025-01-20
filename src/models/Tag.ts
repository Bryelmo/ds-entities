import { Entity } from "./Strapi";

export interface TagEntity extends Entity {
	Label?: string,
	Name: string
}

export enum TagEntityProperties {
	NAME = 'Name'
}