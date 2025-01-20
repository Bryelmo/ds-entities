import { Entity } from "./Strapi";

export interface RegionEntity extends Entity {
	Label: string,
	Name: string,
	Default: boolean,
}

export enum RegionEntityProperties {
	NAME = 'Name'
}