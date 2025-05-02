import { Core } from '@strapi/strapi';
import { StrapiLocale } from "../models/Strapi";

export const LocaleService = {

	/**
	 *  @var {StrapiLocale} default
	 *  @description Default Language
	 */
	default: {} as StrapiLocale,

	/**
		 *  @description I return the entity list
		 *  @param {DSEntities} entity
		 *  @param {Any} filters
		 *  @return {Promise<any[]>}
		 */
		async getDefaultLocale(): Promise<any[]> {
			return strapi.plugins.i18n.services.locales.getDefaultLocale() as Promise<any[]>;
		},

}