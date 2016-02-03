/**
 * Created by tutu on 15-12-17.
 */

import App from "../app/App";

class Controller{
    protected static app:App;

    public static setApp(app:App): void {
        this.app = app;
    }
}

export default Controller
