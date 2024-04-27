/**
 * Base webpack config used across other specific configs
 */

import webpack from 'webpack';
import { dependencies as externals } from '../../release/app/package.json';
import WebpackConfig from './webpack.config';
import webpackPaths from './webpack.paths';

// https://github.com/electron-react-boilerplate/electron-react-boilerplate/pull/3052
export default <WebpackConfig>{
  externals: [...Object.keys(externals || {})],

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // Remove this line to enable type checking in webpack builds
            transpileOnly: true,
          },
        },
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    // https://github.com/webpack/webpack/issues/1114
    library: {
      type: 'commonjs2',
    },
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
  },

  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /clone-deep/,
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      REACT_APP_SUPABASE_URL: 'https://zvkrfgunpkfnzonjyvno.supabase.co',
      REACT_APP_SUPABASE_ANON_KEY:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2a3JmZ3VucGtmbnpvbmp5dm5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM3ODUxMjksImV4cCI6MjAyOTM2MTEyOX0.9aAbU2toHB_IwLIJTxUxS_IBT1oLFIXM9DDbieU_h-A',
    }),
  ],
};
