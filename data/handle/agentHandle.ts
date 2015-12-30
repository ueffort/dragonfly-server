/**
 * Created by tutu on 15-12-21.
 */

class AgentHandle {

    private static handle: AgentHandle;

    constructor() {
        return;
    }

    public static getInstance(): AgentHandle {
        if (!this.handle) {
            this.handle = new AgentHandle;
        }
        return this.handle;
    }

    public send(): void {
        return;
    }

    public wait(): void {
        return;
    }
}

export default AgentHandle
