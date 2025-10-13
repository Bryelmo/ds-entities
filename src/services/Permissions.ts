import { Core } from '@strapi/strapi';
import { StrapiAdminUser, StrapiPlugins, StrapiUserRoles } from '../models/Strapi';
import { dsEntitiesPluginName } from '../models/DSEntities';
import { DSEntities} from '../models/Entities';
import { TypeEntity } from '../models/Type';
import { PermissionActions, StrapiAbilityCondition, StrapiPermissionAbility } from './../models/Permissions';
import { StrapiAdminRoles } from '../models/Roles';

export const PermissionsService = {

	/**
	 *  @description I init the permissions for plugins apis
	 *  @param {Strapi} strapi
	 *  @return {Promise<any>}
	 */
	async init(strapi: Core.Strapi): Promise<any> {
		const roleService = await strapi.service(StrapiPlugins.USER_PERMISSIONS);
		const roles = await roleService.find();
		const publicRole = await roleService.findOne(
			roles.filter((role) => role.type === StrapiUserRoles.PUBLIC)?.[0]?.id);
		const dsEntitiesPermissions = publicRole.permissions[dsEntitiesPluginName];
		Object.keys(dsEntitiesPermissions.controllers).forEach((permission:any) => {
			dsEntitiesPermissions.controllers[permission].find.enabled = true;
		});
		await roleService.updateRole(publicRole.id, publicRole);
	},

	/**
	 *  @description I create new permissions conditions for each node type
	 *  @param {Strapi} strapi
	 *  @param {TypeEntity[]} typeEntities
	 *  @return {Any}
	 */
	registerEntityPermissions(strapi: Core.Strapi, typeEntities: TypeEntity[]): any {
		let conditions: any[] = [];
		typeEntities?.forEach((typeentity: TypeEntity) => {
			const condition = {
				displayName: `Node is ${typeentity.Label} type`,
				name: `is-node-${typeentity.Name}-type`,
				category: 'DS Entities',
				plugin: 'ds-entities',
				async handler(user) { return true },
			}
			conditions.push(condition);
		});
		return strapi.service('admin::permission').conditionProvider.registerMany(conditions);
	},
	
	/**
	 *  @description I return the reading permission action rule for specifc entity
	 *  @param {StrapiPermissionAbility[]} abilities
	 *  @param {DSEntities} entity
	 *  @return {StrapiPermissionAbility}
	 */
	getEntityReadingPermissions(abilities: StrapiPermissionAbility[], entity: DSEntities): StrapiPermissionAbility | undefined {
		return abilities.find(ability => ability.subject === entity && ability.action === PermissionActions.READ);
	},
	
	/**
	 *  @description I return the node type condition provider rule related to the admin user
	 *  @param {Core.Strapi} strapi
	 *  @param {Any} request
	 *  @return {Promise<Any>}
	 */
	async getUserAbilityCondition(strapi: Core.Strapi, request: any): Promise<any[]> {
		const readingAbility: any[] = await this.getUserReadingAbility(strapi, request);
		const conditionsProviders = strapi.admin.services.permission.conditionProvider.values();
		const conditionProvider = conditionsProviders.filter(condition => readingAbility.includes(condition.id));
		return await conditionProvider || null;
	},

	/**
	 *  @description I return the node type reading ability condition for the admin user
	 *  @param {Core.Strapi} strapi
	 *  @param {Any} request
	 *  @return {Promise<StrapiAbilityCondition[]>}
	 */
	async getUserReadingAbility(strapi: Core.Strapi, request: any): Promise<StrapiAbilityCondition[]> {
		const user: StrapiAdminUser = await this.getUserFromRequest(request);
		const userAbilities = await strapi.admin.services.permission.findUserPermissions(user);
		const readingAbility = this.getEntityReadingPermissions(userAbilities, DSEntities.NODE);
		return readingAbility.conditions;
	},

	/**
	 *  @description I return the admin user data from the JWT
	 *  @param {Any} request
	 *  @return {Promise<StrapiAdminUser>}
	 */
	async getUserFromRequest(request: any): Promise<StrapiAdminUser> {
		const payload: any = this.parseJWT(request.headers.authorization);
		return await strapi.db.query('admin::user').findOne({
			where: { id: payload.userId },
			populate: ['roles']
		});
	},

	/**
	 *  @description I return the node type name list enabled for the admin user
	 *  @param {Core.Strapi} strapi
	 *  @param {Any} ctx
	 *  @return {Promise<string[] | null>}
	 */
	async getTypeNamePerAdminRole(strapi: Core.Strapi, ctx: any): Promise<string[] | null> {
		const { request } = ctx;
		let names:string[] = [];
		const readingCondition: any = await PermissionsService.getUserAbilityCondition(strapi, request);
		readingCondition?.forEach((condition) => {
			const name = condition.id.match(new RegExp(`plugin::ds-entities.is-node-` + "(.*)" + `-type`))?.[1] || '';
			names.push(name);
		})
		return (await readingCondition) ? names : null
	},

	/**
	 *  @description I return the data parsed from the JWT
	 *  @param {String} authorization_header
	 *  @return {String}
	 */
	parseJWT(authorization_header: string): string {
		const jwt = authorization_header || '';
		return JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString('utf8'));
	},

	/**
	 *  @description I check if the request is authenticated with JWT
	 *  @param {Any} request
	 *  @return {Boolean}
	 */
	existJwt(request: any): boolean {
		return request.headers?.authorization && request.headers?.authorization.includes('Bearer') || false;
	},
	
	/**
	 *  @description I check if the request is done by SuperAdmin user
	 *  @param {Any} request
	 *  @return {Promise<Boolean>}
	 */
	async isSuperAdmin(request: any): Promise<boolean> {
		const existJwt = await this.existJwt(request);
		const user: StrapiAdminUser = await this.getUserFromRequest(request);
		const is: boolean = user.roles.findIndex(role => role.code === StrapiAdminRoles.SUPERADMIN) !== -1 || false;
		return existJwt && is;
	}

}