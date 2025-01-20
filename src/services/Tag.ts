import { TagEntity, TagEntityProperties } from "../models/Tag";
import { EntitiesService } from "./Entities";

export const TagService = {

	/**
	 *  @var fields
	 *  @description Fields that needs to be available in API
	 */
	fields: [
		TagEntityProperties.NAME
	],

	/**
	 *  @description I clean the tag object data from API from useless data
	 *  @param {TagEntity} tag
	 *  @return {TagEntity}
	 */
	removeUselessData(tag: TagEntity): TagEntity {
		let cleaned: Partial<TagEntity> = { ...tag };
		delete cleaned.id;
		delete cleaned.createdAt;
		delete cleaned.updatedAt;
		delete cleaned.publishedAt;
		return { ...EntitiesService.cleanNullData(cleaned) }
	}

}