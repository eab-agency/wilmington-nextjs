import { setConfig } from '@faustwp/core'

import { RelayStylePaginationPlugin } from './plugins/RelayStylePaginationPlugin'
import possibleTypes from './possibleTypes.json'
import templates from './wp-templates'

/**
 * @type {import('@faustwp/core').FaustConfig}
 **/
export default setConfig({
  templates,
  plugins: [new RelayStylePaginationPlugin()],
  experimentalToolbar: true,
  possibleTypes,
  useGETForQueries: false,
  graphqlEndpoint: '/index.php?graphql' // Updated to match the new WPGraphQL endpoint path
})
