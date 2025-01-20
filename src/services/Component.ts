
import { Core, Schema } from '@strapi/strapi';
import BlockViewComponent from '../../server/src/components/View';
import BlockReferencesComponent from '../../server/src/components/Reference';
import ViewSectionsComponent from '../../server/src/components/Section';
import { ComponentsUids } from '../models/Component';
import { DSEComponentTypes, viewConfigs } from '../models/Entities';
import { StrapiStoreKeyNames, StrapiStoreNames, StrapiStoreTypes } from '../models/Strapi';

export const ComponentsService = {

	/**
	 *  @description I register DSEntities components
	 *  @param {Core.Strapi} strapi
	 *  @return {Core.Strapi}
	 */
	register(strapi: Core.Strapi): Core.Strapi {
		strapi.components[ComponentsUids.BLOCK_VIEW] = BlockViewComponent as Schema.Component;
		strapi.components[ComponentsUids.VIEW_REFERENCES] = BlockReferencesComponent as Schema.Component;
		strapi.components[ComponentsUids.VIEW_SECTIONS] = ViewSectionsComponent as Schema.Component;
		return strapi
	},

	/**
	 *  @description I init the view configuration for the specific component
	 *  @param {DSEComponentTypes} component
	 *  @return {Promise<any>}
	 */
	async initComponentViewConfiguration(component: DSEComponentTypes): Promise<any> {
		const pluginStore: Partial<any> = strapi.store?.({
			type: StrapiStoreTypes.PLUGIN,
			name: StrapiStoreNames.CONTENT_MANAGER
		});
		await pluginStore?.set({ key: StrapiStoreKeyNames[component], value: viewConfigs[component] });
	}

}