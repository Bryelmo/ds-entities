import axios from 'axios';
import { RegionEntity } from '../../../src/models/Region';

const regionEntityRequests = {

	get: async () => {
		const data = await axios.get(`/ds-entities/regions`);
		return data;
	},
	
	create: async (body: Partial<RegionEntity>) => {
		const data = await axios.post(`/ds-entities/regions`, { data: body });
		return data;
	},
	
	update: async (body: Partial<RegionEntity>) => {
		const data = await axios.put(`/ds-entities/regions/${body.documentId}`, body);
		return data;
	},
	
	delete: async (documentId: string) => {
		const data = await axios.delete(`/ds-entities/regions/${documentId}`);
		return data;
	},

};
export default regionEntityRequests;