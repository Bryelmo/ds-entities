import { DSEntities } from "../../src/models/Entities";

export enum PermissionActions {
	CREATE = 'plugin::content-manager.explorer.create',
	UPDATE = 'plugin::content-manager.explorer.update',
	DELETE = 'plugin::content-manager.explorer.delete',
	PUBLISH = 'plugin::content-manager.explorer.publish',
	READ = 'plugin::content-manager.explorer.read'
}

export type StrapiPermissionAbility = {
	action: PermissionActions,
	subject: DSEntities,
	fields: string[],
	conditions: any
}

export type StrapiAbilityCondition = `plugin::ds-entities.is-node-${string}-type`;

export type ReadingConditionFilter = { Type: { Name: { ['$eq']: string } } }