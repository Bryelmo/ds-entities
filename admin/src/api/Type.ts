import axios from 'axios';
import { TypeEntity } from '../../../src/models/Type';

const typeEntityRequests = {

	get: async () => {
		const data = await axios.get(`/ds-entities/entitytypes`);
		return data;
	},
	
	create: async (body: Partial<TypeEntity>) => {
		const data = await axios.post(`/ds-entities/entitytypes`, { data: body });
		return data;
	},
	
	update: async (body: Partial<TypeEntity>) => {
		const data = await axios.put(`/ds-entities/entitytypes/${body.documentId}`, body);
		return data;
	},
	
	delete: async (documentId: string) => {
		const data = await axios.delete(`/ds-entities/entitytypes/${documentId}`);
		return data;
	},

};
export default typeEntityRequests;