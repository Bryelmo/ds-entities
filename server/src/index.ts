/**
 * Application methods
 */
import bootstrap from './bootstrap';
import destroy from './destroy';
import register from './register';

/**
 * Plugin server methods
 */
import config from './config';
import contentTypes from './content-types';
import middlewares from './middlewares';
import controllers from './controllers';
import routes from './routes';
import services from './services';

export default {
	register,
	bootstrap,
	destroy,
	config,
	controllers,
	middlewares,
	routes,
	services,
	contentTypes
};
