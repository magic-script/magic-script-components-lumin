declare module "magic-script-components-lumin" {

  import { ReactElement } from 'react';
  import { AppProps } from 'magic-script-components'

  export default class {
    static bootstrap: (app: ReactElement<AppProps>) => void;
  }
}
