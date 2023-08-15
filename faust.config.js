import { setConfig } from '@faustwp/core'

import { CustomToolbar } from './plugins/CustomToolbar'
import { RelayStylePaginationPlugin } from './plugins/RelayStylePaginationPlugin'
import possibleTypes from './possibleTypes.json'
import templates from './wp-templates'

/**
 * @type {import('@faustwp/core').FaustConfig}
 **/
export default setConfig({
  templates,
  experimentalPlugins: [new CustomToolbar(), new RelayStylePaginationPlugin()],
  experimentalToolbar: true,
  possibleTypes,
  useGETForQueries: false
})
