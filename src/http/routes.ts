import { handlersGet } from './get/';
import { handlersPost } from './post/';

export const routes = [...handlersGet, ...handlersPost];
