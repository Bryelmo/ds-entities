import { DSEComponentTypes, DSEntityTypes } from './Entities';

export interface Entity {
	id: number,
	documentId: string,
	createdAt: string,
	updatedAt: string,
	publishedAt?: string,
	locale: string
}

export enum StrapiStoreTypes {
	CORE = 'core',
	API = 'api',
	PLUGIN = 'plugin',
}

export enum StrapiStoreNames {
	CONTENT_MANAGER = 'content_manager'
}

export enum StrapiStoreKeys {
	NODE_VIEW_CONFIG = 'configuration_content_types::plugin::ds-entities.node',
	BLOCK_VIEW_CONFIG = 'configuration_content_types::plugin::ds-entities.block',
	VIEW_VIEW_CONFIG = 'configuration_content_types::plugin::ds-entities.view',
	REFERENCES_COMPONENT_VIEW_CONFIG = 'configuration_components::dsentities.references',
	SECTIONS_COMPONENT_VIEW_CONFIG = 'configuration_components::dsentities.sections',
	VIEW_COMPONENT_VIEW_CONFIG = 'configuration_components::dsentities.view',
}

export const StrapiStoreKeyNames = {
	[DSEntityTypes.NODE]: StrapiStoreKeys.NODE_VIEW_CONFIG,
	[DSEntityTypes.BLOCK]: StrapiStoreKeys.BLOCK_VIEW_CONFIG,
	[DSEntityTypes.VIEW]: StrapiStoreKeys.VIEW_VIEW_CONFIG,
	[DSEComponentTypes.REFERENCES]: StrapiStoreKeys.REFERENCES_COMPONENT_VIEW_CONFIG,
	[DSEComponentTypes.SECTIONS]: StrapiStoreKeys.SECTIONS_COMPONENT_VIEW_CONFIG,
	[DSEComponentTypes.VIEW]: StrapiStoreKeys.VIEW_COMPONENT_VIEW_CONFIG,
}

export enum StrapiPlugins {
	USER_PERMISSIONS = 'plugin::users-permissions.role'
}

export enum StrapiUserRoles {
	PUBLIC = 'public'
}

export enum StrapiFilterTypes {
	AND = '$and',
	OR = '$or',
	NOT = '$not',
	EQUAL = '$eq',
}

export interface StrapiAdminUser extends Entity {
	firstname?: string,
	lastname?: string,
	username: string,
	email: string,
	password: string,
	resetPasswordToken: string,
	registrationToken: string,
	isActive: boolean,
	blocked: boolean,
	preferedLanguage: string,
	roles: StrapiUserRole[]
}

export interface StrapiUserRole extends Entity {
	name: string,
	code: string,
	description: string
}

export interface StrapiLocale extends Entity {
	name: string,
	code: string,
	isDefault: boolean
}