import { setConfig } from '@faustwp/core'
import { CustomToolbar } from './plugins/CustomToolbar'
import possibleTypes from './possibleTypes.json'
import templates from './src/wp-templates'

/**
 * @type {import('@faustwp/core').FaustConfig}
 **/
export default setConfig({
  templates,
  experimentalPlugins: [new CustomToolbar()],
  experimentalToolbar: true,
  possibleTypes
})
